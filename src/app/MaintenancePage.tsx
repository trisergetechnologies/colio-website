"use client";

import { motion } from "framer-motion";
import { colors } from "@/constants/colors";
import Image from "next/image";
import { getImagePath } from "@/lib/utils/imagePath";

export default function MaintenancePage() {
  return (
    <section
      id="maintenance-page"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at top left, #0b0b0e 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Ambient Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[8%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(139,92,246,0.25),transparent_80%)] blur-[100px] animate-float delay-700"></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] blur-[90px]"></div>
      </div>

      {/* ✨ Content */}
      <div className="relative z-20 text-center px-6">
        {/* Animated logo glow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.button.start}, ${colors.button.end})`,
              boxShadow: `0 0 60px -10px ${colors.button.start}80`,
            }}
          >
            <Image
              src={getImagePath("/images/logo/logo.svg")}
              alt="Colio Logo"
              width={70}
              height={70}
              className="rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mb-6"
          style={{
            background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          We’re Polishing Things Up
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Our servers are taking a quick breather while we make Colio even more powerful.  
          We’ll be back online very soon — brighter, faster, and smoother than ever.
        </motion.p>

        {/* Animated pulse text */}
        <motion.div
          className="text-[#f0abfc] font-medium text-base md:text-lg tracking-wider uppercase"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          Coming back shortly...
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute bottom-[20%] left-[15%] w-[70px] h-[70px] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.2),transparent_80%)] blur-2xl"
          animate={{ y: [0, -12, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[25%] right-[20%] w-[90px] h-[90px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_80%)] blur-3xl"
          animate={{ y: [0, 14, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 🌫 Bottom Subtle Gradient for depth */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 60%, ${colors.background.end} 100%)`,
        }}
      />

      {/* ⚙️ Background animation text */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ delay: 1.2, duration: 2 }}
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-[9rem] md:text-[13rem] font-extrabold uppercase text-white/10 tracking-[0.2em] select-none"
        style={{
          textShadow: "0 0 20px rgba(217,70,239,0.3)",
        }}
      >
        MAINTENANCE
      </motion.h2>
    </section>
  );
}
