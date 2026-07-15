import { ReactNode } from "react";

// ============================================================================
// DEAKTIVIERT – Guard ist ein reiner Pass-Through.
// Keine Bot-Prüfung, kein Netzwerk-Call, kein Whitescreen.
// Zum Reaktivieren: use-antibot Hook wieder einkommentieren und die
// ursprüngliche Guard-Logik (siehe Kommentarblock unten) wiederherstellen.
// ============================================================================

interface Props {
  children: ReactNode;
}

const AntiBotGuard = ({ children }: Props) => {
  return <>{children}</>;
};

export default AntiBotGuard;

/* ORIGINAL IMPLEMENTATION:

import { useAntiBot } from "@/hooks/use-antibot";
import BlockedPage from "@/components/BlockedPage";

const AntiBotGuard = ({ children }: Props) => {
  const { status } = useAntiBot();
  if (status === "blocked") return <BlockedPage />;
  return <>{children}</>;
};

*/
