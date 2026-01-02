"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";

// --- Types ---
type Profile = {
  id: string;
  avatar: string;
};

// --- Fallback Data ---
const FALLBACK_PROFILES: Profile[] = [
  { id: "1", avatar: "/images/avatar/1.jpg" },
  { id: "2", avatar: "/images/avatar/2.jpg" },
  { id: "3", avatar: "/images/avatar/3.jpg" },
  { id: "4", avatar: "/images/avatar/4.jpg" },
  { id: "5", avatar: "/images/avatar/5.jpg" },
  { id: "6", avatar: "/images/avatar/6.jpg" },
  { id: "7", avatar: "/images/avatar/7.jpg" },
  { id: "8", avatar: "/images/avatar/5.jpg" },
  { id: "9", avatar: "/images/avatar/4.jpg" },
  { id: "10", avatar: "/images/avatar/7.jpg" },
  { id: "11", avatar: "/images/avatar/1.jpg" },
  { id: "12", avatar: "/images/avatar/2.jpg" },
  { id: "13", avatar: "/images/avatar/3.jpg" },
  { id: "14", avatar: "/images/avatar/4.jpg" },
  { id: "15", avatar: "/images/avatar/5.jpg" },
];

// --- Sub-Component: Smart Image ---
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 768px) 50vw, 20vw"
      onError={() => {
        setImgSrc("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop");
      }}
    />
  );
};

export default function HeroGrid() {
  const [profiles, setProfiles] = useState<Profile[]>(FALLBACK_PROFILES);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

  // --- 1. AUTH & SCROLL LOCK LOGIC ---
  useEffect(() => {
    const checkAuthAndScroll = () => {
      const token = localStorage.getItem("accessToken");
      const isMobile = window.innerWidth < 768; // Check if user is on mobile

      if (token) {
        setIsAuthenticated(true);
        // Always allow scroll if logged in
        document.body.style.overflow = "auto";
      } else {
        setIsAuthenticated(false);
        
        // CRITICAL FIX: Only lock scroll if on MOBILE
        if (isMobile) {
          document.body.style.overflow = "hidden";
        } else {
          // If on desktop, ensure scroll is free
          document.body.style.overflow = "auto";
        }
      }
      setIsCheckingAuth(false);
    };

    // Run initial check
    checkAuthAndScroll();

    // Add resize listener to handle switching between mobile/desktop views
    window.addEventListener('resize', checkAuthAndScroll);

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener('resize', checkAuthAndScroll);
    };
  }, []);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    if (isAuthenticated) return; 

    const fetchAndCacheProfiles = async () => {
      const cachedData = localStorage.getItem("hero_profiles_cache");
      if (cachedData) {
        setProfiles(JSON.parse(cachedData));
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/customer/consultants?limit=15`, { timeout: 2500 });
        const rawData = res.data?.data?.consultants || res.data?.data || [];
        
        if (Array.isArray(rawData) && rawData.length > 0) {
          const formattedProfiles = rawData.map((c: any, index) => ({
            id: c.id || c._id,
            avatar: c.avatar || `/images/avatar/${(index % 7) + 1}.jpg`, 
          }));
          localStorage.setItem("hero_profiles_cache", JSON.stringify(formattedProfiles));
          setProfiles(formattedProfiles);
        }
      } catch (error) {
        // Silent fail
      }
    };
    fetchAndCacheProfiles();
  }, [API_BASE_URL, isAuthenticated]);


  // --- CONDITIONAL RENDERING ---
  if (isCheckingAuth || isAuthenticated) {
    return null; 
  }

  // --- RENDER COMPONENT ---
  const ProfileCard = ({ profile, className }: { profile: Profile; className?: string }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gray-900 border border-white/5 ${className}`}>
      <ImageWithFallback 
        src={profile.avatar} 
        alt="User" 
        className="object-cover transition-transform duration-700 hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/5" />
    </div>
  );

  const midPoint = Math.ceil(profiles.length / 2);
  const col1 = profiles.slice(0, midPoint);
  const col2 = profiles.slice(midPoint);

  return (
    <div className="w-full h-screen bg-[#0f0f11] overflow-hidden relative font-sans md:hidden fixed inset-0 z-50">

      {/* =========================================
          NEW: TOP HEADER
      ========================================= */}
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-5 flex justify-between items-center bg-gradient-to-b from-[#0f0f11] to-transparent">
         {/* Logo Area */}
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.5)]">
               C
            </div>
            <span className="text-xl font-bold text-white tracking-wide">Colio</span>
         </div>

         {/* Right Action (Login text) */}
         <Link href="/signin" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Sign In
         </Link>
      </header>


      {/* =========================================
          CONTENT OVERLAY (Bottom)
      ========================================= */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end items-center pb-20 px-6 pointer-events-none bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/60 to-transparent">
        
        <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-2xl pointer-events-auto tracking-tight">
          Welcome to Colio.
        </h1>

        {/* --- PREMIUM COMPACT BUTTON --- */}
        <Link href="/signin" className="relative pointer-events-auto group">
           <div className="absolute -inset-2 rounded-full bg-violet-600/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-70 z-0"></div>
           <div className="absolute -inset-2 rounded-full bg-blue-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_700ms] opacity-50 z-0"></div>

           <button className="relative z-10 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border border-white/10 text-white text-base font-semibold tracking-wide px-8 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2.5">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
               <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.94-.94 2.56-.27 2.56 1.06v11.38c0 1.33-1.62 2-2.56 1.06z" />
             </svg>
             Start Video Call
           </button>
        </Link>
      </div>
      
      {/* --- MOBILE SCROLL VIEW --- */}
      <div className="h-full flex gap-3 px-3 relative overflow-hidden bg-[#0f0f11]">
        
        {/* Column 1 */}
        <div className="w-1/2 h-full overflow-hidden relative">
          <motion.div
            className="flex flex-col gap-3 pb-3"
            animate={{ y: ["0%", "-33.33%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[...col1, ...col1, ...col1].map((p, i) => (
              <div key={`mob-col1-${p.id}-${i}`} className="relative w-full h-64 flex-shrink-0">
                <ProfileCard profile={p} className="h-full w-full shadow-lg" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Column 2 */}
        <div className="w-1/2 h-full overflow-hidden relative">
          <motion.div
            className="flex flex-col gap-3 pb-3"
            initial={{ y: "-33.33%" }} 
            animate={{ y: ["-33.33%", "0%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          >
            {[...col2, ...col2, ...col2].map((p, i) => (
              <div key={`mob-col2-${p.id}-${i}`} className="relative w-full h-64 flex-shrink-0">
                  <ProfileCard profile={p} className="h-full w-full shadow-lg" />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/90 to-transparent z-20 pointer-events-none" />
      </div>

    </div>
  );
}