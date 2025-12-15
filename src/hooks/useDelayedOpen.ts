"use client";

import { useEffect, useState } from "react";

export function useDelayedOpen(delay = 100) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return { open, setOpen };
}
