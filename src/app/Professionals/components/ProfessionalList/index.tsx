"use client";

/**
 * ProfessionalsList.tsx — Professionals Page (Section 2)
 * ------------------------------------------------------
 * ✅ Uses same background gradient style as TopIndividuals
 * ✅ Dark premium theme (no light/white tones)
 * ✅ Card layout: Avatar (left) + stacked info + action buttons below
 * ✅ Avatar: rounded-full, 96px
 * ✅ Spacing: Premium
 * ✅ Hover: Lift + glow (consistent with brand)
 * ✅ Responsive: 1 / 2 / 3 layout
 * ✅ Load More button (glass)
 */

import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoVideocamOutline,
  IoAdd,
  IoStar,
  IoStarOutline,
} from "react-icons/io5";
import { useState, useMemo } from "react";
import { colors, gradientStyles } from "@/constants/colors";

/* ----------------------------- Types & Dummy Data ----------------------------- */

type Pro = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  languages: string[];
  rating: number;
  avatar: string;
  online: boolean;
};

const ALL_PROFESSIONALS: Pro[] = [
  {
    id: "p1",
    name: "Aarav Mehta",
    age: 24,
    gender: "Male",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p2",
    name: "Sara Khan",
    age: 22,
    gender: "Female",
    languages: ["English", "Urdu"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p3",
    name: "Vihaan Kapoor",
    age: 26,
    gender: "Male",
    languages: ["English", "Hindi", "Marathi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces",
    online: false,
  },
  {
    id: "p4",
    name: "Ishita Roy",
    age: 23,
    gender: "Female",
    languages: ["English", "Bengali", "Hindi"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p5",
    name: "Aditya Sharma",
    age: 28,
    gender: "Male",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p6",
    name: "Neha Verma",
    age: 25,
    gender: "Female",
    languages: ["English", "Hindi"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=faces",
    online: false,
  },
  {
    id: "p7",
    name: "Kabir Singh",
    age: 27,
    gender: "Male",
    languages: ["English", "Punjabi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1544005316-04ce1f9c35af?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p8",
    name: "Ananya Das",
    age: 24,
    gender: "Female",
    languages: ["English", "Assamese", "Hindi"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p9",
    name: "Rohan Gupta",
    age: 29,
    gender: "Male",
    languages: ["English", "Gujarati", "Hindi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
    online: false,
  },
];

/* ---------------------------- Motion Variants ---------------------------- */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

/* -------------------------------- Component ------------------------------ */

export default function ProfessionalsList() {
  const [visible, setVisible] = useState(6);
  const list = useMemo(() => ALL_PROFESSIONALS.slice(0, visible), [visible]);
  const canLoadMore = visible < ALL_PROFESSIONALS.length;

  return (
    <section
      id="professionals-list"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        // ✅ Use same dark gradient as TopIndividuals
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Floating gradient layers (same style as TopIndividuals) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      {/* Smooth bottom fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 40%, ${colors.background.end} 100%)`,
        }}
      />

      <div className="container relative z-20">
        {/* Grid of professional cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {list.map((p) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 24px 48px -18px rgba(217,70,239,0.35)",
              }}
              className="relative flex items-start gap-6 rounded-3xl border border-white/10 bg-[rgba(15,15,17,0.75)] backdrop-blur-xl p-6 md:p-7 transition-all duration-300 hover:border-[#e879f9]/50"
            >
              {/* + Add button */}
              <button
                aria-label="Add / Connect"
                className="absolute -top-3 -right-3 rounded-full p-3 shadow-lg border border-white/10 bg-white/10 hover:bg-white/20 transition transform hover:scale-105"
              >
                <IoAdd className="w-5 h-5 text-white" />
              </button>

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="relative w-24 h-24">
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    fill
                    sizes="96px"
                    className="rounded-full object-cover border border-white/10"
                  />
                </div>

                {/* Online indicator */}
                {p.online && (
                  <div className="absolute -bottom-1 -right-1">
                    <span className="block w-5 h-5 rounded-full bg-[rgba(34,197,94,1)] border-2 border-black/40" />
                    <motion.span
                      className="absolute inset-0 -m-[2px] rounded-full"
                      style={{ boxShadow: "0 0 0 0 rgba(34,197,94,0.65)" }}
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(34,197,94,0.65)",
                          "0 0 0 10px rgba(34,197,94,0)",
                        ],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>

              {/* Info block */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-xl font-semibold truncate">
                  {p.name}
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  {p.age} • {p.gender}
                </p>

                {/* Languages */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.languages.map((lang) => (
                    <span
                      key={lang}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/85"
                    >
                      {lang}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-[2px]">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < p.rating ? (
                      <IoStar
                        key={i}
                        className="w-5 h-5"
                        style={{ color: colors.accent[400] }}
                      />
                    ) : (
                      <IoStarOutline
                        key={i}
                        className="w-5 h-5 text-white/40"
                      />
                    )
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-3 mr-4">
                  <button className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition">
                    <IoCallOutline className="w-5 h-5 text-green-500" />
                  </button>
                  <button className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition">
                    <IoChatbubbleOutline className="w-5 h-5 text-green-500" />
                  </button>
                  <button className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition">
                    <IoVideocamOutline className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More button */}
        {canLoadMore && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <button
              onClick={() =>
                setVisible((v) => Math.min(v + 6, ALL_PROFESSIONALS.length))
              }
              className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg transition-all duration-300"
            >
              Load More
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
