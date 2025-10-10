"use client";

import { Featuresdata } from "@/lib/data/pageData";
import Image from "next/image";
import { motion } from "framer-motion";
import { colors, gradientStyles } from "@/constants/colors";

export default function Features() {
  return (
    <section
      id="features-section"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* 🌌 Floating Gradient Layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Smooth top fade blending from previous section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 55%, ${colors.background.end} 100%)`,
        }}
      ></div>

      <div className="container relative z-20">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p
            className="text-base sm:text-lg font-semibold mb-4 tracking-wide"
            style={{ color: colors.accent[400], letterSpacing: "2px" }}
          >
            FEATURES
          </p>

          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-center mx-auto max-w-3xl"
            style={gradientStyles.textGradient}
          >
            Designed to Keep Every Connection Real and Secure
          </h2>

          <p className="text-white/85 max-w-2xl mx-auto md:text-lg leading-relaxed font-medium">
            Every feature in Colio is built around *trust*, *privacy*, and *authenticity*.  
            Meet, chat, and connect — knowing your time and emotions are valued.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {Featuresdata.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.95 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
                },
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
                boxShadow: `0 25px 45px -12px rgba(217,70,239,0.4)`,
              }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col gap-5 text-left transition-all duration-300 hover:border-[#e879f9]/50 group"
            >
              {/* Floating Icon */}
              <motion.div
                className="rounded-full w-fit p-5 flex items-center justify-center shadow-md relative"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                }}
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.heading}
                  width={58}
                  height={58}
                  className="drop-shadow-xl"
                />

                {/* Light shimmer effect */}
                <motion.span
                  className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>

              {/* Title */}
              <h5
                className="text-white font-semibold text-xl mt-3 mb-2 group-hover:text-[#f0abfc] transition-colors duration-300"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {item.heading}
              </h5>

              {/* Description */}
              <p className="text-white/80 text-base leading-relaxed">
                {item.subheading}
              </p>

              {/* Gradient divider */}
              <motion.div
                className="w-16 h-[3px] mt-5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: i * 0.2 + 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade Transition */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.9) 40%, ${colors.background.end} 100%)`,
        }}
      ></div>
    </section>
  );
}
