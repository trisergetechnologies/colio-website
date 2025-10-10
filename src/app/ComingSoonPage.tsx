"use client";

import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

export default function ComingSoonPage() {
  return (
    <section
      id="coming-soon-page"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center"
      style={{
        background: `radial-gradient(circle at 30% 20%, #0b0b0e 0%, #111114 80%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Ambient Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep aura layers */}
        <div className="absolute top-[15%] left-[5%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-[120px] animate-float"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(79,70,229,0.25),transparent_80%)] blur-[120px] animate-float-slow"></div>

        {/* Flowing light waves */}
        <motion.div
          className="absolute top-[35%] left-0 w-full h-[200px] opacity-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(217,70,239,0.4) 0%, rgba(147,51,234,0.4) 50%, rgba(217,70,239,0.4) 100%)",
            filter: "blur(80px)",
          }}
          animate={{ x: ["-40%", "40%", "-40%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-white/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
            animate={{
              y: [0, -80],
              opacity: [1, 0.3, 1],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 🔮 Animated Logo Orb */}
      <motion.div
        className="relative z-30 mb-12 flex justify-center items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full flex items-center justify-center text-white"
          style={{
            background: `linear-gradient(145deg, ${colors.button.start}, ${colors.button.end})`,
            boxShadow: `0 0 50px -10px ${colors.button.start}AA, 0 0 80px 20px rgba(217,70,239,0.2)`,
          }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [1, 0.9, 1],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="text-[26px] sm:text-[30px] font-semibold tracking-[0.3em]"
            animate={{ opacity: [1, 0.8, 1], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            COLIO
          </motion.span>

          {/* Pulsing energy ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Radiating glow ripples */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#d946ef]/30"
            style={{
              width: 200 + i * 100,
              height: 200 + i * 100,
            }}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 4 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* 🌈 Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.6rem] font-extrabold leading-snug mb-6 text-center"
        style={{
          background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Something Incredible is on the Horizon
      </motion.h1>

      {/* 💬 Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4"
      >
        A new era of connection, creativity, and authenticity is taking shape.  
        Stay tuned — your world is about to change with <span className="text-[#f0abfc] font-medium">Colio</span>.
      </motion.p>

      {/* ⚡ Glowing CTA */}
      <motion.div
        className="relative z-30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div
          className="inline-block px-10 py-4 text-lg sm:text-xl font-semibold text-white rounded-2xl cursor-default"
          style={{
            background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
            boxShadow: `0 0 25px -8px ${colors.button.start}80`,
          }}
        >
          Coming Soon
        </div>

        <motion.div
          className="absolute inset-0 rounded-2xl border border-transparent"
          style={{
            background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* 🌫 Bottom Fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px]"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 60%, ${colors.background.end} 100%)`,
        }}
      />

      {/* 🪩 Floating Title Watermark */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ delay: 1.2, duration: 2 }}
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-[6rem] sm:text-[8rem] md:text-[11rem] font-extrabold uppercase tracking-[0.2em] text-white/10 select-none"
        style={{
          textShadow: "0 0 40px rgba(217,70,239,0.4)",
        }}
      >
        COMING SOON
      </motion.h2>
    </section>
  );
}
