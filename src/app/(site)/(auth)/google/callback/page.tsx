"use client";

import { useEffect } from "react";
import axios from "axios";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function GoogleCallback() {
    const { saveAuthData } = useAuth();
    const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;
    console.log("Code: ", code);
    // Send code to backend
    axios.get(`${API_BASE_URL}/auth/google/oauth?code=${code}`)
      .then(async (res) => {
        const data = res.data;
        if (data.success) {
        await saveAuthData(res.data.data);
        router.replace('/');

        }
      })
      .catch((err) => console.log("Google OAuth error:", err));

  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <h2 style={styles.title}>Signing you in</h2>
        <p style={styles.subtitle}>
          Please wait while we securely connect your Google account.
        </p>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
    padding: 20,
  },
  card: {
    background: "#ffffff",
    padding: "40px 32px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    maxWidth: 420,
    width: "100%",
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
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