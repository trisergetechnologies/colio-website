// components/home/TopIndividuals.tsx
"use client";

import { colors, gradientStyles } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useCall } from "@/context/CallContext";
import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoArrowForward,
  IoCallOutline,
  IoChatbubbleOutline,
  IoStar,
  IoStarOutline,
  IoVideocamOutline
} from "react-icons/io5";

/* ---------------- types ---------------- */

type Profile = {
  id: string;
  name: string;
  age?: number | null;
  gender?: string | null;
  profession?: string;
  languages: string[];
  rating: number;
  avatar: string;
  availabilityStatus: string;
};

/* ---------------- DEMO DATA ---------------- */

const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Aarav Sharma",
    age: 28,
    gender: "Male",
    profession: "Software Engineer",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: require("@/assets/images/11.png"),
    availabilityStatus: "onWork",
  },
  {
    id: "demo-2",
    name: "Sonali Mehta",
    age: 26,
    gender: "Female",
    profession: "Psychologist",
    languages: ["English", "Hindi"],
    rating: 4,
    avatar: require("@/assets/images/9.jpg"),
    availabilityStatus: "busy", // Changed for demo
  },
  {
    id: "demo-3",
    name: "Rohan Verma",
    age: 31,
    gender: "Male",
    profession: "Business Consultant",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: require("@/assets/images/12.png"),
    availabilityStatus: "offWork", // Changed for demo
  },
  {
    id: "demo-4",
    name: "Ishita Roy",
    age: 24,
    gender: "Female",
    profession: "Student Mentor",
    languages: ["English", "Hindi"],
    rating: 4,
    avatar: require("@/assets/images/8.jpg"),
    availabilityStatus: "onWork",
  },
  {
    id: "demo-5",
    name: "Dr. Aman Gupta",
    age: 35,
    gender: "Male",
    profession: "Doctor",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: require("@/assets/images/13.png"),
    availabilityStatus: "onWork",
  },
  {
    id: "demo-6",
    name: "Neha Kapoor",
    age: 29,
    gender: "Female",
    profession: "Career Coach",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: require("@/assets/images/10.jpg"),
    availabilityStatus: "onWork",
  },
  {
    id: "demo-7",
    name: "Kunal Mehra",
    age: 33,
    gender: "Male",
    profession: "Chartered Accountant",
    languages: ["English", "Hindi"],
    rating: 4,
    avatar: require("@/assets/images/14.png"),
    availabilityStatus: "onWork",
  },
  {
    id: "demo-8",
    name: "Priya Nair",
    age: 27,
    gender: "Female",
    profession: "UI/UX Designer",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: require("@/assets/images/15.png"),
    availabilityStatus: "onWork",
  },
];


/* ---------------- skeleton ---------------- */

const SkeletonCard = () => (
  <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 animate-pulse">
    <div className="absolute inset-0 bg-gray-700/50" />
  </div>
);

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
    transition: { duration: 0.6 },
  },
};

/* ---------------- helper ---------------- */

const getStatusDetails = (status: string) => {
  switch (status) {
    case "onWork":
      return {
        label: "Online",
        dotColor: "bg-emerald-500",
        shadowColor: "shadow-emerald-500/50",
        isDisabled: false,
      };
    case "busy":
      return {
        label: "Busy",
        dotColor: "bg-red-500",
        shadowColor: "shadow-red-500/50",
        isDisabled: true,
      };
    default: // offWork or anything else
      return {
        label: "Offline",
        dotColor: "bg-zinc-500",
        shadowColor: "shadow-zinc-500/50",
        isDisabled: true,
      };
  }
};

/* ---------------- component ---------------- */

