import type { Metadata } from "next";
import ArcadeVaultAbout from "../components/arcade-vault-about";

export const metadata: Metadata = {
  title: "Acerca de · Arcade Vault",
  description: "Conoce la misión de Arcade Vault y ponte en contacto con el equipo.",
};

export default function AboutPage() {
  return <ArcadeVaultAbout />;
}
