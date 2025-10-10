"use client";

import { Headerdata } from "@/lib/data/pageData";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import HeaderLink from "./navigation/HeaderLink";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/constants/colors";
import Image from "next/image";
import { getImagePath } from "@/lib/utils/imagePath";

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => setSticky(window.scrollY >= 20);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(e.target as Node)
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  return (
    <>
      {/* HEADER ITSELF */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          sticky
            ? "backdrop-blur-xl bg-[#0f0f11]/80 shadow-[0_8px_25px_-8px_rgba(217,70,239,0.25)] py-4"
            : "py-6"
        }`}
      >
        <div className="container flex items-center justify-between">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex grow items-center justify-center gap-10">
            {Headerdata.map((item, i) => (
              <HeaderLink key={i} item={item} />
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="#contact"
              className="hidden lg:flex items-center gap-2 text-white font-medium px-6 py-3 rounded-lg transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
              }}
            >
              <Icon icon="ic:round-download" className="text-2xl" />
              Get the App
            </Link>

            <button
              onClick={() => setNavbarOpen(true)}
              className="block lg:hidden p-2 rounded-md hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white mb-1"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE MENU (INDEPENDENT LAYER) --- */}
      <AnimatePresence>
        {navbarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[99]"
              onClick={() => setNavbarOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 w-full max-w-sm h-full z-[100] flex flex-col justify-between p-8 
                         bg-[#0a0a0c] shadow-[0_0_60px_-10px_rgba(217,70,239,0.6)]"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <Logo />
                  <button
                    onClick={() => setNavbarOpen(false)}
                    className="text-white/70 hover:text-white"
                  >
                    <Icon icon="tabler:x" className="text-2xl" />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-6 text-white text-lg">
                  {Headerdata.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setNavbarOpen(false)}
                      className="hover:text-[#f0abfc] transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* CTA */}
                <div className="flex flex-col gap-4 mt-10">
                  <Link
                    href="#contact"
                    onClick={() => setNavbarOpen(false)}
                    className="w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                    }}
                  >
                    <Icon icon="ic:round-download" className="text-2xl" />
                    Get the App
                  </Link>
                </div>
              </div>

              {/* Store badges */}
              <div className="mt-10 flex justify-center gap-6 pb-4 flex-wrap">
                {/* Google Play */}
                <motion.a
                  href="#"
                  whileHover={{
                    y: -4,
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(217,70,239,0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md
               transition-all duration-300 hover:border-[#f0abfc]/50 hover:bg-white/10"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#34A853,#FBBC05,#EA4335,#4285F4)]">
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <path d="M4 4L32 24 4 44V4Z" fill="#34A853" />
                      <path d="M32 24L4 44L36 36L32 24Z" fill="#FBBC05" />
                      <path d="M32 24L36 36L44 32L32 24Z" fill="#EA4335" />
                      <path d="M32 24L44 16L36 12L32 24Z" fill="#4285F4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 uppercase tracking-widest leading-none">
                      Get it on
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">Google Play</p>
                  </div>
                </motion.a>

                {/* App Store */}
                <motion.a
                  href="#"
                  whileHover={{
                    y: -4,
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(147,51,234,0.5)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md
               transition-all duration-300 hover:border-[#c084fc]/50 hover:bg-white/10"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[linear-gradient(145deg,#007aff,#0a84ff)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 512 512"
                      fill="white"
                      aria-hidden
                    >
                      <path d="M255.7,32C132.3,32,32,132.3,32,255.7c0,123.4,100.3,223.7,223.7,223.7S479.4,379.1,479.4,255.7  C479.4,132.3,379.1,32,255.7,32z M385.5,342.2h-76.2l-18.9-33h-68.4l-18.9,33h-76.2l86.4-149.7l-29.4-50.9h48l15.3,26.4l15.3-26.4h48  l-29.4,50.9L385.5,342.2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-white/70 uppercase tracking-widest leading-none">
                      Download on the
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">App Store</p>
                  </div>
                </motion.a>
              </div>

              {/* Glowing edge line */}
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#e879f9] via-[#a855f7] to-transparent rounded-r-full animate-pulse-slow" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
