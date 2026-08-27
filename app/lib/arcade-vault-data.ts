export type ArcadeAccent = "cyan" | "magenta" | "green" | "yellow";

export type ArcadeGameCategory = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";

export type ArcadeGame = {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: ArcadeGameCategory;
  cover: string;
  color: ArcadeAccent;
  best: number;
  plays: string;
};

export type RankingRow = {
  rank: number;
  name: string;
  score: number;
  date: string;
};

export type MockUser = {
  name: string;
};

export type HomeFeature = {
  icon: "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";
  title: string;
  description: string;
  accent: ArcadeAccent;
};

export type HomeStat = {
  value: string;
  unit: string;
  summary: string;
};

export type HomeActivityRow = {
  player: string;
  game: string;
  score: number;
  timeLabel: string;
  accent: ArcadeAccent;
};

export type HomeTopPlayer = {
  rank: number;
  player: string;
  score: number;
};

export const GAMES: readonly ArcadeGame[] = [
  {
    id: "bloque-buster",
    title: "BLOQUE BUSTER",
    short: "Rebota la pelota y destruye muros de neón.",
    long: "Pilota una nave-paleta y rebota un núcleo de plasma para pulverizar muros de bloques cromáticos. Cada nivel reorganiza la grilla en patrones imposibles. ¿Hasta dónde llegará tu racha?",
    cat: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    best: 28450,
    plays: "12.4K",
  },
  {
    id: "caida",
    title: "CAÍDA",
    short: "Encaja las piezas antes de que el techo te aplaste.",
    long: "Piezas geométricas descienden desde la oscuridad. Rótalas, encástralas y limpia líneas para sobrevivir. La velocidad aumenta sin piedad cada 10 líneas.",
    cat: "PUZZLE",
    cover: "cover-tetro",
    color: "magenta",
    best: 184220,
    plays: "31.8K",
  },
  {
    id: "serpentina",
    title: "SERPENTINA",
    short: "Crece sin morder tu propia cola.",
    long: "Una serpiente de luz recorre la grilla buscando núcleos magenta. Cada bocado la alarga y la hace más veloz. Un movimiento en falso y se devora a sí misma.",
    cat: "ARCADE",
    cover: "cover-snake",
    color: "green",
    best: 7820,
    plays: "9.1K",
  },
  {
    id: "gloton",
    title: "GLOTÓN",
    short: "Devora puntos y escapa de los fantasmas.",
    long: "Un círculo glotón patrulla un laberinto coleccionando puntos luminosos. Cuatro espectros lo persiguen, pero cada cierto tiempo aparece una píldora que invierte los papeles.",
    cat: "ARCADE",
    cover: "cover-glot",
    color: "yellow",
    best: 96400,
    plays: "27.2K",
  },
  {
    id: "invasores",
    title: "INVASORES",
    short: "Defiende el planeta de filas alienígenas.",
    long: "Olas de pixeles hostiles descienden formación tras formación. Mueve tu cañón en horizontal y abre fuego con precisión, antes de que toquen la superficie.",
    cat: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    best: 54190,
    plays: "18.0K",
  },
  {
    id: "rocas",
    title: "ROCAS",
    short: "Pulveriza asteroides en gravedad cero.",
    long: "Tu nave triangular flota en vacío absoluto. Dispara y rota para dividir rocas en fragmentos cada vez más pequeños. Cuidado con los OVNIs en el horizonte.",
    cat: "SHOOTER",
    cover: "cover-rocas",
    color: "yellow",
    best: 41200,
    plays: "15.6K",
  },
  {
    id: "ranaria",
    title: "RANARIA",
    short: "Cruza la autopista de pixeles.",
    long: "Salta entre carriles de coches a toda velocidad y troncos a la deriva en el río. Llega a los nenúfares antes de que se acabe el tiempo.",
    cat: "ARCADE",
    cover: "cover-rana",
    color: "green",
    best: 18900,
    plays: "6.4K",
  },
  {
    id: "duelo-pixel",
    title: "DUELO PIXEL",
    short: "Dos paletas. Una pelota. Reflejos máximos.",
    long: "El duelo más puro: dos paletas verticales se enfrentan por rebotar una pelota luminosa. Modo solitario contra la CPU o partida local a dos jugadores.",
    cat: "VERSUS",
    cover: "cover-duelo",
    color: "cyan",
    best: 24,
    plays: "4.2K",
  },
] as const;

