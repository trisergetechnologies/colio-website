"use client";

import { dancingScript } from "@/app/layout";
import { colors } from "@/constants/colors";
import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Ban, CheckCircle2, ChevronDown, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  userIdToBlock: string;
  userName?: string;
};

const REASONS = [
  { value: "spam", label: "Spam or scam content", icon: "🚫" },
  { value: "harassment", label: "Harassment or bullying", icon: "😤" },
  { value: "abusive-language", label: "Abusive or offensive language", icon: "🤬" },
  { value: "nudity", label: "Nudity or sexual content", icon: "⚠️" },
  { value: "harm-to-child", label: "Harmful content involving children", icon: "🛡️" },
  { value: "hate-speech", label: "Hate speech or discrimination", icon: "❌" },
  { value: "illegal-activity", label: "Illegal or unsafe activity", icon: "⛔" },
  { value: "fake-profile", label: "Fake or misleading profile", icon: "🎭" },
  { value: "unprofessional-behavior", label: "Unprofessional behaviour", icon: "👎" },
  { value: "sexual-interations", label: "Sexual interactions", icon: "🔞" },
  { value: "other", label: "Other", icon: "📝" }
];

export default function BlockUserModal({
  open,
  onClose,
  userIdToBlock,
  userName,
}: Props) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("form");
        setReason("");
        setDescription("");
        setError(null);
      }, 300);
    }
  }, [open]);

  const selectedReason = REASONS.find((r) => r.value === reason);

  const handleProceedToConfirm = () => {
    if (!reason) {
      setError("Please select a reason");
      return;
    }
    setError(null);
    setStep("confirm");
  };

  const handleBlock = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();

      const res = await axios.post(
        `${API}/user/block`,
        {
          userIdToBlock,
          reason,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setStep("success");
        setTimeout(() => {
          router.push("/experts");
        }, 1500);
      }

      if (!res.data?.success) {
        setError(res.data?.message || "Failed to block user");
        setStep("form");
        return;
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setReason("");
      setDescription("");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with animated gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-red-950/30 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 10,
                }}
                animate={{
                  y: -10,
                  transition: {
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                  },
                }}
              />
            ))}
          </div>

          {/* Modal Container */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="
              relative
              w-full max-w-[440px]
              overflow-visible
            "
          >
            {/* Glow effect behind modal */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/10 to-red-500/20 rounded-[32px] blur-xl opacity-60" />

            {/* Main modal content */}
            <div
              className="
                relative
                bg-gradient-to-b from-white/[0.12] to-white/[0.06]
                backdrop-blur-2xl
                border border-white/[0.15]
                shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]
                px-7 py-8
                max-h-[90vh]
                overflow-y-auto
                rounded-[28px]
              "
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent'
              }}
            >
              {/* Subtle inner highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                disabled={loading}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="
                  absolute top-5 right-5 
                  w-8 h-8 
                  flex items-center justify-center
                  rounded-full 
                  bg-white/5 
                  border border-white/10
                  text-white/50 
                  hover:text-white 
                  hover:bg-white/10
                  transition-colors
                  disabled:opacity-40
                "
              >
                <X size={16} />
              </motion.button>

              <AnimatePresence mode="wait">
                {/* FORM STEP */}
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        className="
                          w-16 h-16 mx-auto mb-4 
                          rounded-2xl 
                          bg-gradient-to-br from-red-500/25 to-orange-500/15
                          border border-red-400/20
                          flex items-center justify-center
                          shadow-[0_8px_32px_-8px_rgba(239,68,68,0.4)]
                        "
                      >
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <Ban className="text-red-400" size={28} strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className={`text-[42px] leading-none ${dancingScript.className}`}
                        style={{ color: colors.white }}
                      >
                        Block & Report
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 text-sm mt-3 max-w-[280px] mx-auto leading-relaxed"
                      >
                        {userName ? (
                          <>
                            Block <span className="text-white/80 font-medium">{userName}</span>?
                            <br />
                            <span className="text-xs">They won't be able to contact you anymore.</span>
                          </>
                        ) : (
                          "You won't see messages or calls from this user."
                        )}
                      </motion.p>
                    </div>

                    {/* Custom Dropdown */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="mb-4"
                      ref={dropdownRef}
                    >
                      <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">
                        Reason <span className="text-red-400">*</span>
                      </label>

                      <div className="relative">
                        <motion.button
                          type="button"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            w-full
                            rounded-2xl
                            bg-gradient-to-br from-white/[0.08] to-white/[0.03]
                            border transition-all duration-200
                            ${dropdownOpen ? "border-red-400/50 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]" : "border-white/10 hover:border-white/20"}
                            px-4 py-3.5
                            text-left
                            flex items-center justify-between
                            group
                          `}
                        >
                          <span className={selectedReason ? "text-white" : "text-white/40"}>
                            {selectedReason ? (
                              <span className="flex items-center gap-2.5">
                                <span className="text-lg">{selectedReason.icon}</span>
                                <span className="text-sm">{selectedReason.label}</span>
                              </span>
                            ) : (
                              <span className="text-sm">Select a reason...</span>
                            )}
                          </span>
                          <motion.div
                            animate={{ rotate: dropdownOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={18} className="text-white/40 group-hover:text-white/60 transition-colors" />
                          </motion.div>
                        </motion.button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {dropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="
                                absolute z-[100]
                                w-full mt-2
                                rounded-2xl
                                bg-[#1a1a22]
                                backdrop-blur-xl
                                border border-white/10
                                shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]
                                max-h-[200px]
                                overflow-y-auto
                                overscroll-contain
                              "
                              style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.1) transparent'
                              }}
                            >
                              {REASONS.map((r, index) => (
                                <motion.button
                                  key={r.value}
                                  type="button"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  onClick={() => {
                                    setReason(r.value);
                                    setDropdownOpen(false);
                                    setError(null);
                                  }}
                                  className={`
                                    w-full px-4 py-3
                                    flex items-center gap-3
                                    text-left text-sm
                                    transition-all duration-150
                                    ${reason === r.value
                                      ? "bg-red-500/20 text-white"
                                      : "text-white/70 hover:bg-white/5 hover:text-white"
                                    }
                                  `}
                                >
                                  <span className="text-base">{r.icon}</span>
                                  <span>{r.label}</span>
                                  {reason === r.value && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="ml-auto"
                                    >
                                      <CheckCircle2 size={16} className="text-red-400" />
                                    </motion.div>
                                  )}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-5"
                    >
                      <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">
                        Additional Details{" "}
                        <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Help us understand what happened..."
                        className="
                          w-full
                          rounded-2xl
                          bg-gradient-to-br from-white/[0.08] to-white/[0.03]
                          border border-white/10
                          hover:border-white/20
                          focus:border-red-400/50
                          focus:shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]
                          px-4 py-3
                          text-white text-sm
                          placeholder:text-white/30
                          outline-none
                          resize-none
                          transition-all duration-200
                        "
                      />
                      <p className="text-white/30 text-xs mt-1.5 ml-1">
                        {description.length}/500 characters
                      </p>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          className="mb-4 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-2.5 border border-red-500/20"
                        >
                          <AlertTriangle size={16} />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToConfirm}
                      className="
                        w-full
                        rounded-2xl
                        py-4
                        text-white
                        font-semibold
                        text-sm
                        relative
                        overflow-hidden
                        group
                        transition-all duration-300
                        shadow-[0_8px_32px_-8px_rgba(239,68,68,0.5)]
                        hover:shadow-[0_12px_40px_-8px_rgba(239,68,68,0.6)]
                      "
                      style={{
                        background: `linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)`,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Shield size={18} />
                        Continue
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>
                  </motion.div>
                )}

                {/* CONFIRM STEP */}
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="
                        w-20 h-20 mx-auto mb-5
                        rounded-full
                        bg-gradient-to-br from-orange-500/20 to-red-500/20
                        border border-orange-400/30
                        flex items-center justify-center
                      "
                    >
                      <AlertTriangle className="text-orange-400" size={36} />
                    </motion.div>

                    <h3 className="text-white text-xl font-semibold mb-2">
                      Are you sure?
                    </h3>

                    <p className="text-white/50 text-sm mb-6 max-w-[300px] mx-auto leading-relaxed">
                      {userName ? (
                        <>
                          <span className="text-white/80 font-medium">{userName}</span> will be blocked
                          and reported for{" "}
                          <span className="text-red-400/90">{selectedReason?.label.toLowerCase()}</span>.
                          This action cannot be easily undone.
                        </>
                      ) : (
                        <>
                          This user will be blocked and reported. This action cannot be easily undone.
                        </>
                      )}
                    </p>

                    {/* Summary Card */}
                    <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{selectedReason?.icon}</span>
                        <span className="text-white/80 text-sm font-medium">{selectedReason?.label}</span>
                      </div>
                      {description && (
                        <p className="text-white/40 text-xs line-clamp-2 pl-7">
                          "{description}"
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("form")}
                        disabled={loading}
                        className="
                          flex-1
                          rounded-2xl
                          py-3.5
                          text-white/70
                          font-medium
                          text-sm
                          bg-white/5
                          border border-white/10
                          hover:bg-white/10
                          hover:text-white
                          transition-all
                          disabled:opacity-40
                        "
                      >
                        Go Back
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBlock}
                        disabled={loading}
                        className="
                          flex-1
                          rounded-2xl
                          py-3.5
                          text-white
                          font-semibold
                          text-sm
                          relative
                          overflow-hidden
                          disabled:opacity-60
                          shadow-[0_8px_32px_-8px_rgba(239,68,68,0.5)]
                        "
                        style={{
                          background: `linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)`,
                        }}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Blocking...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Ban size={16} />
                            Block User
                          </span>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* SUCCESS STEP */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className="
                        w-20 h-20 mx-auto mb-5
                        rounded-full
                        bg-gradient-to-br from-green-500/20 to-emerald-500/20
                        border border-green-400/30
                        flex items-center justify-center
                      "
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <CheckCircle2 className="text-green-400" size={40} />
                      </motion.div>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-white text-xl font-semibold mb-2"
                    >
                      User Blocked
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-white/50 text-sm"
                    >
                      {userName || "This user"} has been blocked and reported.
                      <br />
                      <span className="text-white/30 text-xs">Redirecting...</span>
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}