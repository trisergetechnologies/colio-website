"use client";

import SignUp from "@/app/components/auth/sign-up";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function SignupPageClient() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/experts");
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return <Spinner message="Preparing your account..." />;
  }

  return <SignUp />;
}
