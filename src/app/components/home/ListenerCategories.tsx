"use client";

import { colors } from "@/constants/colors";
import {
  LISTENER_CATEGORIES_UI,
  type ListenerCategoryId,
} from "@/constants/consultants";
import { motion } from "framer-motion";
import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";

function expertsHref(category: ListenerCategoryId) {
  return `/experts?category=${encodeURIComponent(category)}`;
}

export default function ListenerCategories() {
  return (
    <section
      id="listener-categories"
      className="relative overflow-hidden py-20 md:py-24"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(168,85,247,0.1),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_56px] opacity-20" />
      </div>

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45 mb-2">
            Browse by focus
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            Find support that fits{" "}
            <span className="text-white/90">how you feel</span>
          </h2>
          <p className="mt-3 text-base text-white/55 leading-relaxed">
            Choose a category to open the experts page with that filter — clean,
            scannable, like organizing notes in Notion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {LISTENER_CATEGORIES_UI.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Link
                href={expertsHref(item.id)}
                className={`
                  group flex flex-col h-full rounded-2xl border border-white/[0.08]
                  ${item.cardTint}
                  backdrop-blur-sm
                  pl-4 pr-5 py-5 md:py-6
                  border-l-[3px] ${item.borderAccent}
                  hover:border-white/[0.16] hover:bg-white/[0.05]
                  transition-all duration-250
                  shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">
                      {item.id}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
                      {item.blurb}
                    </p>
                  </div>
                  <span
                    className="mt-1 shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-black/20 text-white/50 group-hover:text-white group-hover:border-white/20 transition-colors"
                    aria-hidden
                  >
                    <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <span className="mt-4 text-xs font-medium text-white/45 group-hover:text-white/65 transition-colors">
                  View listeners →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            See all listeners
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
