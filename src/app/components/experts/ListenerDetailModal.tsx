"use client";

import { colors } from "@/constants/colors";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoClose,
  IoStar,
  IoVideocamOutline,
} from "react-icons/io5";

export type ListenerDetailData = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  description?: string | null;
  category?: string | null;
  languages?: string[];
  ratePerMinute?: number | null;
  ratePerMinuteVideo?: number | null;
  ratingAverage?: number | null;
  totalSessions?: number | null;
  experienceMonths?: number | null;
  availabilityStatus?: "onWork" | "offWork" | "busy";
  dateOfBirth?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  listener: ListenerDetailData | null;
};

function ageFromDob(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  try {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age > 0 && age < 120 ? age : null;
  } catch {
    return null;
  }
}

export default function ListenerDetailModal({ open, onClose, listener }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const age = listener ? ageFromDob(listener.dateOfBirth) : null;
  const about = (listener?.description || listener?.bio || "").trim();
  const rating = listener?.ratingAverage ?? 0;

  return (
    <AnimatePresence>
      {open && listener && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="listener-detail-title"
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="relative z-10 w-full max-w-lg max-h-[min(90vh,720px)] overflow-hidden rounded-3xl border border-white/[0.12] bg-[#121214]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
            style={{
              background: `linear-gradient(165deg, #18181c 0%, ${colors.background.end} 100%)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-pink-500/15 to-transparent pointer-events-none" />

            <div className="relative flex items-start justify-between gap-3 p-5 pb-0">
              <div className="flex gap-4 min-w-0">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/10">
                  <Image
                    src={
                      listener.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={listener.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2
                    id="listener-detail-title"
                    className="text-xl font-semibold text-white truncate"
                  >
                    {listener.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/55">
                    {age != null && <span>{age} yrs</span>}
                    {listener.category && (
                      <span className="rounded-lg border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-xs font-medium text-pink-200/90">
                        {listener.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-amber-400/90">
                    <IoStar className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium tabular-nums">
                      {typeof rating === "number" ? rating.toFixed(1) : "—"}
                    </span>
                    <span className="text-white/40 text-xs">rating</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close"
              >
                <IoClose className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[calc(min(90vh,720px)-180px)] overflow-y-auto px-5 pb-6 pt-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">
                  About
                </h3>
                <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">
                  {about || "No bio added yet."}
                </p>
              </div>

              {listener.languages && listener.languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {listener.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/80 capitalize"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-white/45 mb-1">
                    Sessions
                  </p>
                  <p className="text-lg font-semibold text-white tabular-nums">
                    {listener.totalSessions ?? "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-wide text-white/45 mb-1">
                    Experience
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {listener.experienceMonths != null
                      ? `${listener.experienceMonths} mo`
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45 mb-2">
                  Rates
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <IoCallOutline className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/45">Voice</p>
                      <p className="text-sm font-semibold text-white">
                        ₹{listener.ratePerMinute ?? "—"}
                        <span className="text-white/40 text-xs font-normal">/min</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <IoVideocamOutline className="h-4 w-4 text-pink-400 shrink-0" />
                    <div>
                      <p className="text-[10px] text-white/45">Video</p>
                      <p className="text-sm font-semibold text-white">
                        ₹{listener.ratePerMinuteVideo ?? "—"}
                        <span className="text-white/40 text-xs font-normal">/min</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                <IoChatbubbleOutline className="h-4 w-4 text-white/50 shrink-0" />
                <div className="text-sm text-white/60">
                  <span className="text-white/45">Status: </span>
                  {listener.availabilityStatus === "onWork"
                    ? "Available"
                    : listener.availabilityStatus === "busy"
                      ? "Busy"
                      : "Offline"}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
