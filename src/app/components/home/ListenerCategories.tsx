"use client";

import { colors } from "@/constants/colors";
import {
  LISTENER_CATEGORIES_UI,
  type ListenerCategoryId,
} from "@/constants/consultants";
import { Icon } from "@iconify/react";
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
        <div className="absolute top-[20%] right-[10%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(168,85,247,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_56px] opacity-20" />
        <div className="absolute -top-20 left-[8%] w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(244,114,182,0.14),transparent_70%)] blur-3xl" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {LISTENER_CATEGORIES_UI.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group h-full"
            >
              {/* Gradient frame (glassmorphism + bold border) */}
              <div
                className={`relative h-full rounded-2xl p-px bg-gradient-to-br ${item.gradientBorder} shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_22px_50px_-28px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_28px_60px_-24px_rgba(217,70,239,0.18)] group-hover:-translate-y-1`}
              >
                <Link
                  href={expertsHref(item.id)}
                  className={`
                    relative flex h-full flex-col overflow-hidden rounded-[15px]
                    border border-white/[0.06] ${item.cardTint}
                    bg-zinc-950/75 backdrop-blur-xl
                    px-5 py-5 md:px-6 md:py-6
                    transition-colors duration-300
                    group-hover:bg-zinc-950/65
                  `}
                >
                  {/* Sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent opacity-60" />
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl opacity-30 transition-opacity duration-300 group-hover:opacity-50" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start gap-3">
                        <span
                          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradientBorder} text-white shadow-lg shadow-black/30 ring-1 ring-white/20`}
                          aria-hidden
                        >
                          <Icon icon={item.icon} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
                            Listener topic
                          </p>
                          <h3 className="text-lg font-semibold text-white tracking-tight leading-tight">
                            {item.id}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">
                        {item.blurb}
                      </p>
                    </div>
                    <span
                      className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white"
                      aria-hidden
                    >
                      <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <span className="text-xs font-medium text-white/55 group-hover:text-white/80 transition-colors">
                      Open filtered list
                    </span>
                    <span
                      className={`h-1 w-12 rounded-full bg-gradient-to-r ${item.gradientBorder} opacity-80 transition-all duration-300 group-hover:w-20 group-hover:opacity-100`}
                    />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
          >
            See all listeners
            <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
