"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Detect if opened from mobile app
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobileApp = userAgent.includes("expo") || 
                        userAgent.includes("android") && !userAgent.includes("chrome") ||
                        userAgent.includes("iphone") && !userAgent.includes("safari");
    
    setIsMobile(isMobileApp);

    const handleGoogleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        if (error) {
          if (isMobileApp) {
            window.location.href = `colio://google/callback?error=${encodeURIComponent("Google sign-in failed")}`;
            return;
          }

          toast.error("Google sign-in was cancelled or failed");
          setTimeout(() => router.replace("/signin"), 2000);
          return;
        }

        if (!code) {
          toast.error("Authorization code not found");
          setTimeout(() => router.replace("/signin"), 2000);
          return;
        }

        const response = await axios.get<GoogleAuthResponse>(
          `${API_BASE_URL}/auth/google/oauth?code=${code}`,
          { timeout: 10000 }
        );

        if (response.data.success && response.data.data) {
          const { accessToken, ...userData } = response.data.data;

          if (isMobileApp) {
            // Redirect to app with deep link
            const userDataString = encodeURIComponent(JSON.stringify(userData));
            const deepLink = `colio://google/callback?token=${accessToken}&userData=${userDataString}`;
            
            console.log("Redirecting to app with deep link");
            window.location.href = deepLink;
            
            // Show success message briefly before redirect
            toast.success("Returning to app...");
            return;
          }

          // Regular web flow
          await saveAuthData(response.data.data);
          toast.success(response.data.message || "Sign in successful!");
          setTimeout(() => router.replace("/"), 1000);
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
  }, []);

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
              <h2 style={styles.title}>
                {isMobile ? "Signing you in" : "Signing you in"}
              </h2>
              <p style={styles.subtitle}>
                {isMobile 
                  ? "Please wait, we'll return you to the app shortly..."
                  : "Please wait while we securely connect your Google account."
                }
              </p>
            </>
          ) : (
            <>
              <div style={styles.checkmark}>✓</div>
              <h2 style={styles.title}>
                {isMobile ? "Returning to app..." : "Redirecting..."}
              </h2>
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