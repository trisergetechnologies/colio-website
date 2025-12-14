"use client";

import { useEffect } from "react";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.colio.in/api";

export default function GoogleCallback() {

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) return;

    // Send code to backend
    axios.post(`${API_BASE_URL}/google/oauth`, { code })
      .then(async (res) => {
        const data = res.data;

        if (data.success) {
          const { user, token, needRegister } = data.data;

          // If new Google user → go register
          if (needRegister) {
            window.location.href = `/complete-profile?email=${user.email}`;
            return;
          }

          // Otherwise → login
          localStorage.setItem("token", token);
          window.location.href = "/dashboard";
        }
      })
      .catch((err) => console.log("Google OAuth error:", err));

  }, []);

  return (
    <div style={{ padding: 40 }}>
      Redirecting...
    </div>
  );
}
