import { notFound } from "next/navigation";
import ArcadeVaultGameDetail from "../../components/arcade-vault-game-detail";
import { GAMES } from "../../lib/arcade-vault-data";

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }));
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((candidate) => candidate.id === id);

  if (!game) notFound();

  return <ArcadeVaultGameDetail game={game} />;
}
