"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/constants/colors";
import { IoLogOutOutline, IoPencil } from "react-icons/io5";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function ProfilePageClient() {
  const { user, isAuthLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading) {
    return <Spinner message="Please wait..." />;
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0b0b0e 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(168,85,247,0.18),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-28 pb-24 space-y-14">
        {/* ========== PROFILE HERO ========== */}
        <ProfileHero user={user} />

        {/* ========== BASIC INFO PANEL ========== */}
        <BasicInfoPanel user={user} />

        {/* ========== WALLET SECTION ========== */}
        <WalletSection user={user} />

        {/* ========== ACTION ZONE ========== */}
        <ActionZone logout={logout} />
      </div>

      {/* Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-6 z-20 w-11 h-11 rounded-full 
             bg-black/40 backdrop-blur border border-white/15
             flex items-center justify-center
             text-white hover:bg-white/10 transition"
        aria-label="Go to Home"
      >
        <IoArrowBack className="w-6 h-6" />
      </button>
    </section>
  );
}

/* ======================================================
   PROFILE HERO – Editorial / Identity focused
====================================================== */

function ProfileHero({ user }: any) {
  return (
    <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#16161c] to-[#0f0f14] border border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(168,85,247,0.25),transparent_40%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 p-8 md:p-12 items-center">
        {/* Avatar */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden ring-4 ring-[#a855f7]/40 shadow-2xl">
            <Image
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=512&auto=format&fit=crop"
              }
              alt="User Avatar"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Identity */}
        <div className="text-center md:text-left">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            {user?.name}
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            {user?.email || user?.phone}
          </p>
          <p className="text-white/40 text-sm mt-3">
            Member since {new Date(user?.createdAt || "").toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   BASIC INFO – Clean data panel (not glass)
====================================================== */

function BasicInfoPanel({ user }: any) {
  return (
    <div className="rounded-2xl bg-[#0f0f14] border border-white/10">
      <div className="px-6 md:px-8 py-5 border-b border-white/10">
        <h2 className="text-white text-xl font-semibold">
          Basic Information
        </h2>
      </div>

      <div className="divide-y divide-white/10">
        <InfoRow label="Gender" value={user?.gender || "Not set"} />
        <InfoRow
          label="Date of Birth"
          value={
            user?.dateOfBirth
              ? new Date(user.dateOfBirth).toDateString()
              : "Not set"
          }
        />
        <InfoRow
          label="Languages"
          value={user?.languages?.join(", ") || "Not added"}
        />
        <InfoRow
          label="Verification"
          value={user?.isVerified ? "Verified" : "Not Verified"}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-6 md:px-8 py-4">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

/* ======================================================
   WALLET – Fintech style metrics
====================================================== */

function WalletSection({ user }: any) {
  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-5 px-1">
        Wallet
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <WalletMetric
          title="Main Balance"
          amount={user?.wallet?.main || 0}
          accent="from-[#22c55e] to-[#16a34a]"
        />
        <WalletMetric
          title="Bonus Balance"
          amount={user?.wallet?.bonus || 0}
          accent="from-[#f59e0b] to-[#d97706]"
        />
      </div>
    </div>
  );
}

function WalletMetric({
  title,
  amount,
  accent,
}: {
  title: string;
  amount: number;
  accent: string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0f0f14] border border-white/10">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-15`} />
      <div className="relative p-6">
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-white text-4xl font-bold mt-3">₹{amount}</p>
      </div>
    </div>
  );
}

/* ======================================================
   ACTION ZONE – Clearly separated & safe
====================================================== */

function ActionZone({ logout }: { logout: () => void }) {
  return (
    <div className="rounded-2xl bg-[#0b0b0e] border border-red-500/20 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={() => alert("Edit profile coming soon")}
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center gap-2 transition"
        >
          {/* <IoPencil className="w-5 h-5" /> */}
          Wallet
        </button>

        <button
          onClick={logout}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 transition"
        >
          <IoLogOutOutline className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
