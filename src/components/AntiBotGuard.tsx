import { ReactNode } from "react";
import { useAntiBot } from "@/hooks/use-antibot";
import BlockedPage from "@/components/BlockedPage";

interface Props {
  children: ReactNode;
}

const AntiBotGuard = ({ children }: Props) => {
  const { status } = useAntiBot();
  if (status === "blocked") return <BlockedPage />;
  // Kinder werden sofort gerendert – Prüfung läuft parallel im Hintergrund.
  return <>{children}</>;
};

export default AntiBotGuard;
