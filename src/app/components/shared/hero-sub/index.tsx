"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

interface HeroSubProps {
  title: string;
}

const HeroSub: FC<HeroSubProps> = ({ title }) => {
  return (
    <section
      className="relative py-36 md:py-44 flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.background.start} 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* ✨ Soft glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)] blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_80%)] blur-3xl animate-float"></div>
      </div>

      {/* 🌈 Content */}
      <div className="container relative z-10 mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf]
                     font-extrabold text-4xl md:text-6xl tracking-tight drop-shadow-[0_2px_20px_rgba(217,70,239,0.3)]"
        >
          {title}
        </motion.h2>

        {/* ✨ Subtle underline accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 h-[3px] w-20 mx-auto rounded-full"
          style={{
            background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
          }}
        ></motion.div>
      </div>

      {/* 📱 Top gradient overlay for blending with header */}
      <div
        className="absolute top-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 100%)`,
        }}
      ></div>
    </section>
  );
};

export default HeroSub;
