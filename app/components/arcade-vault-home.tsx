"use client";

import { useMemo, useRef, useState } from "react";
import { CATS, GAMES, type ArcadeCategory, type ArcadeGame } from "../lib/arcade-vault-data";

function GameCard({ game }: { game: ArcadeGame }) {
  const cardRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };

  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const accentClass = game.color === "magenta" || game.color === "yellow" ? game.color : "";

  return (
    <article
      ref={cardRef}
      className="card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="cover">
        <div className={`cover-bg ${game.cover}`} />
        <div className="label">{game.cat}</div>
      </div>
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>MEJOR PUNTUACIÓN</span>
            <b>{game.best.toLocaleString("es-ES")}</b>
          </div>
          <button className={`btn ${accentClass}`} type="button">JUGAR</button>
        </div>
      </div>
    </article>
  );
}

export default function ArcadeVaultHome() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ArcadeCategory>("TODOS");

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return GAMES.filter((game) => {
      const matchesCategory = category === "TODOS" || game.cat === category;
      const matchesQuery = game.title.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="av-main" id="biblioteca">
        <div className="fade-in">
          <section className="av-hero">
            <h1 className="flicker">ARCADE VAULT</h1>
            <div className="sub">INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span></div>
          </section>

          <div className="av-filters">
            <label className="av-search">
              <span className="ico" aria-hidden="true">⌕</span>
              <span className="sr-only">Buscar un juego</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar un juego por nombre…"
              />
            </label>
            <div className="av-chips" aria-label="Filtrar por categoría">
              {CATS.map((item) => (
                <button
                  key={item}
                  className={`chip${category === item ? " active" : ""}`}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="av-grid">
            {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
            {filteredGames.length === 0 && (
              <div className="empty-state">
                <div className="pixel empty-state-title">NO HAY RESULTADOS</div>
                <div>Intenta otra búsqueda o categoría.</div>
              </div>
            )}
          </div>
        </div>
    </main>
  );
}
