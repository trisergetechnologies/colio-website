"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

type GoogleAuthResponse = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    name: string;
    email: string;
    role: "customer";
    isVerified: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    avatar?: string;
    wallet: { main: number; bonus: number };
    accessToken: string;
    refreshToken?: string;
  } | null;
};

export default function GoogleCallback() {
  const { saveAuthData } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        // Handle OAuth errors
        if (error) {
          toast.error("Google sign-in was cancelled or failed");
          setTimeout(() => router.replace("/signin"), 2000);
          return;
        }

        if (!code) {
          toast.error("Authorization code not found");
          setTimeout(() => router.replace("/signin"), 2000);
          return;
        }

        // Send code to backend
        const response = await axios.get<GoogleAuthResponse>(
          `${API_BASE_URL}/auth/google/oauth?code=${code}`
        );

        if (response.data.success && response.data.data) {
          await saveAuthData(response.data.data);
          toast.success(response.data.message || "Sign in successful!");
          
          // Redirect based on user status
          setTimeout(() => {
            if (!response.data.data?.isPhoneVerified) {
              router.replace("/onboarding"); // or wherever phone verification happens
            } else {
              router.replace("/");
            }
          }, 1000);
        } else {
          toast.error(response.data.message || "Authentication failed");
          setTimeout(() => router.replace("/signin"), 2000);
        }
      } catch (err: any) {
        console.error("Google OAuth error:", err);
        
        const errorMessage =
          err?.response?.data?.message ||
          "Something went wrong. Please try again";
        
        toast.error(errorMessage);
        setTimeout(() => router.replace("/signin"), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [saveAuthData, router]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#111", color: "#fff" },
          duration: 3000,
        }}
      />
      <div style={styles.page}>
        <div style={styles.card}>
          {isProcessing ? (
            <>
              <div style={styles.spinner} />
              <h2 style={styles.title}>Signing you in</h2>
              <p style={styles.subtitle}>
                Please wait while we securely connect your Google account.
              </p>
            </>
          ) : (
            <>
              <div style={styles.checkmark}>✓</div>
              <h2 style={styles.title}>Redirecting...</h2>
            </>
          )}
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #8900ae, #5d0076)",
    padding: 20,
  },
  card: {
    background: "#ffffff",
    padding: "40px 32px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
    maxWidth: 420,
    width: "100%",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #8900ae",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  },
  checkmark: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#10b981",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    margin: "0 auto 24px",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
};