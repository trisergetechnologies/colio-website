"use client";

import { useAuth } from "@/context/AuthContext";
import HeroGrid from "./components/home/HeroGrid/HeroGrid";

const HeroGridPageClient = () => {
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();

  if (isAuthLoading) return <div className="bg-black"></div>;

  if (!isAuthenticated) return <HeroGrid />;
  return <div></div>;
};

export default HeroGridPageClient;
