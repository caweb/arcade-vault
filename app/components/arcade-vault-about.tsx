"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import {
  CONTACT_LIMITS,
  normalizeContactPayload,
  validateContactPayload,
  type ContactPayload,
  type ContactResponse,
} from "../lib/contact-validation";

type HighlightKind = "HEART" | "BROWSER" | "PLANT";
type Highlight = {
  kind: HighlightKind;
  text: string;
  accent: "magenta" | "cyan" | "green";
};

type ContactFormResponse = ContactResponse | null;

const EMPTY_FORM: ContactPayload = {
  name: "",
  email: "",
  message: "",
  website: "",
};

const HIGHLIGHTS: readonly Highlight[] = [
  { kind: "HEART", text: "HECHO CON ❤️ PARA JUGADORES", accent: "magenta" },
  { kind: "BROWSER", text: "JUEGOS EN HTML — CORREN EN CUALQUIER NAVEGADOR", accent: "cyan" },
  { kind: "PLANT", text: "PROYECTO EN CONSTANTE CRECIMIENTO", accent: "green" },
];

const SUCCESS_MESSAGE = "No se pudo confirmar el envío. Inténtalo de nuevo más tarde.";

function useAboutReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".about .reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function HighlightIcon({ kind }: { kind: HighlightKind }) {
  if (kind === "HEART") {
    return (
      <svg className="hl-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <g fill="currentColor">
          <rect x="2" y="3" width="4" height="2" /><rect x="10" y="3" width="4" height="2" />
          <rect x="1" y="4" width="2" height="4" /><rect x="13" y="4" width="2" height="4" />
          <rect x="2" y="8" width="2" height="2" /><rect x="12" y="8" width="2" height="2" />
          <rect x="3" y="9" width="10" height="2" />
          <rect x="4" y="11" width="8" height="2" />
          <rect x="5" y="12" width="6" height="2" />
          <rect x="6" y="13" width="4" height="1" />
          <rect x="7" y="14" width="2" height="1" />
        </g>
      </svg>
    );
  }

  if (kind === "BROWSER") {
    return (
      <svg className="hl-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <g fill="currentColor">
          <rect x="1" y="2" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="1" y="2" width="14" height="3" />
          <rect x="3" y="3" width="1" height="1" fill="var(--bg)" />
          <rect x="5" y="3" width="1" height="1" fill="var(--bg)" />
          <rect x="7" y="3" width="1" height="1" fill="var(--bg)" />
          <rect x="3" y="7" width="4" height="1" /><rect x="3" y="9" width="6" height="1" /><rect x="3" y="11" width="3" height="1" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="hl-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <g fill="currentColor">
        <rect x="7" y="2" width="2" height="10" />
        <rect x="4" y="4" width="3" height="2" /><rect x="9" y="6" width="3" height="2" />
        <rect x="3" y="3" width="2" height="2" /><rect x="11" y="5" width="2" height="2" />
        <rect x="3" y="12" width="10" height="2" />
        <rect x="4" y="14" width="8" height="1" />
      </g>
    </svg>
  );
}

function isContactResponse(value: unknown): value is ContactResponse {
  if (typeof value !== "object" || value === null) return false;
  const response = value as ContactFormResponse;
  if (response?.ok === true) return true;
  return response?.ok === false && typeof response.error === "string";
}

