"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SocialSignIn from "../auth/SocialSignIn";
import { useAuth } from "@/context/AuthContext";
import { dancingScript } from "@/app/layout";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SignInModal({ open, onClose }: Props) {
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

      const trimmedIdentifier = identifier.trim();
      const loginType = trimmedIdentifier.includes("@") ? "email" : "phone";

      const payload = {
        identifier:
          loginType === "email"
            ? trimmedIdentifier.toLowerCase()
            : trimmedIdentifier,
        password,
        role: "customer",
        loginType,
      };

      const res = await axios.post(`${API_BASE_URL}/auth/login`, payload);

      if (res.data?.success && res.data?.data) {
        await saveAuthData(res.data.data);
        toast("Login successful!");
        onClose(); // Close modal
        router.replace("/");
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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Toaster position="top-right" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              relative
              w-[95%] max-w-md
              lg:max-w-[520px]
              rounded-2xl
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
            <div className="absolute inset-0 bg-black/65" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative z-10 px-6 py-8">
              {/* Title */}
              <div className="text-center mb-6">
                <h1
                  onClick={() => {
                    onClose();
                    router.push("/");
                  }}
                  className={`text-5xl text-white cursor-pointer ${dancingScript.className}`}
                >
                  Colio
                </h1>
                <p className="mt-2 text-sm text-white/70 tracking-wide">
                  Please sign in to continue
                </p>
              </div>

              {/* Form */}
              <div className="w-full max-w-sm mx-auto flex flex-col items-center">
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
                        text-white
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
                          text-white
                          px-4 py-3
                          outline-none
                          placeholder:text-white/50
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
                          text-white
                          px-4 py-3
                          outline-none
                          placeholder:text-white/50
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
                        text-white
                      "
                      style={{
                        background: "linear-gradient(135deg,#8F87F1,#C68EFD)",
                      }}
                    >
                      {loading ? "Please wait..." : "Sign In"}
                    </button>
                  </form>
                )}

                {/* FOOTER */}
                <div className="mt-6 w-full flex justify-between text-sm">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/forgot-password");
                    }}
                    className="text-purple-300 hover:underline"
                  >
                    Forgot Password?
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      router.push("/signup");
                    }}
                    className="text-purple-300 hover:underline"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
