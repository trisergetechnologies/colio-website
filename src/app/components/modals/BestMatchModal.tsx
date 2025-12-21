"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Video, X, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getToken } from "@/lib/utils/tokenHelper";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCall } from "@/context/CallContext";



type Props = {
  open: boolean;
  onClose: () => void;
};

type Consultant = {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  languages?: string[];
  ratePerMinute?: number;
  ratingAverage?: number;
  ratingCount?: number;
  totalSessions?: number;
  availabilityStatus?: "onWork" | "offWork" | "busy";
  experienceMonths?: number;
};

const API_BASE_URL = "https://api.colio.in/api";

export default function BestMatchModal({ open, onClose }: Props) {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
const { isAuthenticated } = useAuth();
const { initiateCall } = useCall();

  /* ================= FETCH BEST MATCH ================= */
  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const fetchBestMatch = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await axios.get(
          `${API_BASE_URL}/customer/quickconnect`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              minRating: 4,
              language: "english",
            },
          }
        );

        if (mounted && res.data?.success) {
          setConsultants(res.data.data.consultants || []);
          setIndex(0);
        }
      } catch (err) {
        console.error("Best match error:", err);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchBestMatch();

    return () => {
      mounted = false;
    };
  }, [open]);

  /* ================= SAFE CONSULTANT ================= */
  const consultant = useMemo(() => {
    if (!consultants.length) return null;
    return consultants[index % consultants.length];
  }, [index, consultants]);

  /* ================= AUTO ROTATE ================= */
  useEffect(() => {
    if (!open || consultants.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % consultants.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [open, consultants]);


  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  /* ================= STATES ================= */
  if (!open) return null;

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className="text-white text-lg">Finding best match…</span>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!consultant) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span className="text-white text-lg">
            No consultants available
          </span>
        </motion.div>
      </AnimatePresence>
    );
  }
  const handleVoiceCall = () => {
  if (!consultant) return;
  if (!isAuthenticated) {
    router.push("/signin");
    return;
  }

  initiateCall(
    consultant.id,
    "voice",
    consultant.name,
    consultant.avatar
  );
};

const handleVideoCall = () => {
  if (!consultant) return;
  if (!isAuthenticated) {
    router.push("/signin");
    return;
  }

  initiateCall(
    consultant.id,
    "video",
    consultant.name,
    consultant.avatar
  );
};

const handleChat = () => {
  if (!consultant) return;
  if (!isAuthenticated) {
    router.push("/signin");
    return;
  }

  router.push(`/chat/${consultant.id}`);
};


  /* ================= UI (UNCHANGED) ================= */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="
    relative
    w-[95%] max-w-[520px]
    h-[640px]
    rounded-[32px]
    overflow-hidden
    bg-white/10
    backdrop-blur-2xl
    border border-white/30
    shadow-2xl
  "
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/80 hover:text-white"
          >
            <X />
          </button>

          {/* Image */}
          <motion.img
            key={consultant.id}
            src={
              consultant.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Online Indicator */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
            </span>
            <span className="text-sm text-white/90">Online</span>
          </div>

          {/* Actions */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
  <Action
    icon={<Phone />}
    price={consultant.ratePerMinute || 10}
    onClick={handleVoiceCall}
  />

  <Action
    icon={<MessageCircle />}
    price={Math.max((consultant.ratePerMinute || 10) / 2, 5)}
    highlight
    onClick={handleChat}
  />

  <Action
    icon={<Video />}
    price={(consultant.ratePerMinute || 10) * 2}
    onClick={handleVideoCall}
  />
</div>


          {/* Bottom Info */}
          <motion.div
            key={consultant.id + "-info"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-6 left-6 right-6 z-20 text-white"
          >
            <h3 className="text-2xl font-semibold">{consultant.name}</h3>

            <p className="text-sm text-white/80 mt-1">
              {consultant.bio}
            </p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="text-yellow-400" size={16} />
                {consultant.ratingAverage?.toFixed(1) || "0.0"}
              </div>
              <span className="text-white/70">
                {consultant.totalSessions || 0}+ sessions
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ================= ACTION BUTTON ================= */
function Action({
  icon,
  price,
  highlight,
  onClick,
}: {
  icon: React.ReactNode;
  price: number;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center transition
          ${
            highlight
              ? "bg-green-500 text-white scale-110 shadow-xl"
              : "bg-white/80 text-green-600 hover:scale-105"
          }
        `}
      >
        {icon}
      </button>
      <span className="mt-1 text-xs text-white/90">₹{price}/min</span>
    </div>
  );
}
