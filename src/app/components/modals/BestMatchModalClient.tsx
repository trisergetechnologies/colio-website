"use client";

import { useEffect, useState } from "react";
import BestMatchModal from "./BestMatchModal";

export default function BestMatchModalClient() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener("open-best-match", openModal);
    return () =>
      window.removeEventListener("open-best-match", openModal);
  }, []);

  return (
    <BestMatchModal
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
