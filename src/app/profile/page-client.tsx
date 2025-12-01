"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import { colors } from "@/constants/colors";
import { IoLogOutOutline, IoPencil } from "react-icons/io5";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";

export default function ProfilePageClient() {
    
    const { user, isAuthLoading, isAuthenticated, logout } = useAuth();

    const router = useRouter()
    // 🔐 Redirect NOT logged-in users away from this protected route
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.replace("/signin");
        }
    }, [isAuthLoading, isAuthenticated, router]);

    // 🔄 Show spinner while checking auth
    if (isAuthLoading) {
        return <Spinner message="Please wait..." />;
    }

  return (
    <section
      className="min-h-screen py-24 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* Floating glow layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[15%] w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative z-20 max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-white text-4xl font-extrabold text-center mb-14">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="rounded-3xl bg-[rgba(15,15,17,0.8)] backdrop-blur-xl border border-white/10 p-8 md:p-10 shadow-[0_24px_48px_rgba(0,0,0,0.45)]">
          
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-32 h-32 relative">
              <Image
                src={
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="User Avatar"
                fill
                className="rounded-full object-cover border border-white/20"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-white text-3xl font-bold">{user?.name}</h2>

              <p className="text-white/70 mt-2">
                {user?.email || user?.phone}
              </p>

              <p className="text-white/50 text-sm mt-1">
                Joined: {new Date(user?.createdAt || "").toDateString()}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-[1px] w-full bg-white/10" />

          {/* Extra Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InfoCard label="Gender" value={user?.gender || "Not set"} />
            <InfoCard
              label="Date of Birth"
              value={
                user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toDateString()
                  : "Not set"
              }
            />
            <InfoCard
              label="Languages"
              value={user?.languages?.join(", ") || "Not added"}
            />
            <InfoCard
              label="Status"
              value={user?.isVerified ? "Verified" : "Not Verified"}
            />
          </div>

          {/* Wallet */}
          <div className="mt-10 rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-white text-xl font-semibold mb-3">
              Wallet Balance
            </h3>
            <div className="flex gap-6">
              <WalletBox label="Main" amount={user?.wallet?.main || 0} />
              <WalletBox label="Bonus" amount={user?.wallet?.bonus || 0} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => alert("Edit profile coming soon")}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 transition"
            >
              <IoPencil className="w-5 h-5" />
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="px-6 py-3 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-2 transition"
            >
              <IoLogOutOutline className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------
   Sub Components
---------------------------------------------- */

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white mt-1 font-semibold">{value}</p>
    </div>
  );
}

function WalletBox({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex-1 rounded-xl bg-black/40 border border-white/10 p-5 text-center">
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-1">₹{amount}</p>
    </div>
  );
}
