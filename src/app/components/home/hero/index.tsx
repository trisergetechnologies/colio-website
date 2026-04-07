"use client";

import { getImagePath } from "@/lib/utils/imagePath";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { colors } from "@/constants/colors";

// Convert HEX to RGBA
function hexToRgba(hex: string, alpha = 1) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Banner() {
  const [isOpen, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 300], [0, -40]);
  const yImage = useTransform(scrollY, [0, 300], [0, 30]);

  const fadeColor = hexToRgba(colors.background.end, 1);
  const darkColor = hexToRgba(colors.gray[900], 1);

  return (
    <section
      id="home-section"
      className="relative overflow-hidden"
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 12% 10%, #17171f 0%, #0f0f12 45%, #0d0d10 100%)`,
      }}
    >
      {/* Ambient layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-16 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(217,70,239,0.16),transparent_72%)] blur-3xl" />
        <div className="absolute -bottom-24 right-0 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(139,92,246,0.14),transparent_72%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_52px] opacity-20" />
      </div>

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #0f0f11 65%, ${colors.background.end} 100%)`,
        }}
      />

      <motion.div
        style={{ y: yHero }}
        className="relative z-30 container py-24 md:py-32 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16"
      >
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center lg:text-left max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
            >
              Meaningful Conversations. Real Human Connection.
            </span>
            <br />
            <span className="text-white">
              Talk, Share, and Feel Heard.
            </span>
          </h1>

          <p className="text-white/78 text-base md:text-lg max-w-[92%] lg:max-w-[580px] mx-auto lg:mx-0 mb-8 leading-relaxed">
            Colio is a social conversation platform where you can connect with verified listeners for friendly discussions, emotional sharing, and communication support.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            <motion.a
              href="/experts"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="text-base font-semibold text-white py-3 px-8 rounded-xl border border-white/10 shadow-lg transition-all"
              style={{
                background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
            >
              Start Conversation
            </motion.a>

            
          </div>

          {/* Compliance Disclaimer */}
          <p className="text-xs text-white/45 mt-5 leading-relaxed">
            Colio is a social conversation platform. We do not provide dating,
            romantic, or adult services. All conversations must follow community
            guidelines and respectful communication policies.
          </p>
        </motion.div>

        {/* Right */}
        <motion.div
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex-1 relative w-full"
        >
          <div className="relative w-full max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-3 md:p-4 backdrop-blur-sm">
            <Image
              src={getImagePath("/images/banner/wallpaper-hero01.png")}
              alt="Colio conversation platform interface"
              width={1280}
              height={1080}
              className="rounded-xl relative z-10"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.18),transparent_78%)] blur-3xl rounded-2xl" />
          </div>
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-[min(92%,1100px)] rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.background.start}, ${colors.background.end})`,
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-white text-lg font-semibold">
                How Colio Works
              </h3>
              <button onClick={() => setOpen(false)}>
                <Icon
                  icon="tabler:circle-x"
                  className="text-3xl text-white hover:text-[#f0abfc]"
                />
              </button>
            </div>
            <iframe
              height="440"
              className="p-4 md:w-[50rem] w-full rounded-b-3xl"
              src="https://www.youtube.com/embed/xAAEiykov1w"
              title="How Colio Works"
              allowFullScreen
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
