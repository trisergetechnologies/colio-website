"use client";

import { colors } from "@/constants/colors";
import { useCall } from "@/context/CallContext";
import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
  IoShieldOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import BlockUserModal from "../../profileThings/BlockUserModal";

/* ----------------------------- Types & Dummy Data ----------------------------- */

type Consultant = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  languages?: string[];
  ratePerMinute?: number | null;
  ratePerMinuteVideo?: number | null;
  ratingAverage?: number | null;
  totalSessions?: number | null;
  availabilityStatus?: "onWork" | "offWork" | "busy";
  experienceMonths?: number | null;
};

type Pro = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  languages: string[];
  rating: number;
  avatar: string;
  online: boolean;
};

const ALL_PROFESSIONALS: Pro[] = [
  {
    id: "p1",
    name: "Aarav Mehta (Test)",
    age: 24,
    gender: "Male",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p2",
    name: "Sara Khan (Test)",
    age: 22,
    gender: "Female",
    languages: ["English", "Urdu"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "p3",
    name: "Vihaan Kapoor (Test)",
    age: 26,
    gender: "Male",
    languages: ["English", "Hindi", "Marathi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces",
    online: false,
  },
];

/* ---------------------------- Motion Variants ---------------------------- */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
  },
};

/* ----------------------------- Component ---------------------------------- */

