"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoVideocamOutline,
  IoAdd,
  IoStar,
  IoStarOutline,
  IoHeart,
  IoHeartOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";
import { colors } from "@/constants/colors";
import { getToken } from "@/lib/utils/tokenHelper"; // adjust path if different
import { startVideoCall, startVoiceCall } from "@/lib/utils/callHelpers";

/* ----------------------------- Types & Dummy Data ----------------------------- */

type Consultant = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  languages?: string[];
  ratePerMinute?: number | null;
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
  // ... more dummies if needed
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

  // API pagination defaults
  const PAGE_LIMIT = 12;

  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [tab, setTab] = useState<"recommended" | "following">("recommended");
  const [search, setSearch] = useState<string>("");

  // Pagination state for API mode
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [usingDummy, setUsingDummy] = useState<boolean>(false);

  // Fetch consultants or favorites depending on tab and page
  const fetchData = useCallback(
    async (opts?: { page?: number; append?: boolean }) => {
      const p = opts?.page ?? 1;
      const append = !!opts?.append;
      setIsLoading(true);
      try {
        const token = getToken();
        // If tab=following, fetch favorites (no pagination assumed unless backend supports)
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
            setHasMore(false); // following list typically not paginated here
            setUsingDummy(false);
          } else {
            setConsultants([]);
            setFavorites([]);
            setHasMore(false);
            setUsingDummy(false);
          }
        } else {
          // Recommended: try fetching paginated consultants
          // backend might support ?page & ?limit — we send them
          const res = await axios.get(
            `${API_BASE_URL}/customer/consultants?page=${p}&limit=${PAGE_LIMIT}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
          );

          if (res.data?.success && (res.data.data?.consultants || res.data.data)) {
            // support different shapes: res.data.data.consultants OR res.data.data as array
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
              totalSessions: c.totalSessions || null,
              bio: c.bio || null,
              experienceMonths: c.experienceMonths || null,
            })) as Consultant[];

            if (append) {
              setConsultants((prev) => [...prev, ...normalized]);
            } else {
              setConsultants(normalized);
            }

            // determine hasMore via common meta fields
            const meta = res.data.data?.meta || res.data.meta || null;
            const metaHasMore =
              meta?.hasNextPage ?? meta?.hasMore ?? (meta?.total && meta?.page && meta?.limit ? meta.page * meta.limit < meta.total : undefined);

            // fallback: if meta not present, infer from returned length vs limit
            const inferredHasMore = Array.isArray(returned) ? returned.length === PAGE_LIMIT : false;

            setHasMore(Boolean(metaHasMore ?? inferredHasMore));
            setUsingDummy(false);
          } else {
            // If API returned empty or unexpected, fallback to local dummy list
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
        // fallback to dummy list on error
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

  // initial fetch & refetch on tab change
  useEffect(() => {
    setPage(1);
    fetchData({ page: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // Load more handler (works for API pagination or dummy)
  const handleLoadMore = async () => {
    if (usingDummy) {
      // client-side reveal more from ALL_PROFESSIONALS
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

  // Toggle follow/unfollow with optimistic UI + rollback on failure
  const toggleFollow = async (id: string) => {
    try {
      const token = getToken();
      const isFav = favorites.includes(id);

      // optimistic update
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
      // success — nothing else to do (state already updated)
    } catch (err) {
      console.error("toggleFollow error:", err);
      // rollback optimistic change
      setFavorites((p) => {
        const had = p.includes(id);
        if (had) return p.filter((x) => x !== id); // if we ended up having it, remove it
        // if we removed earlier and failed, re-add
        return [...p, id];
      });
    }
  };

  // Start call handlers (for web we route to call pages — replace with real call flow)
  // const startVoiceCall = (consultantId: string) => {
  //   router.push(`/call/voice/${consultantId}`);
  // };
  // const startVideoCall = (consultantId: string) => {
  //   router.push(`/call/video/${consultantId}`);
  // };
  const startChat = (consultantId: string) => {
    router.push(`/chat/${consultantId}`);
  };

  // Search filtering
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

  // UI
  return (
    <section
      id="professionals-list"
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      {/* floating layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[15%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(217,70,239,0.18),transparent_70%)] blur-3xl animate-float" />
        <div className="absolute bottom-0 right-[10%] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)] blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative z-20">
        {/* header + controls */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Experts</h2>
            <p className="text-white/70 mt-2">Connect with expert consultants — voice, video or chat.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search experts or languages..."
                  className="w-full rounded-full px-4 py-3 bg-white/6 placeholder:text-white/60 text-white outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                />
              </div>
            </div>

            <div className="flex rounded-full overflow-hidden border border-white/6">
              <button
                onClick={() => setTab("recommended")}
                className={`px-4 py-2 text-sm font-semibold ${tab === "recommended" ? "bg-pink-600" : "bg-white/10"} text-white`}
                style={{ transition: "all .18s" }}
              >
                Recommended
              </button>
              <button
                onClick={() => setTab("following")}
                className={`px-4 py-2 text-sm font-semibold ${tab === "following" ? "bg-pink-600" : "bg-white/10"} text-white`}
                style={{ transition: "all .18s" }}
              >
                Following
              </button>
            </div>
          </div>
        </div>

        {/* grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
          variants={containerStagger}
          initial="hidden"
          animate="show"
        >
          {/* Loading & fallback */}
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="rounded-3xl border border-white/10 bg-[rgba(15,15,17,0.6)] p-6 animate-pulse h-44" />
              ))}
            </>
          )}

          {!isLoading && displayedData.length === 0 && tab === "recommended" && (
            <div className="text-white/70 col-span-full p-8">No experts found.</div>
          )}

          {/* Improved empty state for Following tab */}
          {!isLoading && displayedData.length === 0 && tab === "following" && (
            <div className="col-span-full flex flex-col items-center justify-center p-10 bg-[rgba(255,255,255,0.02)] rounded-2xl">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="mb-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21s-6-4.35-8-6c-1.1-0.89-1-3 .5-4.5C6 9 8 9 9 9s1.5-2.5 3-2.5S15 9 15 9s2 0 4.5 1.5c1.5 1.5 1.6 3.6.5 4.5-2 1.65-8 6-8 6z" fill="#fff" opacity="0.06"/>
                <path d="M12 12a3 3 0 100-6 3 3 0 000 6z" fill="#ff66cc" />
              </svg>

              <h3 className="text-white text-lg font-semibold mb-2">You haven't followed anyone yet</h3>
              <p className="text-white/70 mb-4 text-center">Follow experts to see them listed here. We’ll recommend top profiles you may like.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTab("recommended")}
                  className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.06)] text-white border border-white/10"
                >
                  Browse Recommended
                </button>
                <button
                  onClick={() => {
                    // Could open search or suggestions
                    setTab("recommended");
                  }}
                  className="px-4 py-2 rounded-full bg-pink-600 text-white"
                >
                  Discover Experts
                </button>
              </div>
            </div>
          )}

          {!isLoading &&
            displayedData.map((c) => {
              const id = c.id || (c as any)._id || "";
              const isFav = favorites.includes(id);
              const rating = (c.ratingAverage ?? (c as any).rating ?? 0) as number;

              return (
                <motion.div
                  key={id}
                  variants={cardVariants}
                  whileHover={{ y: -6, boxShadow: "0 24px 48px -18px rgba(217,70,239,0.18)" }}
                  className="relative flex items-start gap-6 rounded-3xl border border-white/10 bg-[rgba(15,15,17,0.75)] backdrop-blur-xl p-6 md:p-7 transition-all duration-300 hover:border-[#e879f9]/50"
                >
                  <button
                    aria-label={isFav ? "Unfollow" : "Follow"}
                    onClick={(e) => { e.stopPropagation(); toggleFollow(id); }}
                    className="absolute -top-3 -right-3 rounded-full p-3 shadow-lg border border-white/10 bg-white/10 hover:bg-white/20 transition transform hover:scale-105 flex items-center justify-center"
                    title={isFav ? "Unfollow" : "Follow"}
                  >
                    {isFav ? <IoHeart style={{ color: "#ff2e8b", width: 18, height: 18 }} /> : <IoHeartOutline style={{ color: "white", width: 18, height: 18 }} />}
                  </button>

                  {/* Avatar */}
                  <div className="relative shrink-0 w-24 h-24">
                    <Image
                      src={c.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={c.name}
                      fill
                      sizes="96px"
                      className="rounded-full object-cover border border-white/10"
                    />

                    {/* online indicator */}
                    {(c.availabilityStatus === "onWork" || (c as any).online) && (
                      <div className="absolute -bottom-1 -right-1">
                        <span className="block w-5 h-5 rounded-full bg-[rgba(34,197,94,1)] border-2 border-black/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-xl font-semibold truncate">{c.name}</h3>
                    <p className="text-white/70 text-sm mt-1">
                      {c.languages?.join(", ") || "English"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-yellow-400 text-sm">⭐ {Number(rating).toFixed(1)}</div>
                      <div className="text-white/60 text-xs">• {c.experienceMonths ? `${Math.floor(c.experienceMonths/12)} yrs` : ""}</div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); startVoiceCall(id, router); }}
                        className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition"
                        title="Voice Call"
                      >
                        <IoCallOutline className="w-5 h-5 text-green-400" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); startChat(id); }}
                        className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition"
                        title="Chat"
                      >
                        <IoChatbubbleOutline className="w-5 h-5 text-green-400" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); startVideoCall(id, router); }}
                        className="p-3 rounded-full border border-white/10 bg-black hover:bg-white/20 transition"
                        title="Video Call"
                      >
                        <IoVideocamOutline className="w-5 h-5 text-green-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </motion.div>

        {/* Load more: show only when there is more data */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-6 py-3 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg transition-all duration-300"
            >
              {isLoading ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
