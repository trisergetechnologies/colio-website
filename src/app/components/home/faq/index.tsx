"use client";

import { Faqdata } from "@/lib/data/pageData";
import { getImagePath } from "@/lib/utils/imagePath";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { colors } from "@/constants/colors";

export default function Faq() {
  return (
    <section
      id="faq-section"
      className="relative overflow-hidden py-24 md:py-28"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:100%_56px] opacity-20" />

      <div className="container relative z-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf] bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 lg:text-lg font-normal max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about how Colio works — privacy, security,
            payments, and safe conversations on our platform.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid lg:grid-cols-2 gap-14 items-center relative">
          {/* Left: Accordion */}
          <div className="w-full">
            {Faqdata?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="w-full mb-4 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 overflow-hidden"
              >
                <Disclosure>
                  {({ open }) => (
                    <div>
                      <DisclosureButton
                        className="flex justify-between items-center w-full text-left px-6 py-5 md:py-5 transition-all duration-200 hover:bg-white/[0.02]"
                      >
                        <span
                          className={`text-lg md:text-xl font-semibold ${
                            open ? "text-[#f5d0fe]" : "text-white/85"
                          }`}
                        >
                          {item.heading}
                        </span>
                        <motion.div
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon
                            icon="tabler:chevron-down"
                            className={`text-3xl ${
                              open ? "text-[#f5d0fe]" : "text-white/45"
                            }`}
                          />
                        </motion.div>
                      </DisclosureButton>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                          >
                            <DisclosurePanel
                              className="px-6 pb-6 pt-2 text-white/70 leading-relaxed text-base md:text-lg border-t border-white/10"
                            >
                              {item.subheading}
                            </DisclosurePanel>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </Disclosure>
              </motion.div>
            ))}
          </div>

          {/* Right: Illustration */}
          <motion.div
            className="hidden lg:flex justify-center relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src={getImagePath("/images/faq/faq.svg")}
                alt="Colio FAQ support illustration"
                width={700}
                height={400}
                className="drop-shadow-[0_0_16px_rgba(217,70,239,0.25)]"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(217,70,239,0.14),transparent_70%)] blur-2xl rounded-full"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 🌫 Smooth bottom fade to Contact section */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px] pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, rgba(15,15,17,0) 0%, rgba(15,15,17,0.85) 60%, ${colors.background.end} 100%)`,
        }}
      />
    </section>
  );
}
