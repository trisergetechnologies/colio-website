// components/auth/SignUp.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SocialSignUp from "../SocialSignUp";
import Logo from "../../layout/header/logo";
import Loader from "../../shared/Loader";
import { useAuth } from "@/context/AuthContext";
import colors, { gradientStyles } from "@/constants/colors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function SignUp() {
  const router = useRouter();
  const { saveAuthData } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
  const isValidPhone = (s: string) => /^[0-9]{10}$/.test(s.trim());

  const showToast = (m: string) => toast(m);

  const clearError = (key: string) => setErrors((p) => { const c = { ...p }; delete c[key]; return c; });
  const setError = (key: string, msg: string) => setErrors((p) => ({ ...p, [key]: msg }));

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});

    // validations (same rules as mobile)
    if (!name || name.trim().length < 2) {
      setError("name", "Name must be at least 2 characters");
      return;
    }

    if (!email && !phone) {
      setError("email", "Provide email or phone");
      setError("phone", "Provide email or phone");
      return;
    }

    if (email && !isValidEmail(email)) {
      setError("email", "Invalid email");
      return;
    }

    if (phone && !isValidPhone(phone)) {
      setError("phone", "Phone must be 10 digits");
      return;
    }

    if (!password || password.length < 6) {
      setError("password", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("confirmPassword", "Passwords must match");
      return;
    }

    try {
      setLoading(true);

      const registrationType: "email" | "phone" = email && email.trim() !== "" ? "email" : "phone";

      const payload: any = {
        name: name.trim(),
        role: "customer",
        registrationType,
        password,
      };

      if (registrationType === "email") {
        payload.email = email.trim().toLowerCase();
        if (phone && phone.trim() !== "") payload.phone = phone.trim();
      } else {
        payload.phone = phone.trim();
        if (email && email.trim() !== "") payload.email = email.trim().toLowerCase();
      }

      const url = `${API_BASE_URL}/auth/register`;
      const res = await axios.post(url, payload);

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        showToast(res.data?.message || "Registration successful!");
        router.replace("/home");
      } else {
        showToast(res.data?.message || "Registration failed");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Registration failed";
      showToast(msg);
      console.error("Register error:", err);
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
      {/* Toaster */}
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff" } }} />

      <div className="max-w-3xl mx-auto">


        {/* Card */}
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
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name"); }}
                placeholder="Name"
                required
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
              {errors.name && <div className="text-sm mt-2" style={{ color: colors.error }}>{errors.name}</div>}
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                placeholder="Email"
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
              {errors.email && <div className="text-sm mt-2" style={{ color: colors.error }}>{errors.email}</div>}
            </div>

            <div className="mb-4">
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/[^0-9]/g, "")); clearError("phone"); }}
                placeholder="Phone (10 digits)"
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
              {errors.phone && <div className="text-sm mt-2" style={{ color: colors.error }}>{errors.phone}</div>}
            </div>

            <div className="mb-4">
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                placeholder="Password"
                required
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
              {errors.password && <div className="text-sm mt-2" style={{ color: colors.error }}>{errors.password}</div>}
            </div>

            <div className="mb-6">
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                placeholder="Confirm Password"
                required
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
              {errors.confirmPassword && <div className="text-sm mt-2" style={{ color: colors.error }}>{errors.confirmPassword}</div>}
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
                {loading ? <Loader /> : "Sign Up"}
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
            <div className="px-4 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>OR</div>
            <div className="flex-1 h-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
          </div>

          {/* Social Sign Up */}
          <div className="mb-6">
            <SocialSignUp />
          </div>

          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            <p className="text-sm mb-2">By creating an account you agree with our{' '}
              <a href="/#" style={{ color: colors.button.start, textDecoration: "underline" }}>Privacy</a> and{' '}
              <a href="/#" style={{ color: colors.button.start, textDecoration: "underline" }}>Policy</a>
            </p>

            <p className="text-sm">
              Already have an account?{" "}
              <button onClick={() => router.push("/signin")} style={{ background: "transparent", border: "none", color: colors.button.start, cursor: "pointer" }}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
