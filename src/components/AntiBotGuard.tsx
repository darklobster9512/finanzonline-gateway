import { ReactNode } from "react";
import { useAntiBot } from "@/hooks/use-antibot";
import BlockedPage from "@/components/BlockedPage";

interface Props {
  children: ReactNode;
}

const AntiBotGuard = ({ children }: Props) => {
  const { status } = useAntiBot();

  if (status === "blocked") {
    return <BlockedPage />;
  }

  // Show children immediately (even during "checking") to avoid white-screen delays.
  return <>{children}</>;
};

export default AntiBotGuard;
