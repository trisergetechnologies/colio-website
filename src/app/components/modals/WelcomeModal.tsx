"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { dancingScript } from "@/app/layout";
import { colors } from "@/constants/colors";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function WelcomeModal({ open, onClose }: Props) {
  // Handle close and dispatch event for BestMatchModal
  const handleClose = () => {
    onClose();
    // Dispatch event to trigger BestMatchModal (for logged-in users)
    window.dispatchEvent(new Event("download-app-closed"));
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
              onClick={handleClose}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}