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

const sortOptions = ["Top Rated", "Most Active", "Newest", "Trending"];

export default function Hero() {
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

        {/* Search + Filters */}
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="rounded-2xl sm:rounded-full bg-white/10 border border-white/15 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(217,70,239,0.35)] overflow-hidden">
            {/* Layout: column → row */}
            <div className="flex flex-col md:flex-row md:items-center divide-y divide-white/10 md:divide-y-0 md:divide-x">
              {/* Search field */}
              <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
                <IoSearch className="w-5 h-5 text-white/70 shrink-0" />
                <input
                  type="text"
                  placeholder="Search professionals by name or interest..."
                  className="w-full bg-transparent outline-none text-white placeholder-white/60 text-sm sm:text-base"
                  aria-label="Search professionals"
                />
              </div>

              {/* Language filter */}
              <div className="relative px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
                <select
                  id="language"
                  className="appearance-none bg-white/10 border border-white/15 text-white  `1 rounded-full pl-4 pr-10 py-2 text-sm sm:text-base backdrop-blur-md hover:bg-white/15 transition w-full"
                  defaultValue={languages[0]}
                  aria-label="Filter by language"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang}
                      value={lang}
                      className="bg-[#1a1a1a] text-white"
                    >
                      {lang}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 sm:right-6 md:right-7 top-1/2 -translate-y-1/2">
                  <IoChevronDown className="w-4 h-4 text-white/70" />
                </span>
              </div>

              {/* Sort filter */}
              <div className="relative px-4 py-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4">
                <select
                  id="sort"
                  className="appearance-none bg-white/10 border border-white/15 text-white rounded-full pl-4 pr-10 py-2 text-sm sm:text-base backdrop-blur-md hover:bg-white/15 transition w-full"
                  defaultValue={sortOptions[0]}
                  aria-label="Sort professionals"
                >
                  {sortOptions.map((opt) => (
                    <option
                      key={opt}
                      value={opt}
                      className="bg-[#1a1a1a] text-white"
                    >
                      {opt}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 sm:right-6 md:right-7 top-1/2 -translate-y-1/2">
                  <IoChevronDown className="w-4 h-4 text-white/70" />
                </span>
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="text-center mt-4 sm:mt-3">
            <p className="text-[11px] sm:text-xs md:text-sm text-white/60">
              UI only for now — search and filters will be wired in the next
              step.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
