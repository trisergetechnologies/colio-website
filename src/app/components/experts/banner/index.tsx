"use client";

import { motion } from "framer-motion";
import { IoSearch, IoChevronDown } from "react-icons/io5";
import { colors, gradientStyles } from "@/constants/colors";

const languages = [
  "All languages",
  "English",
  "Hindi",
  "Bengali",
  "Urdu",
  "Marathi",
  "Tamil",
  "Telugu",
];

// const sortOptions = ["Top Rated", "Most Active", "Newest", "Trending"];

export default function ExpertHero() {
  return (
    <section
      id="professionals-hero"
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[12%] w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      {/* Smooth fade transition to next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 45%, ${colors.background.end} 100%)`,
        }}
      />

      <div className="container relative z-20 px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="text-sm sm:text-base md:text-lg font-semibold mb-3 tracking-wide"
            style={{ color: colors.accent[400], letterSpacing: "2px" }}
          >
            FIND YOUR PEOPLE
          </p>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-center mx-auto max-w-3xl sm:max-w-4xl"
            style={gradientStyles.textGradient}
          >
            Connect with real people who match your vibe, values, and language.
          </h1>

          <p className="text-white/85 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed font-medium px-2">
            Browse our growing list of verified, highly-rated individuals across
            the world. Search by name, filter by language, and sort the way you
            like.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
