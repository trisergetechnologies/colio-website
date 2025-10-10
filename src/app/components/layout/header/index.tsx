"use client";

import { Headerdata } from "@/lib/data/pageData";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import HeaderLink from "./navigation/HeaderLink";
import MobileHeaderLink from "./navigation/MobileHeaderLink";
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
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node))
      setNavbarOpen(false);
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
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex grow items-center justify-center gap-10">
          {Headerdata.map((item, i) => (
            <HeaderLink key={i} item={item} />
          ))}
        </nav>

        {/* CTA Button */}
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="block lg:hidden p-2 rounded-md hover:bg-white/10"
            aria-label="Toggle mobile menu"
          >
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white mb-1"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {navbarOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-full max-w-sm h-full bg-[#1a1a1d]/95 backdrop-blur-md z-50 flex flex-col justify-between p-8"
          >
            <div>
              <div className="flex justify-between items-center mb-8">
                <Logo />
                <button
                  onClick={() => setNavbarOpen(false)}
                  className="text-white/70 hover:text-white"
                  aria-label="Close mobile menu"
                >
                  <Icon icon="tabler:x" className="text-2xl" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-white text-lg">
                {Headerdata.map((item, index) => (
                  <MobileHeaderLink key={index} item={item} />
                ))}
              </nav>

              {/* Mobile CTA */}
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

            {/* Mobile App Download Badges */}
            <div className="mt-10 flex justify-center gap-6 pb-4">
              <Image
                src={getImagePath("/images/trade/appstore.svg")}
                alt="App Store"
                width={130}
                height={40}
              />
              <Image
                src={getImagePath("/images/trade/android.svg")}
                alt="Play Store"
                width={130}
                height={40}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay background */}
      {navbarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
      )}
    </motion.header>
  );
}
