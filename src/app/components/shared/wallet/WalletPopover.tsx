'use client';

import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { Coins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type WalletPopoverProps = {
  onClose?: () => void;
};

// Defined packs
const coinPacks = [
  { id: 1, coins: 150, originalPrice: 230, price: 200, discountLabel: "10% OFF", highlight: true },
  { id: 2, coins: 330, originalPrice: 500, price: 270, discountLabel: "50% OFF", highlight: true },
  { id: 3, coins: 230, originalPrice: 353, price: 353 },
  { id: 4, coins: 470, originalPrice: 837, price: 709 },
  { id: 5, coins: 920, originalPrice: 1704, price: 1363 },
  { id: 6, coins: 2300, originalPrice: 4566, price: 3407 },
  { id: 7, coins: 4800, originalPrice: 10042, price: 7022 },
  { id: 8, coins: 14100, originalPrice: 29709, price: 19291 },
];

export default function WalletPopover({ onClose }: WalletPopoverProps) {
  const { user } = useAuth();
  const router = useRouter();

  const walletCoins = (user?.wallet?.main ?? 0) + (user?.wallet?.bonus ?? 0);

// inside WalletPopover function

  const handlePackClick = (amount: number) => {
    // 1. Close the popover
    if (onClose) onClose();
    
    // 2. Save amount to Session Storage (Invisible to user)
    sessionStorage.setItem('rechargeAmount', amount.toString());
    
    // 3. Navigate to the clean URL (No ?amount= visible)
    router.push('/recharge'); 
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
            My Coins: <span className="text-[#f0abfc] font-medium">{walletCoins}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <IoClose className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Scroll Area */}
      <div className="wallet-scroll px-4 py-4 space-y-3 max-h-[420px] overflow-y-auto">
        {coinPacks.map((pack) => (
          <motion.button
            key={pack.id}
            onClick={() => handlePackClick(pack.price)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative w-full flex items-center justify-between
              gap-4 px-4 py-4 rounded-2xl border
              ${pack.highlight
                ? "border-[#f0abfc]/40 bg-gradient-to-r from-[#2a0a1f] to-[#3b0a2b]"
                : "border-white/10 bg-white/5"
              }
              backdrop-blur-xl transition-all
            `}
          >
            {pack.discountLabel && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2
                text-[10px] font-semibold px-3 py-1 rounded-full bg-[#fde047] text-black">
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
                <p className="text-xs text-white/40 line-through">₹{pack.originalPrice}</p>
              )}
              <p className={`font-semibold ${pack.highlight ? "text-[#fde047]" : "text-white"}`}>
                ₹{pack.price}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-white/10 text-center">
        <button onClick={() => router.push('/recharge')} className="text-sm text-white/70 hover:text-white underline decoration-white/30 underline-offset-4">
          Custom Recharge / Payment History
        </button>
      </div>
    </motion.div>
  );
}