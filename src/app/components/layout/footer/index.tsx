"use client";

import { Footerlinkdata, Sociallinkdata } from "@/lib/data/pageData";
import { getImagePath } from "@/lib/utils/imagePath";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { colors } from "@/constants/colors";

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colors.background.start} 0%, ${colors.background.end} 90%)`,
      }}
    >
      {/* ✨ Soft Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-10%] top-[-10%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float-slow"></div>
        <div className="absolute right-[-15%] bottom-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(147,51,234,0.25),transparent_80%)] blur-3xl animate-pulse-slow"></div>
      </div>

      {/* 🌈 Main Footer */}
      <div className="relative container mx-auto px-6 md:px-8 lg:px-10 pt-20 pb-14 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-10 xl:gap-x-16">
          {/* --- Left / Logo --- */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <h2 style={{ fontWeight: 100 }}>C O L I O</h2>
            </div>

            <p className="text-white/80 text-sm leading-relaxed max-w-[420px] mb-8">
              Colio is a social communication platform designed for meaningful and respectful conversations.
              Users can interact through text, voice, and video communication features in a moderated and secure environment.
              The platform is intended for general social interaction and communication support, with strict community guidelines in place.
              <br />
              <span className="text-white/80">
                Secure. Reliable. Community-focused.
              </span>
            </p>

            <div className="flex gap-4 mt-4">
              {Sociallinkdata.map((item, i) => (
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.97 }}
                  key={i}
                >
                  <Link href={item.href || "#!"} target="_blank">
                    <Image
                      src={item.imgsrc}
                      alt={item.label || "social-icon"}
                      width={32}
                      height={32}
                      className="opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- Useful Links --- */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-xl font-semibold mb-6">
              Explore
            </h3>
            <ul className="space-y-4">
              {Footerlinkdata.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --- Contact --- */}
          <div className="lg:col-span-4">
            <h3 className="text-white text-xl font-semibold mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-5">
              <li>
                <Link
                  href="tel:+918368354151"
                  className="flex items-center gap-2 text-white/70 hover:text-primary text-sm transition-colors"
                >
                  <Image
                    src={getImagePath("/images/footer/number.svg")}
                    alt="phone"
                    width={20}
                    height={20}
                  />
                  +91 8368354151
                </Link>
              </li>

              <li>
                <Link
                  href="mailto:management@colio.in"
                  className="flex items-center gap-2 text-white/70 hover:text-primary text-sm transition-colors"
                >
                  <Image
                    src={getImagePath("/images/footer/email.svg")}
                    alt="email"
                    width={20}
                    height={20}
                  />
                  management@colio.in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="relative border-t border-white/10 py-6 px-4 text-center z-10">
        <p className="text-white/70 text-sm">
          © {new Date().getFullYear()} Colio Tech Private Limited | All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
