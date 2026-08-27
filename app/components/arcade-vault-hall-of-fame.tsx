"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { getHallOfFameRankings, GAMES, type MockUser } from "../lib/arcade-vault-data";

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

function formatScore(score: number) {
  return score.toLocaleString("es-ES");
}

export default function ArcadeVaultHallOfFame() {
  const [tab, setTab] = useState(GAMES[0].id);
  const storedUser = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => "");
  const user = parseStoredUser(storedUser);
  const rows = useMemo(() => getHallOfFameRankings(tab), [tab]);
  const game = GAMES.find((candidate) => candidate.id === tab) ?? GAMES[0];
  const userRank = user ? 8 + (tab.length % 4) : null;
  const userScore = user ? (rows[5]?.score ?? 9999) - 2400 : null;

  return (
    <main className="av-hall fade-in">
      <div className="hall-head">
        <h1>SALÓN DE LA FAMA</h1>
        <p className="pixel">LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA</p>
      </div>

      <div className="hall-tabs" role="tablist" aria-label="Seleccionar juego">
        {GAMES.map((candidate) => (
          <button
            key={candidate.id}
            className={`chip${tab === candidate.id ? " active" : ""}`}
            type="button"
            role="tab"
            aria-selected={tab === candidate.id}
            onClick={() => setTab(candidate.id)}
          >
            {candidate.title}
          </button>
        ))}
      </div>

      <div className="podium">
        <div className="podium-slot silver">
          <div className="rank-num">02</div>
          <div className="name">{rows[1].name}</div>
          <div className="score">{formatScore(rows[1].score)}</div>
          <div className="date">{rows[1].date}</div>
        </div>
        <div className="podium-slot gold">
          <div className="pixel podium-title">CAMPEÓN</div>
          <div className="rank-num">01</div>
          <div className="name">{rows[0].name}</div>
          <div className="score">{formatScore(rows[0].score)}</div>
          <div className="date">{rows[0].date}</div>
        </div>
        <div className="podium-slot bronze">
          <div className="rank-num">03</div>
          <div className="name">{rows[2].name}</div>
          <div className="score">{formatScore(rows[2].score)}</div>
          <div className="date">{rows[2].date}</div>
        </div>
      </div>

      <div className="hall-table">
        <div className="th" role="row">
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div>PUNTUACIÓN</div>
          <div>FECHA</div>
        </div>
        {rows.map((row) => (
          <div key={`${row.name}-${row.rank}`} className={`tr${row.rank <= 3 ? ` top${row.rank}` : ""}`}>
            <div className="rk">#{String(row.rank).padStart(2, "0")}</div>
            <div className="pl">{row.name}</div>
            <div className="sc">{formatScore(row.score)}</div>
            <div className="dt">{row.date}</div>
          </div>
        ))}
        {user && userRank !== null && userScore !== null && (
          <>
            <div className="tr you-label">▸ TU MEJOR MARCA EN {game.title}</div>
            <div className="tr you">
              <div className="rk">#{String(userRank).padStart(2, "0")}</div>
              <div className="pl">{user.name}</div>
              <div className="sc">{formatScore(userScore)}</div>
              <div className="dt">11/05/2026</div>
            </div>
          </>
        )}
      </div>

      <div className="hall-back">
        <Link className="btn lg" href="/games">VOLVER A LA BIBLIOTECA</Link>
      </div>
    </main>
  );
}
