"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import colors from "@/constants/colors";
import { dancingScript } from "@/app/layout";
import SocialSignUp from "../SocialSignUp";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const {saveAuthData} = useAuth();

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone,
        password,
        role: "customer",
      };

      const res = await axios.post(`${API_BASE_URL}/auth/register`, payload);

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        toast("Account created successfully!");
        router.replace("/home");
      } else {
        toast(res.data?.message || "Signup failed");
      }
    } catch (err: any) {
      toast(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen lg:pt-[120px] flex justify-center text-white">
      {/* PAGE BACKGROUND */}
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
            xl:max-w-[760px]
            lg:h-[520px]
            xl:h-[620px]
            rounded-none sm:rounded-2xl
            overflow-hidden
            shadow-2xl
          "
        >
          {/* CARD BG */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac)",
            }}
          />

          {/* HEADER */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center">
            <h1 onClick={()=> router.push('/')} className={`text-5xl pt-3 ${dancingScript.className}`}>
              Colio
            </h1>
            <p className="mt-1 text-sm text-white/70 tracking-wide">
              Create your account
            </p>
          </div>

          <div className="absolute inset-0 bg-black/65" />

          {/* BODY */}
          <div className="relative z-10 h-full flex items-center justify-center px-6 sm:px-8">
            <div className="w-full max-w-md flex flex-col items-center">
              {/* SOCIAL */}
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
                    <SocialSignUp />
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
                    Sign up with Email
                  </button>
                </>
              )}

              {/* FORM */}
              {showEmailForm && (
                <form onSubmit={handleSignup} className="w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className="rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl py-3 font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg,#8F87F1,#C68EFD)",
                    }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              )}

              {/* FOOTER */}
              <div className="mt-6 w-full flex justify-center text-sm">
                <span className="text-white/70">Already have an account?</span>
                <button
                  onClick={() => router.push("/signin")}
                  className="ml-2 text-purple-300 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
