"use client";

import Signin from "@/app/components/auth/sign-in";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function SigninPageClient() {
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

  return <Signin />;
}
