"use client";

import React from "next/link";
import { motion } from "framer-motion";

// --- Feature Data ---
const FEATURES = [
  {
    id: 1,
    title: "Verified Profiles",
    desc: "No bots. No fakes. Every user is verified for authentic connections.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    id: 2,
    title: "HD Video Calls",
    desc: "Experience crystal clear, low-latency video designed for intimacy.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Private & Secure",
    desc: "Your privacy is our priority. End-to-end encryption on every call.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    color: "from-emerald-400 to-teal-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-6 bg-[#0f0f11] overflow-hidden">
      
      {/* --- Background Ambient Glow --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-violet-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Colio Standard</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Built for those who value quality, speed, and discretion.
          </motion.p>
        </div>

        {/* --- Grid Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:to-white/10 transition-colors duration-500"
            >
              {/* Card Inner Content */}
              <div className="relative h-full bg-[#131316] rounded-[22px] p-8 overflow-hidden">
                
                {/* Hover Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>

                {/* Decorative Bottom Line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}