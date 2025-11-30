"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Spinner from "../components/Spinner";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import ExpertHero from "../components/experts/banner";
import ExpertsList from "../components/experts/expert-list";

export default function ExpertsPageClient() {
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
    return <Spinner message="Please wait..." />;
  }

  if (!isAuthenticated) {
    return null; // prevents UI flicker before redirect
  }

  // ✅ Show protected page only if logged in
  return (
      <div>
        <Header />
        <ExpertHero />
        <ExpertsList />
        <Footer />
      </div>
  );
}
