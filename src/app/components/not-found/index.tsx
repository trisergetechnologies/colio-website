"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getImagePath } from "@/lib/utils/imagePath";
import { colors } from "@/constants/colors";

const NotFound = () => {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${colors.background.start} 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* ✨ Ambient glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-float"></div>
      </div>

      {/* 🌈 Content */}
      <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Image
            src={getImagePath("/images/404.svg")}
            alt="404 Illustration"
            width={420}
            height={320}
            className="max-w-[340px] md:max-w-[400px] w-full"
            priority
          />
        </motion.div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf]
                       text-6xl md:text-7xl font-extrabold mb-6 drop-shadow-[0_4px_25px_rgba(217,70,239,0.3)]"
          >
            404
          </motion.h1>

          <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4">
            We Can’t Find That Page
          </h3>
          <p className="text-white/70 text-base md:text-lg mb-8 max-w-md leading-relaxed mx-auto md:mx-0">
            Oops! The page you’re looking for doesn’t exist or may have been
            moved. Let’s get you back to something that works.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-[#d946ef] to-[#a21caf]
                         text-white font-semibold px-8 py-3 rounded-full
                         shadow-[0_0_20px_-5px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_-3px_rgba(217,70,239,0.7)]
                         transition-all duration-300"
            >
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
