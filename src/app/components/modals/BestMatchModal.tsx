"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Video, X, Star } from "lucide-react";
import { consultants } from "@/data/consultants";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BestMatchModal({ open, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const consultant = consultants[index];

  useEffect(() => {
    if (!open) return;
    const i = setInterval(() => {
      setIndex((p) => (p + 1) % consultants.length);
    }, 2500);
    return () => clearInterval(i);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
              relative
              w-[92%] max-w-[420px]
              h-[520px]
              rounded-3xl
              overflow-hidden
              bg-white/10
              backdrop-blur-xl
              border border-white/20
            "
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 text-white/80 hover:text-white"
            >
              <X />
            </button>

            {/* Consultant Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={consultant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <img
                  src={consultant.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Online Indicator */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>
              <span className="text-sm text-white/90">Online</span>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
              <Action icon={<Phone />} price={consultant.prices.call} />
              <Action icon={<MessageCircle />} price={consultant.prices.chat} />
              <Action icon={<Video />} price={consultant.prices.video} />
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
              <h3 className="text-xl font-semibold">{consultant.name}</h3>
              <p className="text-sm text-white/80 mb-2">
                {consultant.description}
              </p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="text-yellow-400" size={16} />
                {consultant.rating}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Action({ icon, price }: { icon: React.ReactNode; price: number }) {
  return (
    <div className="flex flex-col items-center">
      <button
        className="
          w-12 h-12
          rounded-2xl
          bg-white/80
          flex items-center justify-center
          text-green-500
        "
      >
        {icon}
      </button>
      <span className="mt-1 text-xs text-white/90">₹{price}/min</span>
    </div>
  );
}
