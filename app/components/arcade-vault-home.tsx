"use client";

import Link from "next/link";
import { useEffect, type CSSProperties } from "react";
import {
  GAMES,
  HOME_ACTIVITY,
  HOME_FEATURES,
  HOME_STATS,
  HOME_TOP_PLAYERS,
  type HomeFeature,
} from "../lib/arcade-vault-data";

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".home .reveal");
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

function formatScore(score: number) {
  return score.toLocaleString("es-ES");
}

function FloatingSilhouettes() {
  return (
    <div className="home-silos" aria-hidden="true">
      <svg className="silo s1" viewBox="0 0 40 32">
        <g fill="currentColor">
          <rect x="6" y="4" width="4" height="4" />
          <rect x="30" y="4" width="4" height="4" />
          <rect x="2" y="8" width="36" height="4" />
          <rect x="2" y="12" width="4" height="4" />
          <rect x="14" y="12" width="4" height="4" />
          <rect x="22" y="12" width="4" height="4" />
          <rect x="34" y="12" width="4" height="4" />
          <rect x="2" y="16" width="36" height="4" />
          <rect x="6" y="20" width="4" height="4" />
          <rect x="30" y="20" width="4" height="4" />
        </g>
      </svg>
      <svg className="silo s2" viewBox="0 0 32 32">
        <g fill="currentColor">
          <rect x="8" y="0" width="16" height="4" />
          <rect x="4" y="4" width="24" height="4" />
          <rect x="0" y="8" width="32" height="12" />
          <rect x="0" y="20" width="6" height="6" />
          <rect x="10" y="20" width="4" height="6" />
          <rect x="18" y="20" width="4" height="6" />
          <rect x="26" y="20" width="6" height="6" />
        </g>
      </svg>
      <svg className="silo s3" viewBox="0 0 32 32">
        <g fill="currentColor">
          <rect x="10" y="0" width="12" height="4" />
          <rect x="6" y="4" width="20" height="4" />
          <rect x="4" y="8" width="6" height="6" />
          <rect x="22" y="8" width="6" height="6" />
          <rect x="2" y="14" width="28" height="10" />
          <rect x="6" y="24" width="4" height="4" />
          <rect x="14" y="24" width="4" height="4" />
          <rect x="22" y="24" width="4" height="4" />
        </g>
      </svg>
      <svg className="silo s4" viewBox="0 0 24 24">
        <g fill="currentColor">
          <rect x="10" y="0" width="4" height="24" />
          <rect x="0" y="10" width="24" height="4" />
          <rect x="6" y="6" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
      </svg>
      <svg className="silo s5" viewBox="0 0 36 24">
        <g fill="currentColor">
          <rect x="14" y="2" width="8" height="4" />
          <rect x="10" y="6" width="16" height="4" />
          <rect x="4" y="10" width="28" height="4" />
          <rect x="0" y="14" width="36" height="4" />
          <rect x="6" y="18" width="4" height="2" />
          <rect x="16" y="18" width="4" height="2" />
          <rect x="26" y="18" width="4" height="2" />
        </g>
      </svg>
    </div>
  );
}

