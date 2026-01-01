"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ChevronLeft, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { dancingScript } from "@/app/layout";
import { getGoogleOAuthURL } from "@/lib/utils/googleClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function Signin() {
  const router = useRouter();
  const { saveAuthData } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"landing" | "email">("landing");

  const handleGoogleLogin = () => {
    try {
      const googleAuthURL = getGoogleOAuthURL();
      window.location.href = googleAuthURL;
    } catch (error) {
      console.error("Failed to initiate Google sign-in:", error);
      toast.error("Failed to connect to Google.");
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const trimmedIdentifier = identifier.trim();
      const loginType = trimmedIdentifier.includes("@") ? "email" : "phone";

      const payload = {
        identifier:
          loginType === "email" ? trimmedIdentifier.toLowerCase() : trimmedIdentifier,
        password,
        role: "customer",
        loginType,
      };

      const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        toast.success("Login successful!");
        router.replace("/home");
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // MAIN PAGE BACKGROUND (Black on desktop to make centered card pop)
    <div className="flex min-h-screen w-full items-center justify-center bg-black font-sans text-slate-900">
      <Toaster position="top-center" />

      {/* --- CARD CONTAINER --- */}
      {/* Mobile: w-full h-screen (Full View)
          Desktop: Fixed width/height card (500px x 620px), centered, rounded corners
      */}
      <div className="relative h-screen w-full overflow-hidden bg-slate-900 shadow-2xl md:h-[620px] md:w-[500px] md:rounded-[32px]">
        
        {/* BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/signinbackground.jpg')",
          }} 
        />

        {/* DARK GRADIENT OVERLAY - Strong fade from bottom to top for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95" />

        {/* --- CONTENT LAYER --- */}
        <div className="relative z-10 flex h-full flex-col px-8 py-10">
          
          {/* HEADER: Logo & Quote */}
          <div className="mt-4 flex flex-col items-center text-center">
            {/* Logo */}
            <h1 className={`text-5xl text-white drop-shadow-lg ${dancingScript.className}`}>
              Colio
            </h1>
            
            {/* Inspirational Quote instead of count */}
            <p className="mt-3 text-lg font-medium text-white/90 drop-shadow-md italic">
              "Where genuine connections spark."
            </p>
          </div>

          {/* CLOSE BUTTON (Top Right) */}
          <button 
            onClick={() => router.push('/')}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <X size={18} />
          </button>

          {/* SPACER puts buttons at bottom */}
          <div className="flex-grow" />

          {/* --- BOTTOM SECTION --- */}
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: LANDING BUTTONS */}
            {view === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex w-full flex-col gap-4 pb-6"
              >
                {/* NEW COIN OFFER BANNER */}
                <div className="mb-2 flex justify-center">
                  <div className="relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 py-2 shadow-lg shadow-purple-500/20">
                    <span className="text-lg">🎉</span>
                    <span className="text-sm font-bold text-white">Get <span className="font-extrabold text-yellow-200">200 instant coins</span> on registration!</span>
                  </div>
                </div>

                {/* SIGN IN WITH GOOGLE (White Pill) */}
                <button
                  onClick={handleGoogleLogin}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 font-bold text-slate-900 transition hover:bg-slate-100 active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="transition group-hover:scale-110">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>

                {/* SIGN IN WITH EMAIL (White Pill) */}
                <button
                  onClick={() => setView("email")}
                  className="group flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 font-bold text-slate-900 transition hover:bg-slate-100 active:scale-95"
                >
                  <Mail className="text-slate-900 transition group-hover:scale-110" size={20} />
                  Sign in with Email
                </button>

                {/* Simple Create Account Link (Clean footer) */}
                 <button onClick={() => router.push('/signup')} className="mt-2 text-sm font-medium text-white/80 hover:text-white hover:underline">
                    Don't have an account? Sign up
                  </button>
              </motion.div>
            )}

            {/* VIEW 2: EMAIL FORM (Slides up inside the card) */}
            {view === "email" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="w-full pb-6"
              >
                <div className="mb-6 flex items-center gap-3">
                  <button 
                    onClick={() => setView("landing")} 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-white">Email Sign In</h2>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or phone"
                      className="w-full rounded-full border-none bg-white/90 px-5 py-4 pl-12 text-sm text-slate-900 placeholder-slate-500 shadow-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full rounded-full border-none bg-white/90 px-5 py-4 pl-12 text-sm text-slate-900 placeholder-slate-500 shadow-xl focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-purple-500/30 transition hover:shadow-purple-500/50 disabled:opacity-70"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>

                  <button 
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    className="mt-2 text-center text-xs font-medium text-white/70 hover:text-white"
                  >
                    Forgot Password?
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}