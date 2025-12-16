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
        background: `radial-gradient(circle at top left, #0b0b0e 0%, #111114 100%)`,
      }}
    >
      {/* ✨ Ambient Layers */}
      <div className="absolute inset-0">
        <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.25),transparent_80%)] blur-3xl animate-float delay-1000"></div>
      </div>

      {/* Gentle overlay for depth */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* ✅ Fade to next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px] z-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, #0f0f11 60%, ${colors.background.end} 100%)`,
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y: yHero }}
        className="relative z-30 container py-32 md:py-40 flex flex-col lg:flex-row items-center justify-between gap-16"
      >
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
            >
              Connect Beyond the Screen
            </span>
            <br />
            <span className="text-white drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">
              Real People. Real Energy.
            </span>
          </h1>

          <p className="text-white/85 text-lg md:text-xl max-w-[90%] lg:max-w-[550px] mx-auto lg:mx-0 mb-10 leading-relaxed">
            Talk it out. Chill it out. Colio it out with genuine individuals:
            All within a safe, secure, and premium app experience built for the
            next generation of digital connection.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-6">
            <motion.a
              href="/experts"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="text-lg font-semibold text-white py-3 px-10 rounded-2xl shadow-lg transition-all"
              style={{
                background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
            >
              Get Started
            </motion.a>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <motion.a
                onClick={() => window.dispatchEvent(new Event("open-best-match"))}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className="text-lg font-semibold text-white py-3 px-12 rounded-2xl shadow-lg transition-all"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                }}
              >
                Best Match For You
              </motion.a>
            </div>

            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen(true)}
              className="flex items-center gap-3 px-6 py-3 border border-white/30 rounded-2xl text-white/90 text-lg backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <Icon icon="tabler:play-filled" className="text-2xl text-[#f0abfc]" />
              Watch How It Works
            </motion.button> */}
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative w-full max-w-lg mx-auto">
            <Image
              src={getImagePath("/images/banner/wallpaper-hero01.png")}
              alt="Colio App Preview"
              width={1280}
              height={1080}
              className="rounded-2xl relative z-10 drop-shadow-[0_0_40px_rgba(217,70,239,0.4)]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.25),transparent_80%)] blur-3xl rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* 🎥 Video Modal */}
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