function FeatureIcon({ kind }: { kind: HomeFeature["icon"] }) {
  const iconProps = { className: "ft-icon", viewBox: "0 0 16 16", "aria-hidden": true };

  if (kind === "GAMEPAD") {
    return (
      <svg {...iconProps}>
        <g fill="currentColor">
          <rect x="2" y="6" width="12" height="6" />
          <rect x="0" y="8" width="2" height="4" />
          <rect x="14" y="8" width="2" height="4" />
          <rect x="3" y="8" width="2" height="2" />
          <rect x="2" y="9" width="4" height="0.5" />
          <rect x="11" y="7" width="1.5" height="1.5" />
          <rect x="11" y="10" width="1.5" height="1.5" />
        </g>
      </svg>
    );
  }

  if (kind === "FREE") {
    return (
      <svg {...iconProps}>
        <g fill="currentColor">
          <rect x="3" y="3" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="5" y="6" width="1.5" height="4" />
          <rect x="5" y="6" width="4" height="1.5" />
          <rect x="5" y="8" width="3" height="1" />
          <rect x="10" y="6" width="1.5" height="4" />
        </g>
      </svg>
    );
  }

  if (kind === "TROPHY") {
    return (
      <svg {...iconProps}>
        <g fill="currentColor">
          <rect x="3" y="2" width="10" height="2" />
          <rect x="3" y="2" width="2" height="6" />
          <rect x="11" y="2" width="2" height="6" />
          <rect x="5" y="8" width="6" height="2" />
          <rect x="7" y="10" width="2" height="3" />
          <rect x="5" y="13" width="6" height="1.5" />
          <rect x="1" y="3" width="2" height="3" />
          <rect x="13" y="3" width="2" height="3" />
        </g>
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <g fill="currentColor">
        <rect x="7" y="1" width="2" height="2" />
        <rect x="6" y="3" width="4" height="2" />
        <rect x="5" y="5" width="6" height="6" />
        <rect x="4" y="11" width="2" height="2" />
        <rect x="10" y="11" width="2" height="2" />
        <rect x="7" y="6" width="2" height="2" fill="var(--bg)" />
        <rect x="6" y="13" width="1" height="2" />
        <rect x="9" y="13" width="1" height="2" />
      </g>
    </svg>
  );
}

function MiniCard({ game }: { game: (typeof GAMES)[number] }) {
  return (
    <Link className="mini-card" href={`/games/${game.id}`} aria-label={`Jugar ${game.title}`}>
      <div className="mini-cover">
        <div className={`cover-bg ${game.cover}`} />
      </div>
      <div className="mini-meta">
        <div className="mini-title">{game.title}</div>
        <div className="mini-cat">{game.cat}</div>
      </div>
    </Link>
  );
}

export default function ArcadeVaultHome() {
  useReveal();

  return (
    <main className="home fade-in">
      <section className="home-hero" aria-labelledby="home-title">
        <FloatingSilhouettes />
        <div className="home-hero-inner">
          <div className="hero-eyebrow pixel neon-yellow">▸ INSERTA UNA MONEDA<span className="blink">_</span></div>
          <h1 id="home-title" className="home-title">
            <span className="line-1">EL ARCADE</span>
            <span className="line-2">CLÁSICO ESTÁ</span>
            <span className="line-3">DE VUELTA</span>
          </h1>
          <p className="home-sub">
            Juega los mejores clásicos directamente en tu navegador.
            <br />
            Sin descargas. Sin costo. Solo diversión.
          </p>
          <div className="home-ctas">
            <Link className="btn xl pulse" href="/games">▶ EXPLORAR JUEGOS</Link>
            <Link className="btn xl magenta" href="/auth">✦ CREAR CUENTA</Link>
          </div>
          <div className="hero-scroll" aria-hidden="true">
            <span>DESLIZA</span>
            <span className="arrow">▼</span>
          </div>
        </div>
      </section>

      <section className="home-section reveal" aria-labelledby="why-title">
        <div className="section-head">
          <div className="kicker pixel neon-magenta">{"// 01"}</div>
          <h2 id="why-title" className="section-title">¿POR QUÉ ARCADE VAULT?</h2>
          <div className="section-rule" />
        </div>
        <div className="feature-grid">
          {HOME_FEATURES.map((feature, index) => (
            <article
              className={`feature-card ${feature.accent}`}
              style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}
              key={feature.title}
            >
              <FeatureIcon kind={feature.icon} />
              <div className="ft-title pixel">{feature.title}</div>
              <div className="ft-desc">{feature.description}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section reveal" aria-labelledby="available-games-title">
        <div className="section-head">
          <div className="kicker pixel neon-cyan">{"// 02"}</div>
          <h2 id="available-games-title" className="section-title">JUEGOS DISPONIBLES AHORA</h2>
          <div className="section-rule" />
        </div>
        <div className="mini-rail">
          {GAMES.slice(0, 6).map((game) => <MiniCard key={game.id} game={game} />)}
        </div>
        <div className="home-centered-action">
          <Link className="btn lg" href="/games">VER TODOS LOS JUEGOS →</Link>
        </div>
      </section>

      <section className="home-stats reveal" aria-label="Estadísticas de Arcade Vault">
        <div className="stats-inner">
          {HOME_STATS.map((stat) => (
            <div className="stat-block" key={stat.unit}>
              <div className="stat-n neon-yellow">{stat.value}</div>
              <div className="stat-u pixel">{stat.unit}</div>
              <div className="stat-s">{stat.summary}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section reveal" aria-labelledby="activity-title">
        <div className="section-head">
          <div className="kicker pixel neon-yellow">{"// 03"}</div>
          <h2 id="activity-title" className="section-title">ACTIVIDAD EN VIVO</h2>
          <div className="section-rule" />
        </div>
        <div className="activity-grid">
          <article className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel">▸ ÚLTIMAS PUNTUACIONES</div>
            </div>
            <div className="ticker">
              {HOME_ACTIVITY.map((row, index) => (
                <div className="tick-row" key={`${row.player}-${row.game}`} style={{ animationDelay: `${index * 60}ms` }}>
                  <span className={`tk-p neon-${row.accent}`}>{row.player}</span>
                  <span className="tk-mid">▸ {row.game}</span>
                  <span className="tk-s">+{formatScore(row.score)}</span>
                  <span className="tk-t">{row.timeLabel}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="activity-card">
            <div className="ac-head">
              <div className="ac-title pixel neon-magenta">▸ TOP JUGADORES · HOY</div>
              <Link className="lb-link" href="/hall-of-fame">VER SALÓN →</Link>
            </div>
            <div className="top-list">
              {HOME_TOP_PLAYERS.map((player, index) => (
                <div className={`top-row${index < 3 ? ` top${index + 1}` : ""}`} key={player.player}>
                  <span className="tp-rk">#{String(player.rank).padStart(2, "0")}</span>
                  <span className="tp-bar"><span className="tp-fill" style={{ width: `${100 - index * 16}%` }} /></span>
                  <span className="tp-p">{player.player}</span>
                  <span className="tp-s">{formatScore(player.score)}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="home-section reveal" aria-labelledby="pricing-title">
        <div className="section-head">
          <div className="kicker pixel neon-green">{"// 04"}</div>
          <h2 id="pricing-title" className="section-title">PRECIOS</h2>
          <div className="section-rule" />
        </div>
        <div className="pricing-grid">
          <article className="price-card">
            <div className="pc-label pixel">PLAN ÚNICO</div>
            <div className="pc-name pixel">JUGADOR VAULT</div>
            <div className="pc-amount">
              <span className="pc-amount-n">$0</span>
              <span className="pc-amount-u">/ SIEMPRE</span>
            </div>
            <div className="pc-tag">SIN TRUCOS · SIN LETRA PEQUEÑA</div>
            <ul className="pc-list">
              <li>✔ Acceso a todos los juegos</li>
              <li>✔ Ranking global y salón de la fama</li>
              <li>✔ Sin anuncios entre partidas</li>
              <li>✔ Guarda tus puntuaciones</li>
              <li>✔ Nuevos juegos cada mes</li>
              <li>✔ Funciona en cualquier navegador</li>
            </ul>
            <Link className="btn xl pulse" href="/auth">EMPEZAR GRATIS →</Link>
            <div className="pc-foot">No pedimos tarjeta. Nunca lo haremos.</div>
            <div className="pc-stamp pixel">FREE<br />PLAY</div>
          </article>

          <div className="pricing-faq">
            <article className="faq-item">
              <div className="faq-q pixel">¿REALMENTE ES GRATIS?</div>
              <div className="faq-a">Sí. Arcade Vault es un proyecto sin fines de lucro hecho por amor a los clásicos. No hay versión “premium” escondida.</div>
            </article>
            <article className="faq-item">
              <div className="faq-q pixel">¿NECESITO CREAR CUENTA?</div>
              <div className="faq-a">No. Puedes jugar como invitado. Si quieres guardar tu puntuación y aparecer en el ranking, regístrate en 10 segundos.</div>
            </article>
            <article className="faq-item">
              <div className="faq-q pixel">¿CÓMO SOBREVIVEN SIN COBRAR?</div>
              <div className="faq-a">Es un proyecto comunitario. Si te gusta, compártelo. Esa es toda la moneda que aceptamos.</div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-final reveal" aria-labelledby="final-title">
        <h2 id="final-title" className="final-title pixel">¿LISTO PARA JUGAR?</h2>
        <Link className="btn xl pulse final-cta" href="/games">INSERTAR MONEDA →</Link>
        <div className="final-tag">Gratis. Sin registro obligatorio. Empieza en segundos.</div>
      </section>
    </main>
  );
}
