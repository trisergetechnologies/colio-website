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
  IoAdd,
  IoArrowForward,
  IoCallOutline,
  IoChatbubbleOutline,
  IoStar,
  IoStarOutline,
  IoVideocamOutline,
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

/* ---------------- demo data ---------------- */

const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-1",
    name: "Aarav Sharma",
    age: 28,
    gender: "Male",
    profession: "Software Engineer",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: "images/avatar/11.png",
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
    avatar: "images/avatar/9.jpg",
    availabilityStatus: "onWork",
  },
  {
    id: "demo-3",
    name: "Rohan Verma",
    age: 31,
    gender: "Male",
    profession: "Business Consultant",
    languages: ["English", "Hindi"],
    rating: 5,
    avatar: "images/avatar/12.png",
    availabilityStatus: "onWork",
  },
  {
    id: "demo-4",
    name: "Ishita Roy",
    age: 24,
    gender: "Female",
    profession: "Student Mentor",
    languages: ["English", "Hindi"],
    rating: 4,
    avatar: "images/avatar/8.jpg",
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
    avatar: "images/avatar/13.png",
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
    avatar: "images/avatar/10.jpg",
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
  avatar: "images/avatar/14.png",
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
  avatar: "images/avatar/15.png",
  availabilityStatus: "onWork",
},
];


/* ---------------- skeleton card ---------------- */

const SkeletonCard = () => (
  <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 animate-pulse">
    <div className="absolute inset-0 bg-gray-700/50" />
    <div className="absolute bottom-0 left-0 p-5 w-full">
      <div className="h-5 bg-gray-600 rounded w-32 mb-2" />
      <div className="h-4 bg-gray-600 rounded w-24 mb-2" />
      <div className="flex gap-1 mt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 bg-gray-600 rounded" />
        ))}
      </div>
    </div>
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
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] },
  },
};
/* ---------------- component ---------------- */

export default function TopIndividuals() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { initiateCall } = useCall();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- simple API call ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Not logged in - show demo data
      if (!isAuthenticated) {
        setProfiles(DEMO_PROFILES);
        setIsLoading(false);
        return;
      }

      // Logged in - try API
      try {
        const token = getToken();
        const res = await axios.get(`${API_BASE_URL}/customer/quickconnect`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data?.consultants || res.data?.data || [];

        if (data.length > 0) {
          setProfiles(
            data.slice(0, 4).map((c: any) => ({
              id: c.id || c._id,
              name: c.name || "Unknown",
              age: c.age || null,
              gender: c.gender || null,
              languages: c.languages || [],
              rating: c.ratingAverage || c.consultantProfile?.ratingAverage || 0,
              avatar: c.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              availabilityStatus: c.availabilityStatus || c.consultantProfile?.availabilityStatus || "offWork",
            }))
          );
        } else {
          setProfiles(DEMO_PROFILES);
        }
      } catch (error) {
        // Error - show demo data
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
    const params = new URLSearchParams({
      participantId: p.id,
      participantName: p.name,
      participantAvatar: p.avatar || "",
      availabilityStatus: p.availabilityStatus,
    });
    router.push(`/chat/new?${params.toString()}`);
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
          {isLoading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : profiles.map((p) => (
              <motion.div
                key={p.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black/40"
              >
                {/* Image */}
                <Image src={p.avatar} alt={p.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Add button */}
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
                  <h5 className="text-white text-lg font-semibold">{p.name}</h5>
                  <p className="text-white/70 text-sm">
                    {p.age ? `${p.age} • ${p.gender}` : p.gender}
                  </p>
                  {p.profession && (
                    <p className="text-white/60 text-xs mt-1">{p.profession}</p>
                  )}


                  <div className="flex gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < Math.round(p.rating) ? (
                        <IoStar key={i} className="text-sm" style={{ color: colors.accent[400] }} />
                      ) : (
                        <IoStarOutline key={i} className="text-sm text-white/40" />
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* CTA */}
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