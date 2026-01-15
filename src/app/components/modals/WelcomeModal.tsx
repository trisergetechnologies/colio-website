"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { dancingScript } from "@/app/layout";
import { colors } from "@/constants/colors";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function WelcomeModal({ open, onClose }: Props) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Handle close and dispatch event for BestMatchModal
  const handleClose = () => {
    onClose();
    setShowComingSoon(false);
    // Dispatch event to trigger BestMatchModal (for logged-in users)
    window.dispatchEvent(new Event("download-app-closed"));
  };

  const handleDownloadClick = () => {
    setShowComingSoon(true);
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose} // Close when clicking backdrop
        >
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal
            className="
              relative
              w-[92%] max-w-[420px]
              rounded-3xl
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              px-6 py-8
              text-center
            "
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X size={22} />
            </button>

            {/* Title */}
            <p className="text-white/80 text-sm mb-1">Welcome to</p>
            <h2
              className={`text-5xl mb-3 ${dancingScript.className}`}
              style={{ color: colors.white }}
            >
              Colio
            </h2>

            <p className="text-white/70 text-sm mb-6">
              Real people. Real conversations.
            </p>

            {/* Video Call Button */}
            <motion.a
              href="/signin"
              className="
                relative
                w-full
                block
                rounded-full
                py-3
                text-white
                font-semibold
                overflow-hidden
              "
              style={{
                background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Video Call Now
            </motion.a>

            {/* Download App */}
            <button
              onClick={handleDownloadClick}
              className="
                mt-4
                w-full
                rounded-full
                py-3
                border border-white/30
                text-white/90
                hover:bg-white/10
                transition
              "
            >
              Download App
            </button>

            {/* Trust Statements */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-white/70">
              <div>Secure Platform</div>
              <div>Privacy First</div>
              <div>Best Value</div>
            </div>

            {/* ====== COMING SOON MINI MODAL ====== */}
            <AnimatePresence>
              {showComingSoon && (
                <motion.div
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeComingSoon}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onClick={(e) => e.stopPropagation()}
                    className="
                      relative
                      w-[85%] max-w-[280px]
                      rounded-2xl
                      bg-gradient-to-br from-violet-600/90 to-blue-600/90
                      backdrop-blur-xl
                      border border-white/20
                      shadow-[0_10px_40px_rgba(124,58,237,0.4)]
                      px-5 py-6
                      text-center
                    "
                  >
                    {/* Close button */}
                    <button
                      onClick={closeComingSoon}
                      className="absolute top-3 right-3 text-white/70 hover:text-white transition"
                    >
                      <X size={18} />
                    </button>

                    {/* Icon */}
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Bell size={28} className="text-white" />
                    </div>

                    {/* Text */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      Coming Soon!
                    </h3>
                    <p className="text-white/80 text-sm mb-4">
                      Our app is under development. Stay tuned for updates!
                    </p>

                    {/* Got it button */}
                    <button
                      onClick={closeComingSoon}
                      className="
                        w-full
                        rounded-full
                        py-2.5
                        bg-white
                        text-violet-600
                        font-semibold
                        text-sm
                        hover:bg-white/90
                        transition
                      "
                    >
                      Got it!
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}