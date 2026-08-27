export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string };

export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeContactPayload(input: unknown): ContactPayload {
  const record = typeof input === "object" && input !== null && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {};

  return {
    name: normalizeText(record.name),
    email: normalizeText(record.email),
    message: normalizeText(record.message),
    website: normalizeText(record.website),
  };
}

export function validateContactPayload(payload: ContactPayload): string | null {
  if (!payload.name) {
    return "El nombre es obligatorio.";
  }

  if (payload.name.length > CONTACT_LIMITS.name) {
    return "El nombre no puede superar los 80 caracteres.";
  }

  if (!payload.email) {
    return "El correo electrónico es obligatorio.";
  }

  if (payload.email.length > CONTACT_LIMITS.email) {
    return "El correo electrónico no puede superar los 254 caracteres.";
  }

  if (!EMAIL_PATTERN.test(payload.email)) {
    return "Introduce un correo electrónico válido.";
  }

  if (!payload.message) {
    return "El mensaje es obligatorio.";
  }

  if (payload.message.length > CONTACT_LIMITS.message) {
    return "El mensaje no puede superar los 5.000 caracteres.";
  }

  return null;
}
