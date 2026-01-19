"use client";

import { dancingScript } from "@/app/layout";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/utils/tokenHelper";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  IoArrowBack,
  IoCheckmark,
  IoLogOutOutline,
  IoPencil,
} from "react-icons/io5";
import Spinner from "../components/Spinner";

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

      {/* Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-6 left-4 z-20 w-11 h-11 rounded-full 
        bg-black/40 backdrop-blur border border-white/15
        flex items-center justify-center
        text-white hover:bg-white/10 transition"
      >
        <IoArrowBack className="w-6 h-6" />
      </button>

      <button
        onClick={() => router.push("/")}
        className={`${dancingScript.className} fixed top-6 left-24 z-20
        text-white text-4xl`}
      >
        Colio
      </button>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-28 pb-24 space-y-14">
        <ProfileHero user={user} />
        <BasicInfoPanel user={user} />
        <WalletSection user={user} />
        <BlockedUsersSection />
        <RechargeHistorySection />
        <ActionZone logout={logout} />
      </div>
    </section>
  );
}

/* ======================================================
   PROFILE HERO
====================================================== */

function ProfileHero({ user }: any) {
  return (
    <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#16161c] to-[#0f0f14] border border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(168,85,247,0.25),transparent_40%)]" />

      <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 p-8 md:p-12 items-center">
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

        <div className="text-center md:text-left">
          <h1 className="text-white text-4xl font-bold">{user?.name}</h1>
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
   BASIC INFO – Editable
====================================================== */

function BasicInfoPanel({ user }: any) {
  const [isEditing, setIsEditing] = useState(false);

  const [dob, setDob] = useState(
    user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
      : ""
  );

  const [languages, setLanguages] = useState<string[]>(
    Array.isArray(user?.languages) ? user.languages.slice(0, 3) : []
  );

  const updateLanguage = (i: number, value: string) => {
    const copy = [...languages];
    copy[i] = value;
    setLanguages(copy);
  };

  const addLanguage = () => {
    if (languages.length < 3) setLanguages([...languages, ""]);
  };

  const saveChanges = () => {
    console.log("DOB:", dob);
    console.log("Languages:", languages.filter(Boolean));
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl bg-[#0f0f14] border border-white/10">
      <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-white/10">
        <h2 className="text-white text-xl font-semibold">
          Basic Information
        </h2>

        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            <IoPencil className="text-white/70 w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={saveChanges}
            className="flex items-center gap-1 text-green-400"
          >
            <IoCheckmark />
            Save
          </button>
        )}
      </div>

      <div className="divide-y divide-white/10">
        <InfoRow label="Gender">
          {user?.gender || "Not set"}
        </InfoRow>

        <InfoRow label="Date of Birth">
          {!isEditing ? (
            dob ? new Date(dob).toDateString() : "Not set"
          ) : (
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-black/30 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
            />
          )}
        </InfoRow>

        <InfoRow label="Languages">
          {!isEditing ? (
            languages.length ? languages.join(", ") : "Not added"
          ) : (
            <div className="flex flex-col gap-2 items-end">
              {languages.map((lang, i) => (
                <input
                  key={i}
                  value={lang}
                  onChange={(e) => updateLanguage(i, e.target.value)}
                  className="bg-black/30 border border-white/20 rounded-lg px-3 py-1 text-white text-sm w-44"
                />
              ))}
              {languages.length < 3 && (
                <button
                  onClick={addLanguage}
                  className="text-xs text-purple-400"
                >
                  + Add language
                </button>
              )}
            </div>
          )}
        </InfoRow>

        <InfoRow label="Verification">
          <span className="text-green-400 font-medium">
            Verified
          </span>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center px-6 md:px-8 py-4">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-white text-sm">{children}</span>
    </div>
  );
}

/* ======================================================
   WALLET
====================================================== */

function WalletSection({ user }: any) {
  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-5 px-1">
        Wallet
      </h2>

      <div className=" gap-6">
        <WalletMetric
          title="Tokens"
          amount={user?.wallet?.main || 0}
          accent="from-[#22c55e] to-[#16a34a]"
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
    <div className="relative rounded-2xl bg-[#0f0f14] border border-white/10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-15`} />
      <div className="relative p-6">
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-white text-4xl font-bold mt-3">₹{amount}</p>
      </div>
    </div>
  );
}

/* ======================================================
   ACTION ZONE
====================================================== */

function ActionZone({ logout }: { logout: () => void }) {
  return (
    <div className="rounded-2xl bg-[#0b0b0e] border border-red-500/20 p-6 md:p-8">
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
        >
          <IoLogOutOutline />
          Logout
        </button>
      </div>
    </div>
  );
}

function BlockedUsersSection() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(`${API}/user/blocked-users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setUsers(json.data.users || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [API]);

  return (
    <div className="rounded-2xl bg-[#0f0f14] border border-white/10">
      <div className="px-6 py-5 border-b border-white/10">
        <h2 className="text-white text-xl font-semibold">
          Blocked & Reported
        </h2>
      </div>

      {loading && (
        <div className="p-6 text-white/60">Loading…</div>
      )}

      {!loading && users.length === 0 && (
        <div className="p-6 text-white/50">
          You haven’t blocked anyone.
        </div>
      )}

      <div className="divide-y divide-white/10">
        {users.map(u => (
          <div
            key={u.userId}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <Image
                src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={u.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-white text-sm font-medium">
                  {u.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function RechargeHistorySection() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";
  const LIMIT = 5;

  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async (p = 1, append = false) => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${API}/user/getrechargehistory?page=${p}&limit=${LIMIT}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      if (json.success) {
        setItems(prev => append ? [...prev, ...json.data.items] : json.data.items);
        setHasMore(json.data.pagination.hasNextPage);
        setPage(p);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, []);

  return (
    <div className="rounded-2xl bg-[#0f0f14] border border-white/10">
      <div className="px-6 py-5 border-b border-white/10">
        <h2 className="text-white text-xl font-semibold">
          Recharge History
        </h2>
      </div>

      <div className="divide-y divide-white/10">
        {items.map(r => (
          <div
            key={r._id}
            className="flex justify-between px-6 py-4"
          >
            <div>
              <p className="text-white font-medium">
                ₹{r.grossAmount}
              </p>
              <p className="text-white/40 text-xs">
                {r.method}
              </p>
            </div>
            <div>
              <p className="text-white font-medium">
                Tokens Credited: {r.walletCreditAmount}
              </p>
            </div>
            <div>
              <p className="text-white font-medium">
                UID: {r.cfPaymentId}
              </p>
            </div>

            <div className="text-right">
              <p className="text-white/50 text-xs">
                {new Date(r.createdAt).toLocaleString()}
              </p>
              <p
                className={`text-xs font-semibold ${
                  r.status === "success"
                    ? "text-green-400"
                    : r.status === "failed"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {r.status.toUpperCase()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="p-5 flex justify-center">
          <button
            disabled={loading}
            onClick={() => fetchData(page + 1, true)}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
