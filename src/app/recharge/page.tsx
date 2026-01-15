'use client';

import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Coins, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { load }: { load: any } = require("@cashfreepayments/cashfree-js");

const API_BASE_URL = "https://api.colio.in/api";

type WalletData = {
  main: number;
  bonus: number;
  total: number;
};

export default function RechargePage() {
  const router = useRouter();
  
  // State
  const [balance, setBalance] = useState<number>(0);
  const [walletDetails, setWalletDetails] = useState<WalletData | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- UPDATED: Get amount from Session Storage ---
  useEffect(() => {
    // Check session storage first (Clean URL method)
    const storedAmount = sessionStorage.getItem('rechargeAmount');
    
    if (storedAmount) {
      setRechargeAmount(storedAmount);
      // Optional: Clear it so it doesn't stick around if they leave and come back
      sessionStorage.removeItem('rechargeAmount');
    }
  }, []);

  // Fetch Wallet Balance
  const fetchWallet = async () => {
    try {
      setIsLoading(true);
      const token = getToken(); 
      
      if (!token) {
        router.push("/login");
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/user/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success && data.data?.wallet) {
        setWalletDetails(data.data.wallet);
        setBalance(data.data.wallet.total || 0);
      }
    } catch (err) {
      console.error("Fetch wallet error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // Handle Recharge Submit
const handleRecharge = async () => {
  try {
    setIsProcessing(true);

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
    fetchWallet();

  } catch (err) {
    setError("Payment initiation failed");
  } finally {
    setIsProcessing(false);
  }
};

  // Quick Amount Pills
  const quickAmounts = [100, 400, 4000, 20000];

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center pt-8 pb-20 px-4">
      
      {/* Navbar */}
      <div className="w-full max-w-lg flex items-center mb-8">
        <button 
          onClick={() => router.back()} 
          className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="text-white w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white ml-4">Recharge Wallet</h1>
      </div>

      <div className="w-full max-w-lg space-y-6">
        
        {/* Balance Card */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-900 border border-white/10 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Coins size={100} />
            </div>
            
            <p className="text-white/70 text-sm font-medium">Coins Available</p>
            <div className="flex items-end gap-2 mt-1">
                <Coins className="text-yellow-400 w-8 h-8 mb-1" />
                <h2 className="text-4xl font-bold text-white">
                    {isLoading ? "..." : balance}
                </h2>
            </div>
        </motion.div>

        {/* Input Section */}
        <div className="bg-[#18181b] border border-white/5 rounded-3xl p-6">
            <label className="text-sm text-gray-400 block mb-3">Amount (₹)</label>
            
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
                <input 
                    type="number"
                    disabled={true}
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    placeholder="Select Amount"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white text-lg focus:outline-none focus:border-pink-500 transition-colors"
                />
            </div>

            {/* Quick Pills */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {quickAmounts.map(amt => (
                    <button
                        key={amt}
                        onClick={() => setRechargeAmount(String(amt))}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            rechargeAmount === String(amt)
                             ? "bg-pink-600 border-pink-500 text-white"
                             : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                    >
                        + ₹{amt}
                    </button>
                ))}
            </div>

            {/* Error / Success Messages */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
            )}
            
            {successMsg && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm text-center">{successMsg}</p>
                </div>
            )}
        </div>

        {/* Payment Button */}
        <button
            onClick={handleRecharge}
            disabled={isProcessing || isLoading}
            className={`
                w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${isProcessing 
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-pink-500/25"
                }
            `}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Processing...
                </>
            ) : (
                <>
                    <CreditCard className="w-5 h-5" />
                    Recharge Now
                </>
            )}
        </button>

        <p className="text-center text-xs text-gray-500">
            By proceeding, you agree to our Terms of Service.
        </p>

      </div>
    </div>
  );
}