export const HOME_FEATURES: readonly HomeFeature[] = [
  {
    icon: "GAMEPAD",
    title: "JUEGOS CLÁSICOS",
    description: "Arkanoid, Tetris, Snake y muchos más. Los mejores arcades de todos los tiempos en un solo lugar.",
    accent: "cyan",
  },
  {
    icon: "FREE",
    title: "100% GRATIS",
    description: "Sin suscripciones, sin pagos ocultos. Todos los juegos disponibles de forma gratuita.",
    accent: "yellow",
  },
  {
    icon: "TROPHY",
    title: "LADDER BOARDS",
    description: "Compite con jugadores de todo el mundo. Escala el ranking y demuestra quién es el mejor.",
    accent: "magenta",
  },
  {
    icon: "ROCKET",
    title: "SIEMPRE CRECIENDO",
    description: "Agregamos nuevos juegos constantemente. Vuelve seguido, siempre habrá algo nuevo que jugar.",
    accent: "green",
  },
];

export const HOME_STATS: readonly HomeStat[] = [
  { value: "12+", unit: "JUEGOS", summary: "Y CONTANDO" },
  { value: "MILES", unit: "DE PARTIDAS", summary: "JUGADAS CADA DÍA" },
  { value: "GLOBAL", unit: "RANKING", summary: "COMPITE CON EL MUNDO" },
];

export const HOME_ACTIVITY: readonly HomeActivityRow[] = [
  { player: "NEONFOX", game: "Caída", score: 184220, timeLabel: "hace 2 min", accent: "magenta" },
  { player: "PX_KAI", game: "Glotón", score: 96400, timeLabel: "hace 5 min", accent: "yellow" },
  { player: "Z3R0COOL", game: "Invasores", score: 54190, timeLabel: "hace 8 min", accent: "green" },
  { player: "VAULT_07", game: "Rocas", score: 41200, timeLabel: "hace 12 min", accent: "cyan" },
  { player: "GLITCHA", game: "Bloque Buster", score: 28450, timeLabel: "hace 18 min", accent: "cyan" },
  { player: "ARKADYA", game: "Serpentina", score: 7820, timeLabel: "hace 24 min", accent: "green" },
  { player: "CYBER_LU", game: "Ranaria", score: 18900, timeLabel: "hace 31 min", accent: "yellow" },
];

export const HOME_TOP_PLAYERS: readonly HomeTopPlayer[] = [
  { rank: 1, player: "NEONFOX", score: 312840 },
  { rank: 2, player: "PX_KAI", score: 248110 },
  { rank: 3, player: "M00NRYU", score: 196720 },
  { rank: 4, player: "VAULT_07", score: 154300 },
  { rank: 5, player: "GLITCHA", score: 138900 },
];

export const CATS = ["TODOS", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const;
export type ArcadeCategory = (typeof CATS)[number];

const PLAYERS = [
  "PX_KAI", "NEONFOX", "Z3R0COOL", "M00NRYU", "VAULT_07", "GLITCHA",
  "ATARI_KID", "CYBER_LU", "MAGENTA88", "SCANLINE", "BIT_LORD", "ARKADYA",
  "DROID_X", "RGB_QUEEN", "PIXEL_DAD", "RETROVIRA", "VECTORX", "JOY_STK",
] as const;

function seededScores(seed: number, count: number): RankingRow[] {
  let state = seed;
  const random = () => (state = (state * 9301 + 49297) % 233280) / 233280;
  const used = new Set<string>();
  const rows: RankingRow[] = [];

  for (let index = 0; index < count; index += 1) {
    let name: string;
    do {
      name = PLAYERS[Math.floor(random() * PLAYERS.length)];
    } while (used.has(name) && used.size < PLAYERS.length);
    used.add(name);

    const base = Math.floor(50000 + random() * 250000);
    const score = base - index * Math.floor(2000 + random() * 4000);
    const day = String(1 + Math.floor(random() * 28)).padStart(2, "0");
    const month = String(1 + Math.floor(random() * 12)).padStart(2, "0");
    rows.push({
      rank: index + 1,
      name,
      score: Math.max(score, 1000),
      date: `${day}/${month}/2026`,
    });
  }

  return rows
    .sort((first, second) => second.score - first.score)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function getGameLeaderboard(gameId: string, count = 10): readonly RankingRow[] {
  return seededScores(gameId.length * 17 + 3, count);
}

export function getHallOfFameRankings(gameId: string, count = 12): readonly RankingRow[] {
  return seededScores(gameId.length * 23 + 7, count);
}
