"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SocialSignIn from "../SocialSignIn";
import { useAuth } from "@/context/AuthContext";
import colors from "@/constants/colors";
import { dancingScript } from "@/app/layout";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function Signin() {
  const router = useRouter();
  const { saveAuthData } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      setLoading(true);
      const payload = {
        identifier: identifier.trim().toLowerCase(),
        password,
        role: "customer",
      };

      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        payload
      );

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        toast("Login successful!");
        router.replace("/home");
      } else {
        toast(res.data?.message || "Invalid credentials");
      }
    } catch (err: any) {
      toast(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen  lg:pt-[120px] flex justify-center text-white">
      {/* PAGE BACKGROUND IMAGE (replaces gradient) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac)",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <Toaster position="top-right" />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex justify-center">
        {/* AUTH CARD */}
        <div
          className="
            relative
            w-full
            min-h-screen sm:min-h-0
            sm:max-w-md
            lg:max-w-[520px]
            xl:max-w-[720px]
            lg:h-[420px]
            xl:h-[520px]
            rounded-none sm:rounded-2xl
            overflow-hidden
            shadow-2xl
          "
        >
          {/* CARD BACKGROUND */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac)",
            }}
          />

          {/* TOP TITLE */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
            <h1 onClick={()=> router.push('/')} className={`text-5xl pt-3 ${dancingScript.className}`}>
              Colio
            </h1>
            <p className="mt-1 text-sm text-white/70 tracking-wide">
              Please sign in to continue
            </p>
          </div>

          <div className="absolute inset-0 bg-black/65" />

          {/* CENTER CONTENT */}
          <div className="relative z-10 h-full flex items-center justify-center px-6 sm:px-8">
            <div className="w-full max-w-sm flex flex-col items-center">
              {/* GOOGLE + EMAIL */}
              {!showEmailForm && (
                <>
                  <div
                    className="
                      w-full
                      [&>button]:w-full
                      [&>button]:py-3
                      [&>button]:rounded-xl
                      [&>button]:text-sm
                    "
                  >
                    <SocialSignIn />
                  </div>

                  <button
                    onClick={() => setShowEmailForm(true)}
                    className="
                      mt-4
                      w-full
                      rounded-xl
                      border border-white/20
                      bg-white/10
                      py-3
                      text-sm font-medium
                      hover:bg-white/15
                      transition
                    "
                  >
                    Continue with Email
                  </button>
                </>
              )}

              {/* EMAIL FORM */}
              {showEmailForm && (
                <form onSubmit={handleLogin} className="w-full">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or phone"
                      className="
                        w-full
                        rounded-xl
                        border border-white/20
                        bg-transparent
                        px-4 py-3
                        outline-none
                      "
                    />
                  </div>

                  <div className="mb-6">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="
                        w-full
                        rounded-xl
                        border border-white/20
                        bg-transparent
                        px-4 py-3
                        outline-none
                      "
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      rounded-xl
                      py-3
                      font-semibold
                    "
                    style={{
                      background:
                        "linear-gradient(135deg,#8F87F1,#C68EFD)",
                    }}
                  >
                    {loading ? "Please wait..." : "Sign In"}
                  </button>
                </form>
              )}

              {/* FOOTER */}
              <div className="mt-6 w-full flex justify-between text-sm">
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="text-purple-300 hover:underline"
                >
                  Forgot Password?
                </button>

                <button
                  onClick={() => router.push("/signup")}
                  className="text-purple-300 hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
