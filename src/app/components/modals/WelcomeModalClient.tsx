"use client";

import { useAuth } from "@/context/AuthContext";
import WelcomeModal from "./WelcomeModal";
import { useDelayedOpen } from "@/hooks/useDelayedOpen";

export default function WelcomeModalClient() {
  const { isAuthenticated } = useAuth();

  // if (isAuthenticated) {
  //   return null;
  // }

  const { open, setOpen } = useDelayedOpen(5000);

  return <WelcomeModal open={open} onClose={() => setOpen(false)} />;
}
