"use client";

import React from "react";
import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } },
};

export default function AppDownloadSection() {
  return (
    <section
      id="download-section"
      className="relative py-28 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 95%)`,
      }}
    >
      {/* 🌌 Ambient Floating Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[15%] left-[12%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.2),transparent_70%)] blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Smooth top fade from banner */}
      <div
        className="absolute -top-20 left-0 w-full h-[180px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to top, #0f0f11 0%, ${colors.background.end} 75%, transparent 100%)`,
          filter: "blur(40px)",
          opacity: 0.85,
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-full h-[220px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 55%, ${colors.background.end} 100%)`,
        }}
      ></div>
      {/* 🌈 Content */}
      <motion.div
        className="container relative z-20 text-center flex flex-col items-center justify-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.p
          variants={item}
          className="text-base sm:text-lg font-semibold mb-4 tracking-widest"
          style={{ color: colors.accent[400], letterSpacing: "2px" }}
        >
          GET THE APP
        </motion.p>

        <motion.h3
          variants={item}
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.accent[200]}, ${colors.button.start}, ${colors.button.end})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Take Colio Wherever You Go
        </motion.h3>

        <motion.p
          variants={item}
          className="text-white/85 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Stay connected, earn rewards, and shop smarter — all from the palm of your hand.  
          <br className="hidden md:block" />
          Available soon on your favorite app store.
        </motion.p>

        {/* Store Buttons */}
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-8 flex-wrap mt-6"
        >
          {/* Google Play */}
          <motion.a
            href="#"
            aria-label="Get Colio on Google Play"
            whileHover={{ translateY: -4, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 rounded-xl px-5 py-3 min-w-[190px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 0 25px -8px rgba(217,70,239,0.4)`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-center rounded-lg w-[46px] h-[46px] bg-[rgba(255,255,255,0.08)]">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M4 4L32 24 4 44V4Z" fill="#34A853" />
                <path d="M32 24L4 44L36 36L32 24Z" fill="#FBBC05" />
                <path d="M32 24L36 36L44 32L32 24Z" fill="#EA4335" />
                <path d="M32 24L44 16L36 12L32 24Z" fill="#4285F4" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                Get it on
              </div>
              <div className="text-sm font-semibold text-white">Google Play</div>
            </div>
          </motion.a>

          {/* App Store */}
          <motion.a
            href="#"
            aria-label="Download Colio on the App Store"
            whileHover={{ translateY: -4, scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 rounded-xl px-5 py-3 min-w-[190px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `0 0 25px -8px rgba(0,122,255,0.35)`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-lg w-[46px] h-[46px]"
              style={{
                background: "linear-gradient(145deg, #007aff, #0a84ff)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 512 512"
                fill="white"
              >
                <path d="M255.7,32C132.3,32,32,132.3,32,255.7c0,123.4,100.3,223.7,223.7,223.7S479.4,379.1,479.4,255.7C479.4,132.3,379.1,32,255.7,32z M385.5,342.2h-76.2l-18.9-33h-68.4l-18.9,33h-76.2l86.4-149.7l-29.4-50.9h48l15.3,26.4l15.3-26.4h48l-29.4,50.9L385.5,342.2z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-widest text-white/60">
                Download on the
              </div>
              <div className="text-sm font-semibold text-white">App Store</div>
            </div>
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Fade into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 40%, ${colors.background.end} 100%)`,
        }}
      ></div>
    </section>
  );
}
