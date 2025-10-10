"use client";

import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

export default function ComingSoonPage() {
  return (
    <section
      id="coming-soon-page"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center"
      style={{
        background: `radial-gradient(circle at 20% 30%, #0a0a0c 0%, #0f0f11 60%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-[10%] left-[8%] w-[400px] sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-[100px] animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[8%] w-[450px] sm:w-[550px] md:w-[650px] h-[450px] sm:h-[550px] md:h-[650px] bg-[radial-gradient(circle,rgba(79,70,229,0.25),transparent_70%)] blur-[120px] animate-float delay-700"></div>

        {/* Floating Light Ribbon */}
        <motion.div
          className="absolute top-[35%] left-0 w-full h-[180px] opacity-[0.15]"
          style={{
            background:
              "linear-gradient(90deg, rgba(217,70,239,0.25) 0%, rgba(139,92,246,0.25) 50%, rgba(217,70,239,0.25) 100%)",
            filter: "blur(90px)",
          }}
          animate={{ x: ["-50%", "50%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              width: `${Math.random() * 3 + 2}px`,
              height: `${Math.random() * 3 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -80],
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ✨ LOGO */}
      <motion.div
        className="relative z-30 mb-10 flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[100px] sm:w-[120px] md:w-[140px] h-[100px] sm:h-[120px] md:h-[140px] rounded-full flex items-center justify-center text-white font-bold tracking-widest"
          style={{
            background: `linear-gradient(135deg, ${colors.button.start}, ${colors.button.end})`,
            boxShadow: `0 0 60px -10px ${colors.button.start}80`,
          }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [1, 0.85, 1],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold tracking-[0.25em]">
            COLIO
          </span>

          {/* Outer shimmer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white/20"
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* 🔮 HEADLINE */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-[2rem] sm:text-[2.6rem] md:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.8rem] font-extrabold mb-6 leading-tight"
        style={{
          background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 30px rgba(217,70,239,0.25)",
        }}
      >
        The Future of Connection
        <br className="hidden sm:block" />
        is Almost Here
      </motion.h1>

      {/* 🪶 SUBTITLE */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 1 }}
        className="text-white/85 text-base sm:text-lg md:text-xl max-w-[90%] sm:max-w-xl md:max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        We’re building a new way to connect, earn, and grow —  
        where authenticity meets innovation.  
        Get ready to experience something truly extraordinary.
      </motion.p>

      {/* 💫 CTA GLOW BUTTON */}
      <motion.div
        className="relative z-30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div
          className="inline-block px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg md:text-xl font-semibold text-white rounded-2xl cursor-default select-none"
          style={{
            background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
            boxShadow: `0 0 25px -8px ${colors.button.start}60`,
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

      {/* 🌠 Bottom Glow Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] sm:h-[240px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.85) 50%, ${colors.background.end} 100%)`,
        }}
      />

      {/* ⚡ Floating Watermark */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06 }}
        transition={{ delay: 1.2, duration: 2 }}
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 text-[5rem] sm:text-[7rem] md:text-[10rem] lg:text-[13rem] font-extrabold uppercase text-white/10 tracking-[0.15em] select-none"
        style={{
          textShadow: "0 0 25px rgba(217,70,239,0.4)",
        }}
      >
        COMING SOON
      </motion.h2>
    </section>
  );
}
