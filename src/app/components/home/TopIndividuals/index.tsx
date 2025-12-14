// components/home/TopIndividuals.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoCallOutline,
  IoChatbubbleOutline,
  IoVideocamOutline,
  IoAdd,
  IoStar,
  IoStarOutline,
  IoArrowForward,
} from "react-icons/io5";
import { colors, gradientStyles } from "@/constants/colors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { getToken } from "@/lib/utils/tokenHelper";
import { useCall } from "@/context/CallContext";

/* ---------------- types ---------------- */

type Profile = {
  id: string;
  name: string;
  age?: number | null;
  gender?: "Male" | "Female" | "Other";
  languages: string[];
  rating: number;
  avatar: string;
  online: boolean;
};

/* ---------------- demo data ---------------- */

const DEMO_PROFILES: Profile[] = [
  {
    id: "1",
    name: "Aarav Mehta",
    age: 24,
    gender: "Male",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "2",
    name: "Sara Khan",
    age: 22,
    gender: "Female",
    languages: ["English", "Urdu"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "3",
    name: "Vihaan Kapoor",
    age: 26,
    gender: "Male",
    languages: ["English", "Hindi", "Marathi"],
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
  {
    id: "4",
    name: "Ishita Roy",
    age: 23,
    gender: "Female",
    languages: ["English", "Bengali", "Hindi"],
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
    online: true,
  },
];

/* ---------------- motion variants (unchanged) ---------------- */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};

/* ---------------- component ---------------- */

export default function TopIndividuals() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const { initiateCall } = useCall();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

  const [profiles, setProfiles] = useState<Profile[]>(DEMO_PROFILES);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- data fetch (unchanged) ---------------- */

  useEffect(() => {
    let mounted = true;

    const fetchTop = async () => {
      if (!isAuthenticated) {
        setProfiles(DEMO_PROFILES.slice(0, 4));
        return;
      }

      setIsLoading(true);
      try {
        const token = getToken();
        const res = await axios.get(
          `${API_BASE_URL}/customer/consultants?limit=4`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }
        );

        if (!mounted) return;

        const returned =
          res.data?.data?.consultants ??
          (Array.isArray(res.data?.data) ? res.data.data : []) ??
          [];

        if (returned.length) {
          setProfiles(
            returned.slice(0, 4).map((c: any) => ({
              id: c.id || c._id,
              name: c.name || "Unknown",
              age: c.age ?? null,
              gender: c.gender || "Other",
              languages: c.languages || [],
              rating:
                typeof c.ratingAverage === "number"
                  ? c.ratingAverage
                  : c.rating ?? 0,
              avatar:
                c.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              online:
                c.availabilityStatus === "onWork" || c.online === true,
            }))
          );
        }
      } catch {
        setProfiles(DEMO_PROFILES.slice(0, 4));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (!isAuthLoading) fetchTop();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isAuthLoading, API_BASE_URL]);

  /* ---------------- handlers (unchanged) ---------------- */

  const handleCall = (p: Profile, type: "voice" | "video") => {
    if (!isAuthenticated) return router.push("/signin");
    initiateCall(p.id, type, p.name, p.avatar);
  };

  const handleChat = (p: Profile) => {
    if (!isAuthenticated) return router.push("/(auth)/auth");
    router.push(`/chat/${p.id}`);
  };

  const seeAllHref = isAuthenticated ? "../experts" : "../signin";
  const shown = profiles.slice(0, 4);

  /* ---------------- render ---------------- */

  return (
    <section
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      <div className="container relative z-20">
        {/* Header unchanged */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p
            className="text-base font-semibold mb-4 tracking-wide"
            style={{ color: colors.accent[400], letterSpacing: "2px" }}
          >
            COMMUNITY PICKS
          </p>

          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6"
            style={gradientStyles.text}
          >
            Top Individuals to Connect
          </h2>

          <p className="text-white/85 max-w-2xl mx-auto">
            Genuine, active, and highly rated.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {(isLoading ? DEMO_PROFILES : shown).map((p) => (
            <motion.div
              key={p.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40"
            >
              {/* Full image */}
              <Image
                src={p.avatar}
                alt={p.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Add */}
              <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40">
                <IoAdd className="text-white" />
              </button>

              {/* Actions */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                <button
                  onClick={() => handleCall(p, "voice")}
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
                >
                  <IoCallOutline className="text-green-500" />
                </button>
                <button
                  onClick={() => handleChat(p)}
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
                >
                  <IoChatbubbleOutline className="text-green-500" />
                </button>
                <button
                  onClick={() => handleCall(p, "video")}
                  className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center"
                >
                  <IoVideocamOutline className="text-green-500" />
                </button>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 z-10 p-5">
                <h5 className="text-white text-lg font-semibold">
                  {p.name}
                </h5>
                <p className="text-white/70 text-sm">
                  {p.age ? `${p.age} • ${p.gender}` : p.gender}
                </p>

                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < Math.round(p.rating) ? (
                      <IoStar
                        key={i}
                        className="text-sm"
                        style={{ color: colors.accent[400] }}
                      />
                    ) : (
                      <IoStarOutline
                        key={i}
                        className="text-sm text-white/40"
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA unchanged */}
        <div className="mt-12 flex justify-center">
          <Link
            href={seeAllHref}
            className="px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white"
          >
            See all professionals <IoArrowForward className="inline ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
