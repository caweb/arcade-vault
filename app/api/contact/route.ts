import { Resend } from "resend";
import {
  normalizeContactPayload,
  validateContactPayload,
} from "@/app/lib/contact-validation";

const CONTACT_SUBJECT = "[Arcade Vault] Nuevo mensaje de contacto";
const INVALID_JSON_ERROR = "La solicitud no contiene un JSON válido.";
const SERVICE_UNAVAILABLE_ERROR = "El servicio de contacto no está disponible. Inténtalo de nuevo más tarde.";

export async function POST(request: Request) {
  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: INVALID_JSON_ERROR },
      { status: 400 },
    );
  }

  const payload = normalizeContactPayload(input);
  const validationError = validateContactPayload(payload);

  if (validationError) {
    return Response.json(
      { ok: false, error: validationError },
      { status: 400 },
    );
  }

  if (payload.website) {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return Response.json(
      { ok: false, error: SERVICE_UNAVAILABLE_ERROR },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: CONTACT_SUBJECT,
      replyTo: payload.email,
      text: `Nombre: ${payload.name}\nCorreo electrónico: ${payload.email}\n\nMensaje:\n${payload.message}`,
    });

    if (error) {
      return Response.json(
        { ok: false, error: SERVICE_UNAVAILABLE_ERROR },
        { status: 503 },
      );
    }
  } catch {
    return Response.json(
      { ok: false, error: SERVICE_UNAVAILABLE_ERROR },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}
