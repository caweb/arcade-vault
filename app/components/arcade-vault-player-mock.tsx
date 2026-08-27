import Link from "next/link";
import type { ArcadeGame } from "../lib/arcade-vault-data";

export default function ArcadeVaultPlayerMock({ game }: { game: ArcadeGame }) {
  return (
    <main className="av-player fade-in">
      <div className="player-hud">
        <div className="hud-stats">
          <div className="hud-stat"><div className="l">Jugador</div><div className="v player-name">INVITADO</div></div>
          <div className="hud-stat"><div className="l">Puntuación</div><div className="v">0</div></div>
          <div className="hud-stat lives"><div className="l">Vidas</div><div className="v">♥ ♥ ♥</div></div>
          <div className="hud-stat level"><div className="l">Nivel</div><div className="v">01</div></div>
        </div>
        <div className="hud-actions">
          <button className="btn yellow" type="button" disabled>PAUSA</button>
          <button className="btn magenta" type="button" disabled>FIN</button>
          <Link className="btn ghost" href={`/games/${game.id}`}>SALIR</Link>
        </div>
      </div>

      <div className="crt">
        <div className="crt-screen">
          <div className="game-arena" aria-label={`Arena visual de ${game.title}`}>
            <div className="grid-floor" />
            <div className="enemy e1" />
            <div className="enemy e2" />
            <div className="enemy e3" />
            <div className="player-ship" />
            <div className="crt-content"><span className="pixel neon-cyan">MODO DEMO</span></div>
          </div>
        </div>
        <div className="crt-bottom">
          <span className="led">SEÑAL OK</span>
          <span>{game.title} · CRT-83 · 60 HZ</span>
          <span>CARGA · 1MB</span>
        </div>
      </div>

      <div className="player-state" role="status">
        <div className="modal">
          <h2>FIN DEL JUEGO</h2>
          <div className="final-label">ESTADO DE DEMOSTRACIÓN</div>
          <div className="final">000000</div>
          <p className="player-state-copy">La mecánica está desactivada en esta vista previa.</p>
          <div className="actions">
            <Link className="btn magenta" href={`/games/${game.id}`}>VOLVER AL DETALLE</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