export default function TopIndividuals() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { initiateCall } = useCall();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- fetch data ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (!isAuthenticated) {
        setProfiles(DEMO_PROFILES);
        setIsLoading(false);
        return;
      }

      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/customer/quickconnect`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data?.consultants || [];

        if (data.length > 0) {
          setProfiles(
            data.slice(0, 4).map((c: any) => ({
              id: c.id || c._id,
              name: c.name || "Listener",
              age: c.age || null,
              gender: c.gender || null,
              languages: c.languages || [],
              profession: c.profession || "Expert",
              rating: c.ratingAverage || 0,
              avatar: c.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              availabilityStatus: c.availabilityStatus || "offWork",
            }))
          );
        } else {
          setProfiles(DEMO_PROFILES);
        }
      } catch {
        setProfiles(DEMO_PROFILES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  /* ---------------- handlers ---------------- */

  const handleCall = (p: Profile, type: "voice" | "video") => {
    if (!isAuthenticated) return router.push("/signin");
    initiateCall(p.id, type, p.name, p.avatar);
  };

  const handleChat = (p: Profile) => {
    if (!isAuthenticated) return router.push("/signin");
    router.push(`/chat/new?participantId=${p.id}`);
  };

  const seeAllHref = isAuthenticated ? "/experts" : "/signin";

  /* ---------------- render ---------------- */

  return (
    <section
      className="relative overflow-hidden py-28 md:py-32"
      style={{
        background: `linear-gradient(180deg, #0f0f11 0%, ${colors.background.end} 100%)`,
      }}
    >
      <div className="container relative z-20">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-base font-semibold mb-4 tracking-wide" style={{ color: colors.accent[400] }}>
            FEATURED LISTENERS
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6" style={gradientStyles.text}>
            Trusted People to Talk With
          </h2>

          <p className="text-white/85 max-w-2xl mx-auto">
            Verified and moderated conversation partners available online.
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
          {isLoading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : profiles.map((p) => {
                
                // --- GET STATUS CONFIGURATION ---
                const { label, dotColor, shadowColor, isDisabled } = getStatusDetails(p.availabilityStatus);

                return (
                  <motion.div
                    key={p.id}
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 group"
                  >
                    {/* Image (No longer fades when disabled) */}
                    <Image src={p.avatar} alt={p.name} fill className="object-cover transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* --- STATUS BADGE (Top Left) --- */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px] ${shadowColor}`} />
                        <span className="text-white/90 text-[11px] uppercase font-bold tracking-wider">{label}</span>
                    </div>

                    {/* Actions ONLY when logged in */}
                    {isAuthenticated && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
                        
                        {/* Voice Call */}
                        <button 
                            onClick={() => !isDisabled && handleCall(p, "voice")} 
                            disabled={isDisabled}
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/40 text-green-500 transition-all duration-300 ${
                                isDisabled 
                                ? "cursor-not-allowed" 
                                : "hover:bg-white hover:text-black hover:scale-110"
                            }`}
                        >
                          <IoCallOutline />
                        </button>

                        {/* Chat */}
                        <button 
                            onClick={() => !isDisabled && handleChat(p)} 
                            disabled={isDisabled}
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/40 text-green-500 transition-all duration-300 ${
                                isDisabled 
                                ? "cursor-not-allowed" 
                                : "hover:bg-white hover:text-black hover:scale-110"
                            }`}
                        >
                          <IoChatbubbleOutline />
                        </button>

                        {/* Video Call */}
                        <button 
                            onClick={() => !isDisabled && handleCall(p, "video")} 
                            disabled={isDisabled}
                            className={`w-10 h-10 rounded-full flex items-center justify-center bg-black/40 text-green-500 transition-all duration-300 ${
                                isDisabled 
                                ? "cursor-not-allowed" 
                                : "hover:bg-white hover:text-black hover:scale-110"
                            }`}
                        >
                          <IoVideocamOutline />
                        </button>

                      </div>
                    )}

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 z-10 p-5 w-full">
                      <h5 className="text-white text-lg font-semibold">{p.name}</h5>

                      <p className="text-white/70 text-sm">Verified Listener</p>

                      <p className="text-white/60 text-xs mt-1 truncate">
                        {p.profession || "Conversation Partner"}
                      </p>

                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: 5 }).map((_, i) =>
                          i < Math.round(p.rating) ? (
                            <IoStar key={i} className="text-sm text-yellow-400" />
                          ) : (
                            <IoStarOutline key={i} className="text-sm text-white/40" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
            })}
        </motion.div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link href={seeAllHref} className="px-6 py-3 rounded-full border border-white/20 bg-white/10 text-white">
            Explore All Listeners <IoArrowForward className="inline ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}