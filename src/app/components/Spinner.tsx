"use client";

import React from "react";
import { colors } from "@/constants/colors";

export default function Spinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center">
      {/* Glow background */}
      <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{
          background: `radial-gradient(circle, ${colors.button.start}33, transparent 70%)`,
        }}
      />

      {/* Loader */}
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full border-4 animate-spin"
          style={{
            borderColor: "rgba(255,255,255,0.12)",
            borderTopColor: colors.button.start,
            borderRightColor: colors.button.end,
          }}
        />

        {/* Soft pulse ring */}
        <div
          className="absolute inset-0 rounded-full border animate-pulse"
          style={{
            borderColor: `${colors.button.start}55`,
          }}
        />
      </div>

      {/* Message */}
      <p className="text-white/80 mt-6 text-lg font-medium tracking-wide">
        {message}
      </p>
    </div>
  );
}
