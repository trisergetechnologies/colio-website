"use client";

/**
 * Wallet Page (Colio) — FINAL FIXED BACKGROUND VERSION
 *
 * ✅ Wallet Balance (unchanged — perfect as given)
 * ✅ Offers, Quick Recharge, Transaction History now have SAME
 *    glass gradient background style as Wallet Balance section
 * ✅ Uniform: bg-white/5 + backdrop-blur-xl + border-white/10 + rounded-3xl + p-8
 * ✅ Consistent glow/hover + spacing + gradient button look
 * ✅ Fully responsive and visually consistent with site
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { IoAdd, IoCardOutline, IoCashOutline, IoTimeOutline } from "react-icons/io5";
import { colors, gradientStyles } from "@/constants/colors";
import Header from "../components/layout/header";

const quickAmounts = [50, 100, 200, 300, 500, 1000];
const offers = [
  { id: 1, title: "Get ₹50 bonus on ₹500+", desc: "Limited time festive offer!" },
  { id: 2, title: "Flat 5% cashback on ₹1000 recharge", desc: "Instant wallet credit." },
  { id: 3, title: "Refer a friend & earn ₹100", desc: "Invite now and save more!" },
];

const transactions = [
  { id: 1, date: "2025-11-10", amount: 200, type: "credit" },
  { id: 2, date: "2025-11-09", amount: 100, type: "debit" },
  { id: 3, date: "2025-11-08", amount: 500, type: "credit" },
  { id: 4, date: "2025-11-07", amount: 300, type: "debit" },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(1200);
  const [selectedFilter, setSelectedFilter] = useState<"Today" | "Weekly" | "Monthly">("Today");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleRecharge = (amt: number) => {
    setSelectedAmount(amt);
    setBalance((b) => b + amt);
  };

  return (
    <div>
      <Header />
    <div
      id="wallet-page"
      className="relative overflow-hidden min-h-screen py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* Ambient gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative z-20 space-y-16 md:space-y-20">
        {/* 💰 Wallet Balance Section (unchanged) */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <div>
            <h2 className="text-4xl font-extrabold mb-2" style={gradientStyles.textGradient}>
              Wallet Balance
            </h2>
            <p className="text-white/80 text-lg font-semibold">₹{balance.toFixed(2)}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-full flex items-center gap-2 text-white font-semibold border border-white/20"
            style={{
              background: `linear-gradient(90deg, ${colors.button.start} 0%, ${colors.button.end} 100%)`,
              boxShadow: "0 10px 40px -10px rgba(217,70,239,0.4)",
            }}
          >
            <IoAdd className="w-5 h-5" /> Add Money
          </motion.button>
        </motion.section>

        {/* 🎁 Offers Section — now same glass gradient container */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <h3 className="text-2xl font-bold mb-6 text-white">Recharge Offers</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 40px -12px rgba(217,70,239,0.35)",
                }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-6 hover:border-[#e879f9]/50 transition-all duration-300"
              >
                <h4 className="text-white text-lg font-semibold mb-2">
                  {offer.title}
                </h4>
                <p className="text-white/70 text-sm">{offer.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ⚡ Quick Recharge Section — same glass gradient bg */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <h3 className="text-2xl font-bold mb-6 text-white">Quick Recharge</h3>
          <div className="flex flex-wrap gap-4">
            {quickAmounts.map((amt) => (
              <motion.button
                key={amt}
                onClick={() => handleRecharge(amt)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-3 rounded-full border border-white/10 text-white font-medium transition-all duration-300 ${
                  selectedAmount === amt
                    ? "bg-gradient-to-r from-[rgba(217,70,239,0.9)] to-[rgba(162,28,175,0.9)] shadow-[0_10px_40px_-10px_rgba(217,70,239,0.4)]"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                ₹{amt}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* 📜 Transaction History Section — same glass gradient bg */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-bold text-white">Transaction History</h3>

            {/* Tabs */}
            <div className="flex gap-3 bg-white/5 border border-white/10 rounded-full px-2 py-1 backdrop-blur-md">
              {["Today", "Weekly", "Monthly"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedFilter === tab
                      ? "bg-gradient-to-r from-[rgba(217,70,239,0.8)] to-[rgba(162,28,175,0.8)] text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction list */}
          <div className="space-y-4">
            {transactions.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg hover:border-[#e879f9]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  {t.type === "credit" ? (
                    <IoCardOutline className="w-6 h-6 text-green-400" />
                  ) : (
                    <IoCashOutline className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">
                      {t.type === "credit" ? "Recharge Successful" : "Payment Sent"}
                    </p>
                    <p className="text-white/60 text-sm flex items-center gap-1">
                      <IoTimeOutline className="w-3.5 h-3.5" /> {t.date}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-lg font-semibold ${
                    t.type === "credit" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {t.type === "credit" ? "+" : "-"}₹{t.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
    </div>
  );
}
