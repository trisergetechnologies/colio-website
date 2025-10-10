"use client";

import { workdata } from "@/lib/data/pageData";
import { getImagePath } from "@/lib/utils/imagePath";
import Image from "next/image";
import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

export default function Work() {
  return (
    
    <section
      id="howitworks-section"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, ${colors.background.end} 0%, #0f0f11 100%)`,
      }}
    >
      {/* 🌫 Top fade – smooth blend with banner */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.85) 50%, ${colors.background.end} 100%)`,
        }}
      ></div>

      {/* ✨ Ambient gradients for depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-10 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-[radial-gradient(circle,rgba(217,70,239,0.2),transparent_80%)] blur-3xl animate-float delay-2000"></div>
      </div>

      {/* Content */}
      <div className="container relative z-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(217,70,239,0.4)]"
          >
            How It Works
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto md:text-lg leading-relaxed font-medium">
            Begin your journey toward <span className="text-[#f5d0fe] font-semibold">real, meaningful connections.</span>  
            <br className="hidden md:block" />
            Just three steps — your story, your vibe, your people.
          </p>
        </motion.div>

        {/* Step Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-10 mt-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {workdata?.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.95 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
                },
              }}
              className="relative bg-white/10 backdrop-blur-2xl border border-white/10 group
                         rounded-3xl p-10 text-center transition-all duration-500
                         hover:-translate-y-4 hover:shadow-[0_25px_50px_-12px_rgba(217,70,239,0.4)]
                         hover:border-[#e879f9]/60"
            >
              {/* Floating Icon */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 p-6 rounded-full shadow-lg overflow-hidden"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                }}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.heading}
                  width={50}
                  height={50}
                  className="drop-shadow-xl"
                />
                {/* Shimmer Light */}
                <motion.span
                  className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.8,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Card Title */}
              <h3
                className="text-white font-semibold text-2xl mt-12 mb-3 group-hover:text-[#f0abfc] transition-colors duration-300"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
              >
                {item.heading}
              </h3>

              {/* Card Description */}
              <p className="text-white/85 text-base font-normal leading-relaxed px-2">
                {item.subheading}
              </p>

              {/* Animated Divider */}
              <motion.div
                className="w-20 h-[3px] mx-auto mt-8 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.25 + 0.2 }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 🌌 Bottom subtle fade into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.8) 40%, ${colors.background.end} 100%)`,
        }}
      ></div>
    </section>
  );
}
