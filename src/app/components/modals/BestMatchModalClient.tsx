"use client";

import { useEffect, useState } from "react";
import BestMatchModal from "./BestMatchModal";
import { useAuth } from "@/context/AuthContext";

export default function BestMatchModalClient() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    // Don't run logic while auth is still loading
    if (isAuthLoading) return;

    // Listen for download app close event
    const handleDownloadAppClose = () => {
      // Auto-open best match if logged in (no session check - shows every time!)
      if (isAuthenticated) {
        setTimeout(() => {
          setOpen(true);
        }, 1000); // 1 second delay after WelcomeModal closes
      }
    };
    handleDownloadAppClose();
    
    // window.addEventListener("download-app-closed", handleDownloadAppClose);
    
    // Also listen for manual trigger (for the "Best Match For You" button)
    const openModal = () => {
      setOpen(true);
    };
    
    window.addEventListener("open-best-match", openModal);

    return () => {
      window.removeEventListener("download-app-closed", handleDownloadAppClose);
      window.removeEventListener("open-best-match", openModal);
    };
  }, [isAuthenticated, isAuthLoading]);

  return <BestMatchModal open={open} onClose={() => setOpen(false)} />;
}