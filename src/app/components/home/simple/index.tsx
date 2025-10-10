"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { colors, gradientStyles } from "@/constants/colors";

export default function Simple() {
  return (
    <section
      id="simple-section"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: `linear-gradient(180deg, ${colors.background.end} 0%, #0f0f11 100%)`,
      }}
    >
      {/* ✨ Ambient floating gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_80%)] blur-3xl animate-pulse-slow"></div>
      </div>

      {/* 🌫 Top fade for section continuity */}
      <div
        className="absolute -top-20 left-0 w-full h-[160px] pointer-events-none"
        style={{
          background: `linear-gradient(to top, #0f0f11 0%, ${colors.background.end} 75%, transparent 100%)`,
          filter: "blur(40px)",
          opacity: 0.9,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-20 container">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2
            className="font-extrabold text-4xl md:text-5xl mb-6 leading-tight bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf] bg-clip-text text-transparent"
          >
            Simplicity Meets Real Connection
          </h2>

          <p className="text-white/85 text-lg md:text-xl leading-relaxed mb-10">
            Colio makes it effortless to connect with real people.  
            Secure, transparent, and built for trust — you stay in control  
            while enjoying authentic moments that truly matter.
          </p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              href="/"
              className="relative inline-block text-lg md:text-xl font-semibold text-white py-4 px-10 md:px-14 rounded-2xl transition-transform duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                boxShadow: `0 0 30px -8px ${colors.button.start}50`,
              }}
            >
              Connect Now
              {/* Soft glowing border animation */}
              <motion.span
                className="absolute inset-0 rounded-2xl border-2 border-transparent"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.04, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* 🌌 Bottom fade transition to Trade section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 60%, ${colors.background.end} 100%)`,
        }}
      />
    </section>
  );
}
