"use client";

import { motion } from "framer-motion";
import { getImagePath } from "@/lib/utils/imagePath";
import Image from "next/image";
import { colors } from "@/constants/colors";

export default function Trade() {
  return (
    <section
      id="trade-section"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Ambient Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-[5%] right-[8%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-float delay-1000"></div>
      </div>

      {/* ✨ Soft top fade blending from previous */}
      <div
        className="absolute -top-24 left-0 w-full h-[180px] pointer-events-none"
        style={{
          background: `linear-gradient(to top, #0f0f11 0%, ${colors.background.end} 70%, transparent 100%)`,
          filter: "blur(40px)",
          opacity: 0.9,
        }}
      />

      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          {/* 🖥 MacBook Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center lg:justify-start"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full max-w-[750px]"
            >
              <Image
                src={getImagePath("/images/trade/macbook.png")}
                alt="macbook-image"
                width={787}
                height={512}
                className="w-full h-auto drop-shadow-[0_0_40px_rgba(217,70,239,0.3)]"
              />
              {/* Light glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.25),transparent_70%)] blur-2xl rounded-full"></div>
            </motion.div>
          </motion.div>

          {/* 📱 Text + Icons */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left gap-7"
          >
            <motion.h2
              className="font-extrabold text-4xl md:text-5xl leading-snug text-transparent bg-clip-text bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Stay Connected,  
              <br className="hidden md:block" />  
              Anytime, Anywhere
            </motion.h2>

            <motion.p
              className="text-white/85 text-lg leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Whether you’re relaxing at home or traveling — Colio goes with you.  
              Stay in touch with your connections through our secure web and mobile experience.  
              Real-time, reliable, and always within reach.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Platform Icons */}
              {[
                // { src: "/images/trade/mac.svg", alt: "MacOS" },
                { src: "/images/trade/appstore.svg", alt: "App Store" },
                // { src: "/images/trade/windows.svg", alt: "Windows" },
                { src: "/images/trade/android.svg", alt: "Android" },
              ].map((icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"
                >
                  <Image
                    src={getImagePath(icon.src)}
                    alt={icon.alt}
                    width={65}
                    height={65}
                    className="w-14 h-14"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 🌫 Bottom fade transition to FAQ */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 50%, ${colors.background.end} 100%)`,
        }}
      />
    </section>
  );
}
