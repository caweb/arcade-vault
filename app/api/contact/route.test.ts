import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { resendSend, ResendMock } = vi.hoisted(() => {
  const resendSend = vi.fn();
  const ResendMock = vi.fn(function MockResend() {
    return { emails: { send: resendSend } };
  });
  return { resendSend, ResendMock };
});

vi.mock("resend", () => ({ Resend: ResendMock }));

import { POST } from "./route";

const VALID_PAYLOAD = {
  name: "PX_KAI",
  email: "player@example.com",
  message: "Hola, gracias por crear Arcade Vault.",
  website: "",
};

function makeRequest(body: unknown, raw = false) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? String(body) : JSON.stringify(body),
  });
}

async function getBody(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_TO_EMAIL", "team@arcade-vault.test");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Arcade Vault <contact@arcade-vault.test>");
    resendSend.mockResolvedValue({ data: { id: "email_123" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("sends a normalized plain-text email and returns success", async () => {
    const response = await POST(
      makeRequest({
        name: "  PX_KAI ",
        email: " player@example.com ",
        message: "  Hola, gracias por crear Arcade Vault.  ",
        website: "",
      }),
    );

    expect(response.status).toBe(200);
    expect(await getBody(response)).toEqual({ ok: true });
    expect(ResendMock).toHaveBeenCalledWith("re_test_key");
    expect(resendSend).toHaveBeenCalledWith({
      from: "Arcade Vault <contact@arcade-vault.test>",
      to: "team@arcade-vault.test",
      subject: "[Arcade Vault] Nuevo mensaje de contacto",
      replyTo: "player@example.com",
      text: "Nombre: PX_KAI\nCorreo electrónico: player@example.com\n\nMensaje:\nHola, gracias por crear Arcade Vault.",
    });
  });

  it.each([
    ["name", { ...VALID_PAYLOAD, name: "" }],
    ["email", { ...VALID_PAYLOAD, email: "" }],
    ["message", { ...VALID_PAYLOAD, message: "" }],
  ])("rejects a missing %s field", async (_field, payload) => {
    const response = await POST(makeRequest(payload));

    expect(response.status).toBe(400);
    expect((await getBody(response)).ok).toBe(false);
    expect(ResendMock).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without sending", async () => {
    const response = await POST(makeRequest({ ...VALID_PAYLOAD, email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect((await getBody(response)).ok).toBe(false);
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each([
    ["name", { ...VALID_PAYLOAD, name: "n".repeat(81) }],
    ["email", { ...VALID_PAYLOAD, email: `${"a".repeat(245)}@example.com` }],
    ["message", { ...VALID_PAYLOAD, message: "m".repeat(5001) }],
  ])("rejects an oversized %s field without sending", async (_field, payload) => {
    const response = await POST(makeRequest(payload));

    expect(response.status).toBe(400);
    expect((await getBody(response)).ok).toBe(false);
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("silently accepts a non-empty honeypot without sending", async () => {
    const response = await POST(
      makeRequest({ ...VALID_PAYLOAD, website: "https://bot.example" }),
    );

    expect(response.status).toBe(200);
    expect(await getBody(response)).toEqual({ ok: true });
    expect(ResendMock).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON without sending", async () => {
    const response = await POST(makeRequest("{", true));

    expect(response.status).toBe(400);
    expect((await getBody(response)).ok).toBe(false);
    expect(ResendMock).not.toHaveBeenCalled();
    expect(resendSend).not.toHaveBeenCalled();
  });

  it.each(["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"])(
    "returns 503 when %s is missing",
    async (variable) => {
      vi.stubEnv(variable, "");

      const response = await POST(makeRequest(VALID_PAYLOAD));

      expect(response.status).toBe(503);
      expect(await getBody(response)).toEqual({
        ok: false,
        error: "El servicio de contacto no está disponible. Inténtalo de nuevo más tarde.",
      });
      expect(ResendMock).not.toHaveBeenCalled();
      expect(resendSend).not.toHaveBeenCalled();
    },
  );

  it("returns a safe 503 when Resend returns an error", async () => {
    resendSend.mockResolvedValueOnce({
      data: null,
      error: { message: "provider detail", statusCode: 422, name: "validation_error" },
    });

    const response = await POST(makeRequest(VALID_PAYLOAD));

    expect(response.status).toBe(503);
    expect(await getBody(response)).toEqual({
      ok: false,
      error: "El servicio de contacto no está disponible. Inténtalo de nuevo más tarde.",
    });
  });

  it("returns a safe 503 when Resend throws", async () => {
    resendSend.mockRejectedValueOnce(new Error("network detail"));

    const response = await POST(makeRequest(VALID_PAYLOAD));

    expect(response.status).toBe(503);
    expect(await getBody(response)).toEqual({
      ok: false,
      error: "El servicio de contacto no está disponible. Inténtalo de nuevo más tarde.",
    });
  });
});
