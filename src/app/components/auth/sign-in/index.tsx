// components/auth/Signin.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SocialSignIn from "../SocialSignIn";
import Logo from "../../layout/header/logo";
import { useAuth } from "@/context/AuthContext";
import colors, { gradientStyles } from "@/constants/colors"; // adjust path if needed

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function Signin() {
  const router = useRouter();
  const { saveAuthData } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const isValidPhone = (s: string) => /^[0-9]{10}$/.test(s);
  const showToast = (m: string) => toast(m);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    if (!identifier.trim()) return setErrors({ identifier: "Enter email or phone" });
    if (!password) return setErrors({ password: "Enter password" });

    let loginType: "email" | "phone" = "email";
    if (identifier.includes("@")) loginType = "email";
    else if (/^[0-9]+$/.test(identifier.trim())) loginType = "phone";

    if (loginType === "email" && !isValidEmail(identifier))
      return setErrors({ identifier: "Invalid email" });
    if (loginType === "phone" && !isValidPhone(identifier))
      return setErrors({ identifier: "Enter 10-digit phone" });

    try {
      setLoading(true);
      const payload = {
        identifier: identifier.trim().toLowerCase(),
        password,
        loginType,
        role: "customer",
      };
      const url = `${API_BASE_URL}/auth/login`;
      const res = await axios.post(url, payload);

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        showToast("Login successful!");
        router.replace("/home");
      } else {
        showToast(res.data?.message || "Invalid credentials");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Login failed";
      showToast(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 20px",
        boxSizing: "border-box",
        ...gradientStyles.background,
        color: colors.white,
      }}
    >
      {/* <-- Toaster added here so all toasts will display */}
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff" } }} />

      <div className="max-w-3xl mx-auto">
        

        {/* Auth box */}
        <div
        
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: 22,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        > 

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-block" style={{ maxWidth: 160 }}>
            <Logo />
          </div>
        </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or 10-digit phone"
                aria-label="Email or phone"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: colors.white,
                  outline: "none",
                }}
              />
              {errors.identifier && (
                <div className="text-sm mt-2" style={{ color: colors.error }}>
                  {errors.identifier}
                </div>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "transparent",
                  color: colors.white,
                  outline: "none",
                }}
              />
              {errors.password && (
                <div className="text-sm mt-2" style={{ color: colors.error }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  ...gradientStyles.button,
                  color: colors.white,
                  fontWeight: 600,
                }}
              >
                {loading ? "Please Wait . . ." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="px-4 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
              OR
            </div>
            <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
          </div>

          {/* Social sign-in (if present) */}
          <div className="mb-6">
            <SocialSignIn />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/forgot-password")}
              style={{ background: "transparent", border: "none", color: colors.accent[300], cursor: "pointer" }}
            >
              Forgot Password?
            </button>

            <div style={{ color: "rgba(255,255,255,0.8)" }}>
              Not a member yet?{" "}
              <button
                onClick={() => router.push("/signup")}
                style={{ background: "transparent", border: "none", color: colors.button.start, cursor: "pointer" }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
