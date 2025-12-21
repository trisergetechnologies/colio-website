"use client";

import { useEffect, useState } from "react";
import SignInModal from "./SignInModal";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function SignInModalClient() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAuthLoading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Don't run while auth is loading
    if (isAuthLoading) return;

    // Don't show on auth pages (signin, signup, forgot-password)
    const authPages = ["/signin", "/signup", "/forgot-password"];
    if (authPages.includes(pathname)) return;

    // Listen for download app close event (same as BestMatchModal)
    const handleDownloadAppClose = () => {
      // Auto-open SignIn modal if user is NOT authenticated
      if (!isAuthenticated) {
        setTimeout(() => {
          setOpen(true);
        }, 1000); // 1 second delay after WelcomeModal closes
      }
    };
    
    window.addEventListener("download-app-closed", handleDownloadAppClose);
    
    // Also listen for manual trigger
    const openModal = () => {
      setOpen(true);
    };
    
    window.addEventListener("open-signin-modal", openModal);

    return () => {
      window.removeEventListener("download-app-closed", handleDownloadAppClose);
      window.removeEventListener("open-signin-modal", openModal);
    };
  }, [isAuthenticated, isAuthLoading, pathname]);

  // Close modal if user logs in while it's open
  useEffect(() => {
    if (isAuthenticated && open) {
      setOpen(false);
    }
  }, [isAuthenticated, open]);

  return <SignInModal open={open} onClose={() => setOpen(false)} />;
}