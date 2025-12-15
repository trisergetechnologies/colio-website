"use client";

import { colors } from "@/constants/colors";
import { Headerdata } from "@/lib/data/pageData";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "./logo";
import HeaderLink from "./navigation/HeaderLink";
import { dancingScript } from "@/app/layout";

import {
  IoLogIn,
  IoLogoBitcoin,
  IoPersonCircle,
} from "react-icons/io5";

import { useAuth } from "@/context/AuthContext";
import WalletPopover from "../../shared/wallet/WalletPopover";

export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  // 🔹 Wallet popover state
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // 🔹 Anchor ref (desktop wallet button)
  const walletBtnRef = useRef<HTMLAnchorElement>(null);

  // 🔹 Popover ref (outside click handling)
  const walletPopoverRef = useRef<HTMLDivElement>(null);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const walletBalance = 140;

  const handleScroll = () => setSticky(window.scrollY >= 20);

  // 🔹 Close wallet popover on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        walletPopoverRef.current &&
        !walletPopoverRef.current.contains(e.target as Node) &&
        walletBtnRef.current &&
        !walletBtnRef.current.contains(e.target as Node)
      ) {
        setIsWalletOpen(false);
      }
    }

    if (isWalletOpen) {
      document.addEventListener("mousedown", handleOutside);
    }

    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isWalletOpen]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navbarOpen ? "hidden" : "";
  }, [navbarOpen]);

  return (
    <>
      {/* ================= HEADER ================= */}
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
          {/* <Logo /> */}
          <span
            className={`
        ${dancingScript.className}
        text-4xl
        font-bold
        text-white
        tracking-wide
        select-none
      `}
          >
            Colio
          </span>

          {/* -------- Desktop Navigation -------- */}
          <nav className="hidden lg:flex grow items-center justify-center gap-10">
            {Headerdata.map((item, i) => (
              <HeaderLink key={i} item={item} />
            ))}
          </nav>

          {/* -------- Right Controls -------- */}
          <div className="flex items-center gap-3">
            {/* MOBILE / TABLET WALLET */}
            {isAuthenticated && (
              <button
                onClick={() => setIsWalletOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2
                           rounded-[16px] border border-white/20
                           bg-white/10 backdrop-blur-md
                           text-white font-semibold
                           hover:bg-white/20 transition"
              >
                <IoLogoBitcoin className="text-lg text-[#f0abfc]" />
                <span className="text-sm">{walletBalance}</span>
              </button>
            )}

            {/* DESKTOP WALLET */}
            {isAuthenticated && (
              <a
                ref={walletBtnRef}
                onClick={(e) => {
                  e.preventDefault();
                  setIsWalletOpen((p) => !p);
                }}
                className="hidden lg:flex cursor-pointer items-center gap-2 px-5 py-3
                           rounded-[16px] border border-white/20
                           bg-white/10 backdrop-blur-md
                           text-white font-semibold
                           hover:bg-white/20 transition-all hover:scale-105"
              >
                <IoLogoBitcoin className="text-xl text-[#f0abfc]" />
                <span className="text-sm">₹{walletBalance}</span>
              </a>
            )}

            {/* ACCOUNT (DESKTOP) */}
            <Link
              href={isAuthenticated ? "../profile" : "../signin"}
              className="hidden lg:flex items-center gap-2 px-5 py-3
                         rounded-[16px] border border-white/20
                         bg-white/10 backdrop-blur-md
                         text-white font-semibold
                         hover:bg-white/20 transition-all hover:scale-105"
            >
              {isAuthenticated ? (
                <IoPersonCircle className="text-xl text-[#f0abfc]" />
              ) : (
                <IoLogIn className="text-xl text-[#f0abfc]" />
              )}
              {isAuthenticated ? "Account" : "Sign In"}
            </Link>

            {/* MENU TOGGLE */}
            <button
              onClick={() => setNavbarOpen(true)}
              className="block lg:hidden p-2 rounded-md hover:bg-white/10"
            >
              <span className="block w-6 h-0.5 bg-white mb-1" />
              <span className="block w-6 h-0.5 bg-white mb-1" />
              <span className="block w-6 h-0.5 bg-white" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ================= DESKTOP WALLET POPOVER (FIXED, NO BLUR) ================= */}
      <AnimatePresence>
        {isWalletOpen && (
          <motion.div
            ref={walletPopoverRef}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            /* 🔹 IMPORTANT FIXES */
            className="
        hidden lg:block
        fixed z-[120]
        w-[420px] xl:w-[520px]
      "
            style={{
              top: "80px", // below header
              right: "max(1rem, calc((100vw - 1280px) / 2))",
            }}
          >
            <WalletPopover onClose={() => setIsWalletOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE / TABLET WALLET MODAL ================= */}
      <AnimatePresence>
        {isWalletOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
              onClick={() => setIsWalletOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-x-4 top-[15%] z-[100] lg:hidden"
            >
              <WalletPopover onClose={() => setIsWalletOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {navbarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[99]"
              onClick={() => setNavbarOpen(false)}
            />

            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 w-full max-w-sm h-full z-[100]
                         flex flex-col justify-between p-8
                         bg-[#0a0a0c]
                         shadow-[0_0_60px_-10px_rgba(217,70,239,0.6)]"
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

                <nav className="flex flex-col gap-6 text-white text-lg">
                  <Link href="/" onClick={() => setNavbarOpen(false)}>
                    Home
                  </Link>
                  <Link href="/#work" onClick={() => setNavbarOpen(false)}>
                    How it works
                  </Link>
                  <Link href="/#features" onClick={() => setNavbarOpen(false)}>
                    Features
                  </Link>
                  <Link href="/profile" onClick={() => setNavbarOpen(false)}>
                    Account
                  </Link>
                </nav>
              </div>

              <div
                className="absolute left-0 top-0 h-full w-[3px]
                              bg-gradient-to-b from-[#e879f9]
                              via-[#a855f7] to-transparent
                              rounded-r-full animate-pulse-slow"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
