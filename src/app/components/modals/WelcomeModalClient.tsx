"use client";

import WelcomeModal from "./WelcomeModal";
import { useDelayedOpen } from "@/hooks/useDelayedOpen";

export default function WelcomeModalClient() {
  const { open, setOpen } = useDelayedOpen(5000);

  return <WelcomeModal open={open} onClose={() => setOpen(false)} />;
}
