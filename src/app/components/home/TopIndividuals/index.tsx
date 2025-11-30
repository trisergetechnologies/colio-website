"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IoCallOutline, IoChatbubbleOutline, IoVideocamOutline, IoAdd, IoStar, IoStarOutline } from "react-icons/io5";
import { colors, gradientStyles } from "@/constants/colors";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";


type Profile = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  languages: string[];
  rating: number; // 0-5
  avatar: string;
  online: boolean;
};

const profiles: Profile[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    age: 24,
    gender: "Male",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar:  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "2",
    name: "Sara Khan",
    age: 22,
    gender: "Female",
    languages: ["English", "Urdu"],
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "3",
    name: "Vihaan Kapoor",
    age: 26,
    gender: "Male",
    languages: ["English", "Hindi", "Marathi"],
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "4",
    name: "Ishita Roy",
    age: 23,
    gender: "Female",
    languages: ["English", "Bengali", "Hindi"],
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
];

const containerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

export default function TopIndividuals() {
  return (
    <section
      id="top-individuals-section"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Floating Gradient Layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      {/* Smooth bottom fade (to blend into next section) */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 40%, ${colors.background.end} 100%)`,
        }}
      />

      <div className="container relative z-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="text-base sm:text-lg font-semibold mb-4 tracking-wide"
            style={{ color: colors.accent[400], letterSpacing: "2px" }}
          >
            COMMUNITY PICKS
          </p>

          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-center mx-auto max-w-3xl"
            style={gradientStyles.textGradient}
          >
            Top Individuals to Connect
          </h2>

          <p className="text-white/85 max-w-2xl mx-auto md:text-lg leading-relaxed font-medium">
            Genuine, active, and highly rated. Start a chat, hop on a call, or
            jump into a video—on your terms.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8"
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {profiles.map((p, i) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: "0 24px 48px -18px rgba(217,70,239,0.35)",
              }}
              className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 md:p-7 flex flex-col gap-4 transition-all duration-300 hover:border-[#e879f9]/50"
            >
              {/* + Add button (top-right overlay) */}
              <button
                aria-label="Add / Connect"
                className="absolute -top-3 -right-3 z-10 rounded-full p-3 shadow-lg border border-white/10 bg-white/10 hover:bg-white/20 transition transform hover:scale-105"
              >
                <IoAdd className="w-5 h-5 text-white" />
              </button>

              {/* Avatar + Online indicator */}
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <Image
                  src={p.avatar}
                  alt={p.name}
                  fill
                  className="rounded-full object-cover border border-white/10"
                />
                {p.online && (
                  <>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[rgba(34,197,94,1)] border-2 border-black/40" />
                    {/* Pulse ring */}
                    <motion.span
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full"
                      style={{ boxShadow: "0 0 0 0 rgba(34,197,94,0.7)" }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(34,197,94,0.7)",
                          "0 0 0 10px rgba(34,197,94,0)",
                        ],
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  </>
                )}
              </div>

              {/* Name / Meta */}
              <div className="mt-1">
                <h5 className="text-white text-xl font-semibold">{p.name}</h5>
                <p className="text-white/70 text-sm">
                  {p.age} • {p.gender}
                </p>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-2 mt-1">
                {p.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/85"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Rating (5-star icons) */}
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, idx) =>
                  idx < p.rating ? (
                    <IoStar
                      key={idx}
                      className="w-5 h-5"
                      style={{ color: colors.accent[400] }}
                    />
                  ) : (
                    <IoStarOutline
                      key={idx}
                      className="w-5 h-5 text-white/40"
                    />
                  )
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/10 bg-white/10 hover:bg-white/20 text-white transition">
                  <IoCallOutline className="w-5 h-5" />
                  <span className="text-sm font-medium">Call</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/10 bg-white/10 hover:bg-white/20 text-white transition">
                  <IoChatbubbleOutline className="w-5 h-5" />
                  <span className="text-sm font-medium">Chat</span>
                </button>
                <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-white/10 bg-white/10 hover:bg-white/20 text-white transition">
                  <IoVideocamOutline className="w-5 h-5" />
                  <span className="text-sm font-medium">Video</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* See More Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <Link
            href="../experts"
            className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all duration-300 backdrop-blur-md inline-flex items-center gap-2"
          >
            <span className="font-medium">See all professionals</span>
            <IoArrowForward className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
