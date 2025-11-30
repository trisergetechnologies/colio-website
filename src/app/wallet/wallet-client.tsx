"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Spinner from "../components/Spinner";
import Wallet from "./page";
import WalletPage from "../components/wallet/page";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export default function WalletPageClient() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  // 🔐 Redirect NOT logged-in users away from this protected route
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // 🔄 Show spinner while checking auth
  if (isAuthLoading) {
    return <Spinner message="Checking your wallet access..." />;
  }

  if (!isAuthenticated) {
    return null; // prevents UI flicker before redirect
  }

  // ✅ Show protected page only if logged in
  return (
      <div>
          <Header />
          <WalletPage />
          <Footer />
      </div>
  );
}
