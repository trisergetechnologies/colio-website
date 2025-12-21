"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  visible: boolean;
  name: string;
  message: string;
  duration?: number;
  minGapBetweenToasts?: number;
};

export default function AvailabilityToast({
  visible,
  name,
  message,
  duration = 4000,
  minGapBetweenToasts = 30000, // 15 seconds gap
}: Props) {
  const [shouldShow, setShouldShow] = useState(false);
  const [lastShownTime, setLastShownTime] = useState(0);

  useEffect(() => {
    if (!visible || !name || !message) {
      setShouldShow(false);
      return;
    }

    const now = Date.now();
    const timeSinceLastToast = now - lastShownTime;

    // Only show if enough time has passed since last toast
    if (timeSinceLastToast >= minGapBetweenToasts || lastShownTime === 0) {
      setShouldShow(true);
      setLastShownTime(now);

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, name, message, duration, minGapBetweenToasts, lastShownTime]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1] // Custom easing for smoother feel
          }}
          className="
            fixed
            top-24 left-1/2
            -translate-x-1/2
            z-50
            w-[min(90vw,420px)]
            rounded-2xl
            border border-white/10
            bg-gradient-to-br from-white/[0.08] to-white/[0.03]
            backdrop-blur-2xl
            shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.05)_inset]
            px-5 py-4
            overflow-hidden
            cursor-pointer
            hover:scale-[1.02]
            transition-transform
          "
        >
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="
              absolute bottom-0 left-0
              h-[2px] w-full
              bg-gradient-to-r from-emerald-400 via-emerald-300 to-transparent
              origin-left
            "
          />

          <div className="relative flex items-center gap-3.5">
            {/* Avatar with glow */}
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  w-11 h-11
                  rounded-full
                  overflow-hidden
                  ring-2 ring-emerald-400/20
                  shadow-lg
                "
              >
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt={name}
                  className="object-cover w-full h-full"
                />
              </motion.div>
              
              {/* Online indicator with improved animation */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 ring-2 ring-white/20" />
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-[15px] leading-relaxed">
                <span className="font-semibold text-white/95">{name}</span>
                <span className="text-white/70 ml-1">
                  {message.replace(name, "").trim()}
                </span>
              </p>
              <p className="text-xs text-white/40 mt-0.5">Just now</p>
            </div>

            {/* Subtle close button */}
            <button
              onClick={() => setShouldShow(false)}
              className="
                opacity-0 hover:opacity-100
                transition-opacity
                text-white/40 hover:text-white/70
                text-lg
                w-6 h-6
                flex items-center justify-center
                rounded-full
                hover:bg-white/5
              "
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}