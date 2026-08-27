"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore, useState, type ReactNode } from "react";
import type { MockUser } from "../lib/arcade-vault-data";

const USER_STORAGE_KEY = "av_user";
const USER_CHANGE_EVENT = "av-user-change";

function subscribeToUser(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(USER_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(USER_CHANGE_EVENT, onStoreChange);
  };
}

function getUserSnapshot() {
  try {
    return window.localStorage.getItem(USER_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parseStoredUser(rawUser: string): MockUser | null {
  if (!rawUser) return null;

  try {
    const parsedUser: unknown = JSON.parse(rawUser);
    if (typeof parsedUser !== "object" || parsedUser === null) return null;

    const userRecord = parsedUser as { name?: unknown };
    return typeof userRecord.name === "string" ? { name: userRecord.name } : null;
  } catch {
    return null;
  }
}

function NavLink({
  href,
  active,
  children,
  onClick,
  tabIndex,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
  tabIndex?: number;
}) {
  return (
    <Link
      className={active ? "active" : undefined}
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {children}
    </Link>
  );
}

export default function ArcadeVaultShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const storedUser = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => "");
  const user = parseStoredUser(storedUser);
  const libraryActive = pathname === "/" || pathname.startsWith("/games");
  const hallActive = pathname.startsWith("/hall-of-fame");
  const authActive = pathname.startsWith("/auth");

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    try {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      return;
    }
    window.dispatchEvent(new Event(USER_CHANGE_EVENT));
    setMenuOpen(false);
  };

  return (
    <>
      <div className="av-bg" aria-hidden="true" />
      <div className="av-noise" aria-hidden="true" />
      <div className="av-app">
        <header className="av-nav">
          <Link className="logo" href="/" aria-label="Ir a la biblioteca">
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text neon-cyan">ARCADE <span className="neon-magenta">VAULT</span></span>
          </Link>

          <nav className="links" aria-label="Navegación principal">
            <NavLink href="/" active={libraryActive}>Biblioteca</NavLink>
            <NavLink href="/hall-of-fame" active={hallActive}>Salón de la Fama</NavLink>
          </nav>

          <div className="spacer" />
          <div className="coin-counter" aria-label="Créditos disponibles">
            <span className="coin" aria-hidden="true" />
            <span>CRÉDITOS · 03</span>
          </div>

          {user ? (
            <div className="user-state">
              <span className="user-state-label">JUGADOR</span>
              <span className="user-state-name">{user.name}</span>
              <button className="btn ghost auth-btn" type="button" onClick={handleLogout}>SALIR</button>
            </div>
          ) : (
            <Link className={`btn auth-btn${authActive ? " active" : ""}`} href="/auth">INICIAR SESIÓN</Link>
          )}

          <button
            className="btn ghost hamburger"
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            ≡
          </button>
        </header>

        <div className={`av-mobile-backdrop${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />
        <aside id="mobile-menu" className={`av-mobile-panel${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
          <div className="pixel neon-cyan mobile-menu-title">MENÚ</div>
          <NavLink href="/" active={libraryActive} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Biblioteca</NavLink>
          <NavLink href="/hall-of-fame" active={hallActive} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Salón de la Fama</NavLink>
          {user ? (
            <button className="mobile-menu-user" type="button" onClick={handleLogout} tabIndex={menuOpen ? 0 : -1}>
              {user.name} · CERRAR SESIÓN
            </button>
          ) : (
            <NavLink href="/auth" active={authActive} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>Iniciar Sesión</NavLink>
          )}
          <div className="mobile-menu-spacer" />
          <div className="pixel mobile-menu-credits">CRÉDITOS · 03</div>
        </aside>

        {children}
        <footer className="av-footer">© 2026 ARCADE VAULT · HECHO CON PIXELES Y NEÓN · v2.6.0</footer>
      </div>
    </>
  );
}
