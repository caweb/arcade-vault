"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const USER_STORAGE_KEY = "av_user";
const USER_CHANGE_EVENT = "av-user-change";

type AuthTab = "in" | "up";

function normalizeUsername(value: string) {
  return (value.trim() || "PLAYER1").toUpperCase().slice(0, 10);
}

function persistUser(name: string) {
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ name }));
    window.dispatchEvent(new Event(USER_CHANGE_EVENT));
  } catch {
    return;
  }
}

export default function ArcadeVaultAuth() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>("in");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    persistUser(normalizeUsername(username));
    router.push("/games");
  };

  const playAsGuest = () => {
    router.push("/games");
  };

  return (
    <main className="av-auth-wrap fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="mark" aria-hidden="true" />
          <h1 className="neon-cyan">ARCADE VAULT</h1>
          <div className="mono auth-version">ACCESO AL SISTEMA · v2.6</div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Tipo de acceso">
          <button
            className={tab === "in" ? "on" : ""}
            type="button"
            role="tab"
            aria-selected={tab === "in"}
            onClick={() => setTab("in")}
          >
            INICIAR SESIÓN
          </button>
          <button
            className={tab === "up" ? "on" : ""}
            type="button"
            role="tab"
            aria-selected={tab === "up"}
            onClick={() => setTab("up")}
          >
            CREAR CUENTA
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="auth-username">Usuario</label>
            <input
              id="auth-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="px_kai"
              maxLength={10}
              autoComplete="username"
            />
          </div>
          {tab === "up" && (
            <div className="field slide-in">
              <label htmlFor="auth-email">Correo electrónico</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jugador@vault.gg"
                autoComplete="email"
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="auth-password">Contraseña</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={tab === "in" ? "current-password" : "new-password"}
            />
          </div>

          <button className="btn lg auth-submit" type="submit">
            {tab === "in" ? "ENTRAR AL VAULT" : "CREAR Y JUGAR"}
          </button>
        </form>

        <button className="btn ghost guest-button" type="button" onClick={playAsGuest}>
          JUGAR COMO INVITADO
        </button>

        <div className="auth-divider">O CONTINÚA CON</div>
        <div className="social">
          <button className="btn ghost" type="button">◆ GOOGLE</button>
          <button className="btn ghost" type="button">▣ GITHUB</button>
        </div>

        <div className="auth-terms">
          AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
        </div>
      </div>
    </main>
  );
}
