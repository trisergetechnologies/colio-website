'use client';

import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
const { load }: { load: any } = require("@cashfreepayments/cashfree-js");

const API_BASE_URL = "https://api.colio.in/api";

type WalletPopoverProps = {
  onClose?: () => void;
};

// Defined packs
const coinPacks = [
  { id: 1, coins: 40, originalPrice: 60, price: 50, discountLabel: "20% OFF", highlight: true },
  { id: 3, coins: 160, originalPrice: 240, price: 200, discountLabel: "20% OFF", highlight: true },
  { id: 4, coins: 320, originalPrice: 480, price: 400, discountLabel: "20% OFF", highlight: true },
  { id: 6, coins: 3200, originalPrice: 4800, price: 4000, discountLabel: "20% OFF", highlight: true },
  { id: 2, coins: 80, originalPrice: 120, price: 100, discountLabel: "20% OFF", highlight: false },
  { id: 5, coins: 800, originalPrice: 1200, price: 1000, discountLabel: "20% OFF", highlight: false },
  { id: 7, coins: 8000, originalPrice: 12000, price: 10000, discountLabel: "20% OFF", highlight: false },
  { id: 8, coins: 16000, originalPrice: 24000, price: 20000, discountLabel: "20% OFF", highlight: false },
];

export default function WalletPopover({ onClose }: WalletPopoverProps) {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const walletCoins = (user?.wallet?.main ?? 0) + (user?.wallet?.bonus ?? 0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

// inside WalletPopover function

  const handlePackClick = (amount: number) => {
    
    
    // 2. Save amount to Session Storage (Invisible to user)
    sessionStorage.setItem('rechargeAmount', amount.toString());
    
    // 3. Navigate to the clean URL (No ?amount= visible)
    router.push('/recharge'); 
  };

  const handleRecharge = async (rechargeAmount: number) => {
    try {
      setIsProcessing(true);
      // 1. Close the popover
      if (onClose) onClose();

      const token = getToken();
      const { data } = await axios.post(
        `${API_BASE_URL}/user/rechargewallet`,
        { amount: Number(rechargeAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cashfree = await load({ mode: "production" });

      cashfree.checkout({
        paymentSessionId: data.data.paymentSessionId,
        redirectTarget: "_modal",
      });
    } catch (err) {
      setError("Payment initiation failed");
    } finally {
      setIsProcessing(false);
      refreshUser();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="
        w-full max-w-md lg:max-w-xl xl:max-w-2xl
        rounded-3xl border border-white/10
        bg-[#0f0f11]/90 backdrop-blur-2xl
        shadow-[0_30px_80px_-25px_rgba(217,70,239,0.45)]
        overflow-hidden mt-2
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div>
          <h3 className="text-lg font-semibold text-white">Coin Store</h3>
          <p className="text-sm text-white/60">
            My Coins:{" "}
            <span className="text-[#f0abfc] font-medium">{walletCoins}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <IoClose className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Scroll Area */}
      <div className="wallet-scroll px-4 py-4 space-y-3 max-h-[420px] overflow-y-auto">
        {coinPacks.map((pack) => (
          <motion.button
            key={pack.id}
            disabled={isProcessing}
            onClick={() => handleRecharge(pack.price)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative w-full flex items-center justify-between
              gap-4 px-4 py-4 rounded-2xl border
              ${
                pack.highlight
                  ? "border-[#f0abfc]/40 bg-gradient-to-r from-[#2a0a1f] to-[#3b0a2b]"
                  : "border-white/10 bg-white/5"
              }
              backdrop-blur-xl transition-all
            `}
          >
            {pack.discountLabel && (
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2
                text-[10px] font-semibold px-3 py-1 rounded-full bg-[#fde047] text-black"
              >
                {pack.discountLabel}
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <Coins size={18} color="#EAB308" strokeWidth={2.2} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">{pack.coins}</p>
                <p className="text-white/60 text-xs">Coins</p>
              </div>
            </div>

            <div className="text-right">
              {pack.originalPrice !== pack.price && (
                <p className="text-xs text-white/40 line-through">
                  ₹{pack.originalPrice}
                </p>
              )}
              <p
                className={`font-semibold ${
                  pack.highlight ? "text-[#fde047]" : "text-white"
                }`}
              >
                ₹{pack.price}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-white/10 text-center">
        {/* <button onClick={() => router.push('/recharge')} className="text-sm text-white/70 hover:text-white underline decoration-white/30 underline-offset-4">
          Custom Recharge / Payment History
        </button> */}
      </div>
    </motion.div>
  );
}