import Link from "next/link";
import { getGameLeaderboard, type ArcadeGame } from "../lib/arcade-vault-data";

function formatScore(score: number) {
  return score.toLocaleString("es-ES");
}

export default function ArcadeVaultGameDetail({ game }: { game: ArcadeGame }) {
  const scores = getGameLeaderboard(game.id);

  return (
    <main className="av-detail fade-in">
      <div>
        <div className="detail-cover">
          <div className={`cover-bg ${game.cover}`} />
        </div>
        <div className="detail-info">
          <div className="detail-tags">
            <span>{game.cat}</span>
            <span>1 JUGADOR</span>
            <span>TECLADO / TÁCTIL</span>
            <span>RETRO 1985</span>
          </div>
          <h1 className={`neon-${game.color}`}>{game.title}</h1>
          <p>{game.long}</p>
          <div className="stat-strip">
            <div><div className="l">Partidas</div><div className="v">{game.plays}</div></div>
            <div><div className="l">Mejor global</div><div className="v neon-magenta">{formatScore(game.best)}</div></div>
            <div><div className="l">Dificultad</div><div className="v neon-yellow">★ ★ ★ ☆ ☆</div></div>
          </div>
          <div className="detail-actions">
            <Link className="btn xl pulse" href={`/games/${game.id}/play`}>▶ JUGAR AHORA</Link>
            <Link className="btn ghost lg" href="/games">VOLVER AL VAULT</Link>
          </div>
        </div>
      </div>

      <aside>
        <div className="leaderboard">
          <h2>MEJORES PUNTUACIONES</h2>
          {scores.map((row) => (
            <div
              key={row.name}
              className={`lb-row${row.rank <= 3 ? ` top${row.rank}` : ""}`}
            >
              <div className="rk">#{String(row.rank).padStart(2, "0")}</div>
              <div className="pl">{row.name}<div className="lb-date">{row.date}</div></div>
              <div className="sc">{formatScore(row.score)}</div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
