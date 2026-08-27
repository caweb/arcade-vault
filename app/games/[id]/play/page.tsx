import { notFound } from "next/navigation";
import ArcadeVaultPlayerMock from "../../../components/arcade-vault-player-mock";
import { GAMES } from "../../../lib/arcade-vault-data";

export function generateStaticParams() {
  return GAMES.map((game) => ({ id: game.id }));
}

export default async function GamePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = GAMES.find((candidate) => candidate.id === id);

  if (!game) notFound();

  return <ArcadeVaultPlayerMock game={game} />;
}