export default function ExpertsList() {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";
  const [callingId, setCallingId] = useState<string | null>(null);
  const PAGE_LIMIT = 12;

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tab, setTab] = useState<"recommended" | "following">("recommended");
  const [search, setSearch] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [usingDummy, setUsingDummy] = useState<boolean>(false);

  const [blockTarget, setBlockTarget] = useState<{
    id: string;
    name?: string;
  } | null>(null);

  const openBlockModal = (consultant: Consultant) => {
    setBlockTarget({
      id: consultant.id,
      name: consultant.name,
    });
  };

  const closeBlockModal = () => {
    setBlockTarget(null);
  };

  const fetchData = useCallback(
    async (opts?: { page?: number; append?: boolean }) => {
      const p = opts?.page ?? 1;
      const append = !!opts?.append;
      setIsLoading(true);
      try {
        const token = await getToken();
        if (tab === "following") {
          const res = await axios.get(`${API_BASE_URL}/customer/favorites`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });

          if (res.data?.success && res.data.data?.favorites) {
            const favs = res.data.data.favorites as any[];
            const normalized = favs.map((f) => ({
              id: f.id || f.consultantId || f._id,
              name: f.name || f.consultantName,
              avatar: f.avatar || f.image || null,
              languages: f.languages || [],
              ratingAverage: f.ratingAverage || f.rating,
              availabilityStatus: f.availabilityStatus || "offWork",
            })) as Consultant[];
            setConsultants(normalized);
            setFavorites(normalized.map((c) => c.id));
            setHasMore(false);
            setUsingDummy(false);
          } else {
            setConsultants([]);
            setFavorites([]);
            setHasMore(false);
            setUsingDummy(false);
          }
        } else {
          const res = await axios.get(
            `${API_BASE_URL}/customer/consultants?page=${p}&limit=${PAGE_LIMIT}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          );

          if (res.data?.success && (res.data.data?.consultants || res.data.data)) {
            const returned =
              Array.isArray(res.data.data?.consultants) ? res.data.data.consultants : Array.isArray(res.data.data) ? res.data.data : res.data.data?.consultants || [];

            const normalized = (returned as any[]).map((c) => ({
              id: c.id || c._id || c.consultantId,
              name: c.name,
              avatar: c.avatar || c.image || null,
              languages: c.languages || [],
              ratingAverage: typeof c.ratingAverage === "number" ? c.ratingAverage : c.rating,
              availabilityStatus: c.availabilityStatus || "offWork",
              ratePerMinute: c.ratePerMinute || null,
              ratePerMinuteVideo: c.ratePerMinuteVideo || null,
              totalSessions: c.totalSessions || null,
              bio: c.bio || null,
              experienceMonths: c.experienceMonths || null,
            })) as Consultant[];

            if (append) {
              setConsultants((prev) => [...prev, ...normalized]);
            } else {
              setConsultants(normalized);
            }

            const meta = res.data.data?.meta || res.data.meta || null;
            const metaHasMore =
              meta?.hasNextPage ?? meta?.hasMore ?? (meta?.total && meta?.page && meta?.limit ? meta.page * meta.limit < meta.total : undefined);

            const inferredHasMore = Array.isArray(returned) ? returned.length === PAGE_LIMIT : false;

            setHasMore(Boolean(metaHasMore ?? inferredHasMore));
            setUsingDummy(false);
          } else {
            setConsultants(ALL_PROFESSIONALS.map((p) => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              languages: p.languages,
              ratingAverage: p.rating,
              availabilityStatus: p.online ? "onWork" : "offWork",
            })));
            setHasMore(ALL_PROFESSIONALS.length > PAGE_LIMIT);
            setUsingDummy(true);
          }
        }
      } catch (err) {
        console.error("ProfessionalsList fetch error:", err);
        setConsultants(ALL_PROFESSIONALS.map((p) => ({
          id: p.id,
          name: p.name,
          avatar: p.avatar,
          languages: p.languages,
          ratingAverage: p.rating,
          availabilityStatus: p.online ? "onWork" : "offWork",
        })));
        setHasMore(ALL_PROFESSIONALS.length > PAGE_LIMIT);
        setUsingDummy(true);
      } finally {
        setIsLoading(false);
      }
    },
    [API_BASE_URL, PAGE_LIMIT, tab]
  );

  useEffect(() => {
    setPage(1);
    fetchData({ page: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleLoadMore = async () => {
    if (usingDummy) {
      const current = consultants.length;
      const nextVisible = Math.min(current + PAGE_LIMIT, ALL_PROFESSIONALS.length);
      setConsultants(ALL_PROFESSIONALS.slice(0, nextVisible).map((p) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        languages: p.languages,
        ratingAverage: p.rating,
        availabilityStatus: p.online ? "onWork" : "offWork",
      })));
      setHasMore(nextVisible < ALL_PROFESSIONALS.length);
      return;
    }

    if (!hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchData({ page: nextPage, append: true });
  };

  const toggleFollow = async (id: string) => {
    try {
      const token = getToken();
      const isFav = favorites.includes(id);

      if (isFav) setFavorites((p) => p.filter((x) => x !== id));
      else setFavorites((p) => [...p, id]);

      if (isFav) {
        await axios.delete(`${API_BASE_URL}/customer/favorites/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/customer/favorites`,
          { consultantId: id },
          { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );
      }
    } catch (err) {
      console.error("toggleFollow error:", err);
      setFavorites((p) => {
        const had = p.includes(id);
        if (had) return p.filter((x) => x !== id);
        return [...p, id];
      });
    }
  };

  const { initiateCall } = useCall();

  const handleVoiceCall = (consultant: any) => {
    if (callingId) {
      console.log('[ExpertsList] Already initiating a call');
      return;
    }

    setCallingId(consultant.id);

    initiateCall(
      consultant.id,
      'voice',
      consultant.name,
      consultant.avatar
    );

    setTimeout(() => {
      setCallingId(null);
    }, 3000);
  };

  const handleVideoCall = (consultant: any) => {
    if (callingId) {
      console.log('[ExpertsList] Already initiating a call');
      return;
    }

    setCallingId(consultant.id);

    initiateCall(
      consultant.id,
      'video',
      consultant.name,
      consultant.avatar
    );

    setTimeout(() => {
      setCallingId(null);
    }, 3000);
  };

  const startChat = (consultant: Consultant) => {
    const params = new URLSearchParams({
      participantId: consultant.id,
      participantName: consultant.name,
      participantAvatar: consultant.avatar || '',
      availabilityStatus: consultant.availabilityStatus || 'offWork',
    });
    router.push(`/chat/new?${params.toString()}`);
  };

  const displayedData = useMemo(() => {
    if (tab === "following") return consultants;
    if (!search.trim()) return consultants;
    const q = search.trim().toLowerCase();
    return consultants.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.languages || []).join(" ").toLowerCase().includes(q)
    );
  }, [tab, consultants, search]);

  return (
    <section
      id="professionals-list"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.12),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(236,72,153,0.06),transparent_60%)] blur-3xl" />
      </div>

      <div className="container relative z-20">
        {/* Header + controls */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Experts
            </h2>
            <p className="text-white/60 mt-2 text-base">
              Connect with expert consultants — voice, video or chat.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial md:min-w-[280px]">
              <div className="relative group">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search experts or languages..."
                  className="w-full rounded-2xl px-5 py-3.5 bg-white/[0.04] placeholder:text-white/40 text-white text-sm outline-none border border-white/[0.06] focus:border-pink-500/40 focus:bg-white/[0.06] transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </div>
            </div>

            <div className="flex rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02]">
              <button
                onClick={() => setTab("recommended")}
                className={`px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  tab === "recommended"
                    ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setTab("following")}
                className={`px-5 py-3 text-sm font-medium transition-all duration-300 ${
                  tab === "following"
                    ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                Following
              </button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
          variants={containerStagger}
          initial="hidden"
          animate="show"
        >
          {/* Loading skeletons */}
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 h-[280px] animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/[0.06]" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-white/[0.06] rounded-lg w-3/4" />
                      <div className="h-4 bg-white/[0.06] rounded-lg w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!isLoading && displayedData.length === 0 && tab === "recommended" && (
            <div className="text-white/60 col-span-full p-12 text-center">
              No experts found.
            </div>
          )}

          {/* Empty state for Following */}
          {!isLoading && displayedData.length === 0 && tab === "following" && (
            <div className="col-span-full flex flex-col items-center justify-center p-14 bg-white/[0.02] rounded-3xl border border-white/[0.06]">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                <IoHeart className="w-10 h-10 text-pink-400/60" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                You haven't followed anyone yet
              </h3>
              <p className="text-white/50 mb-6 text-center max-w-md">
                Follow experts to see them listed here. We'll recommend top profiles you may like.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTab("recommended")}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] text-white border border-white/[0.08] hover:bg-white/[0.1] transition-all duration-200"
                >
                  Browse Recommended
                </button>
                <button
                  onClick={() => setTab("recommended")}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200"
                >
                  Discover Experts
                </button>
              </div>
            </div>
          )}

          {/* Expert Cards */}
          {!isLoading &&
            displayedData.map((c) => {
              const id = c.id || (c as any)._id || "";
              const isFav = favorites.includes(id);
              const rating = (c.ratingAverage ?? (c as any).rating ?? 0) as number;
              const isOnline = c.availabilityStatus === "onWork" || (c as any).online;
              const isBusy = c.availabilityStatus === "busy";

              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-3xl border border-white/[0.08] bg-[#0d0d0f]/80 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/[0.08]"
                >
                  {/* Card inner glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.03] via-transparent to-purple-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top section with avatar and info */}
                  <div className="relative p-5 pb-4">
                    {/* Top row: Avatar + Name + Status + Actions */}
                    <div className="flex items-start gap-4">
                      {/* Avatar with status */}
                      <div className="relative shrink-0">
                        <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden ring-2 ring-white/[0.08] group-hover:ring-pink-500/30 transition-all duration-300">
                          <Image
                            src={
                              c.avatar ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt={c.name}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        </div>
                        {/* Online/Busy indicator */}
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[3px] border-[#0d0d0f] ${
                            isOnline
                              ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                              : isBusy
                                ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                                : "bg-zinc-600"
                          }`}
                        />
                      </div>

                      {/* Name and languages */}
                      <div className="flex-1 min-w-0 pt-1">
                        <h3 className="text-white text-lg font-semibold truncate leading-tight">
                          {c.name}
                        </h3>
                        <p className="text-white/50 text-sm mt-1 truncate">
                          {c.languages?.join(" • ") || "English"}
                        </p>

                        {/* Status badge */}
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isOnline
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : isBusy
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                                  : "bg-white/[0.06] text-white/50 border border-white/[0.08]"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOnline
                                  ? "bg-emerald-400"
                                  : isBusy
                                    ? "bg-amber-400"
                                    : "bg-white/40"
                              }`}
                            />
                            {isOnline
                              ? "Available"
                              : isBusy
                                ? "Busy"
                                : "Offline"}
                          </span>
                        </div>
                      </div>

                      {/* Top right actions: Favorite & Report */}
                      <div className="flex flex-col gap-2">
                        <button
                          aria-label={isFav ? "Unfollow" : "Follow"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollow(id);
                          }}
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            isFav
                              ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                              : "bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70"
                          }`}
                          title={isFav ? "Unfollow" : "Follow"}
                        >
                          {isFav ? (
                            <IoHeart className="w-5 h-5" />
                          ) : (
                            <IoHeartOutline className="w-5 h-5" />
                          )}
                        </button>

                        <button
                          aria-label="Report"
                          onClick={(e) => {
                            e.stopPropagation();
                            openBlockModal(c);
                          }}
                          className="p-2 rounded-xl bg-white/[0.04] text-white/40 hover:bg-red-500/15 hover:text-red-400 transition-all duration-200"
                          title="Report"
                        >
                          <IoShieldOutline className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing section */}
                  <div className="relative px-5 pb-4">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Voice rate */}
                      <div className="bg-white/[0.03] rounded-xl px-3.5 py-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 mb-1">
                          <IoCallOutline className="w-4 h-4 text-emerald-400" />
                          <span className="text-white/50 text-xs">Voice</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-white font-bold text-lg">
                            ₹{c.ratePerMinute || "—"}
                          </span>
                          <span className="text-white/40 text-xs">/min</span>
                        </div>
                      </div>

                      {/* Video rate */}
                      <div className="bg-white/[0.03] rounded-xl px-3.5 py-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 mb-1">
                          <IoVideocamOutline className="w-4 h-4 text-pink-400" />
                          <span className="text-white/50 text-xs">Video</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-white font-bold text-lg">
                            ₹{c.ratePerMinuteVideo || "—"}
                          </span>
                          <span className="text-white/40 text-xs">/min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons - SUPER FANCY VERSION */}
                  <div className="relative px-5 pb-5">
                    <div className="flex items-center gap-2">
                      {/* Voice Call Button - Emerald Gradient with Glow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoiceCall(c);
                        }}
                        className="group/btn relative flex-1 max-w-[140px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        title="Voice Call"
                      >
                        {/* Animated pulsing glow */}
                        <div className="absolute -inset-2 bg-emerald-500/60 blur-2xl animate-[pulse_2s_ease-in-out_infinite]" />
                        <div className="absolute -inset-1 bg-emerald-400/40 blur-xl animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
                        {/* Base gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-xl" />
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2.5s_ease-in-out_infinite] rounded-xl" />
                        {/* Top shine */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-xl" />
                        {/* Content */}
                        <div className="relative flex items-center gap-2">
                          <IoCallOutline className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                          <span className="text-white font-bold text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Voice
                          </span>
                        </div>
                      </button>

                      {/* Chat Button - Premium Glass Style */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startChat(c);
                        }}
                        className="group/btn relative flex items-center justify-center p-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.08] active:scale-[0.95]"
                        title="Chat"
                      >
                        {/* Subtle pulsing glow */}
                        <div className="absolute -inset-1 bg-white/30 blur-lg animate-[pulse_3s_ease-in-out_infinite]" />
                        {/* Glass background */}
                        <div className="absolute inset-0 bg-white/[0.1] backdrop-blur-md rounded-xl" />
                        {/* Border */}
                        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover/btn:border-white/40 transition-colors duration-300" />
                        {/* Top shine */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-xl" />
                        {/* Icon */}
                        <IoChatbubbleOutline className="relative w-5 h-5 text-white/80 group-hover/btn:text-white transition-colors duration-200 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                      </button>

                      {/* Video Call Button - Pink Gradient with Glow */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoCall(c);
                        }}
                        className="group/btn relative flex-1 max-w-[140px] flex items-center justify-center gap-2 py-3 px-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                        title="Video Call"
                      >
                        {/* Animated pulsing glow */}
                        <div className="absolute -inset-2 bg-pink-500/60 blur-2xl animate-[pulse_2s_ease-in-out_infinite]" />
                        <div className="absolute -inset-1 bg-pink-400/40 blur-xl animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
                        {/* Base gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-pink-500 to-rose-500 rounded-xl" />
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2.5s_ease-in-out_infinite] rounded-xl" />
                        {/* Top shine */}
                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent rounded-t-xl" />
                        {/* Content */}
                        <div className="relative flex items-center gap-2">
                          <IoVideocamOutline className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                          <span className="text-white font-bold text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            Video
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* Load more button */}
        {hasMore && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="group relative px-8 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 disabled:opacity-50"
            >
              <span className="relative z-10">
                {isLoading ? "Loading..." : "Load More Experts"}
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        )}
      </div>

      <BlockUserModal
        open={!!blockTarget}
        onClose={closeBlockModal}
        userIdToBlock={blockTarget?.id || ""}
        userName={blockTarget?.name}
      />
    </section>
  );
}