export default function ArcadeVaultAbout() {
  useAboutReveal();
  const [form, setForm] = useState<ContactPayload>(EMPTY_FORM);
  const [sentName, setSentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const updateField = (field: keyof ContactPayload, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const triggerShake = () => {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedPayload = normalizeContactPayload(form);
    const validationError = validateContactPayload(normalizedPayload);

    if (validationError) {
      setError(validationError);
      triggerShake();
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedPayload),
      });
      const result: unknown = await response.json();

      if (response.status === 200 && isContactResponse(result) && result.ok) {
        setSentName(normalizedPayload.name);
        return;
      }

      setError(isContactResponse(result) && !result.ok ? result.error : SUCCESS_MESSAGE);
      triggerShake();
    } catch {
      setError("No se pudo conectar con el servicio de contacto. Inténtalo de nuevo.");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSentName(null);
    setError(null);
  };

  return (
    <main className="about fade-in">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="kicker pixel neon-yellow">▸ ACERCA DE</div>
        <h1 id="about-title" className="about-title">ACERCA DE ARCADE VAULT</h1>
        <p className="about-mission">
          ARCADE VAULT nació del amor por los videojuegos clásicos. Nuestra misión es preservar y celebrar
          los arcades que definieron una generación, haciéndolos accesibles para todos, en cualquier lugar
          y sin costo.
        </p>

        <div className="highlight-row">
          {HIGHLIGHTS.map((highlight, index) => (
            <div
              key={highlight.kind}
              className={`highlight ${highlight.accent}`}
              style={{ transitionDelay: `${index * 80}ms` } satisfies CSSProperties}
            >
              <HighlightIcon kind={highlight.kind} />
              <div className="hl-text pixel">{highlight.text}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="about-divider reveal" aria-hidden="true">
        <div className="div-bar" />
        <div className="div-pixels">
          {Array.from({ length: 24 }, (_, index) => (
            <span key={index} style={{ animationDelay: `${index * 80}ms` }} />
          ))}
        </div>
        <div className="div-bar" />
      </div>

      <section className="about-contact reveal" aria-labelledby="contact-title">
        <div className="contact-grid">
          <div className="contact-intro">
            <div className="kicker pixel neon-cyan">▸ CONTACTO</div>
            <h2 id="contact-title" className="contact-title">CONTÁCTANOS</h2>
            <p className="contact-sub">
              ¿Tienes alguna sugerencia, quieres proponer un juego, o simplemente quieres saludar?
              Escríbenos.
            </p>
            <div className="contact-tips">
              <div className="tip"><span className="tip-led" />RESPUESTA EN 24-48H</div>
              <div className="tip"><span className="tip-led y" />SUGERENCIAS BIENVENIDAS</div>
              <div className="tip"><span className="tip-led m" />SIN SPAM, JAMÁS</div>
            </div>
          </div>

          <form
            className={`contact-form${shake ? " shake" : ""}`}
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            aria-describedby={error ? "contact-form-error" : undefined}
            noValidate
          >
            {!sentName ? (
              <>
                <div className="field">
                  <label htmlFor="contact-name">NOMBRE</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="px_kai"
                    autoComplete="name"
                    maxLength={CONTACT_LIMITS.name}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">CORREO ELECTRÓNICO</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="jugador@vault.gg"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact-message">MENSAJE</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Cuéntanos qué tienes en mente…"
                    maxLength={CONTACT_LIMITS.message}
                    required
                  />
                </div>
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="contact-website">SITIO WEB</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    value={form.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                {error && <div id="contact-form-error" className="contact-error" role="alert">{error}</div>}
                <button className="btn xl press" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "▶  ENVIANDO..." : "▶  ENVIAR MENSAJE"}
                </button>
              </>
            ) : (
              <div className="terminal-success" role="status" aria-live="polite">
                <div className="term-bar">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="term-title">VAULT-OS // TERMINAL</span>
                </div>
                <div className="term-body">
                  <div className="line"><span className="prompt">vault@arcade:~$</span> ./send_message --to=team</div>
                  <div className="line dim">[OK] Conectando con servidor…</div>
                  <div className="line dim">[OK] Validando contenido…</div>
                  <div className="line dim">[OK] Transmitiendo paquete…</div>
                  <div className="line success">&gt; MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, {sentName.toUpperCase()}.<span className="caret">_</span></div>
                  <div className="terminal-action">
                    <button className="btn ghost" type="button" onClick={resetForm}>ENVIAR OTRO MENSAJE</button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
