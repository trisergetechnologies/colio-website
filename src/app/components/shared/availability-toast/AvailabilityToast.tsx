"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Props = {
  visible: boolean;
  name: string;
  message: string;
};

export default function AvailabilityToast({
  visible,
  name,
  message,
}: Props) {
  // 🔒 Safety guard — prevents any runtime crash
  if (!visible || !name || !message) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="
            fixed
            top-[130px] left-1/2 
            -translate-x-1/2 -translate-y-1/2
            z-40
            w-[380px] lg:w-[500px]
            rounded-2xl
            border border-white/15
            bg-white/10 backdrop-blur-xl
            shadow-[0_12px_40px_-15px_rgba(217,70,239,0.35)]
            px-4 py-3
          "
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <Image
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt={name}
                fill
                className="object-cover"
              />
            </div>

            {/* Availability pulse */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
            </span>

            {/* Text */}
            <p className="text-sm text-white/90 font-medium truncate">
              <span className="text-[#f0abfc] font-semibold">{name}</span>{" "}
              {message.replace(name, "").trim()}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
