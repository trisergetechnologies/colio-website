"use client";

import { getToken } from "@/lib/utils/tokenHelper";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

type BlockedUser = {
  userId: string;
  name: string;
  avatar?: string | null;
  role: string;
};

export default function BlockedUsersList() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const [users, setUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlocked = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API}/block/blocked-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setUsers(res.data.data.users);
    } finally {
      setLoading(false);
    }
  };

  const unblock = async (id: string) => {
    const token = getToken();
    await axios.post(
      `${API}/block/unblock`,
      { userIdToUnblock: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUsers(prev => prev.filter(u => u.userId !== id));
  };

  useEffect(() => { fetchBlocked(); }, []);

  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold text-white mb-6">Blocked Users</h2>

      {loading && <p className="text-white/60">Loading…</p>}
      {!loading && users.length === 0 && (
        <p className="text-white/60">You haven’t blocked anyone.</p>
      )}

      <div className="space-y-4">
        {users.map(u => (
          <motion.div
            key={u.userId}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[rgba(15,15,17,0.7)]"
          >
            <div className="flex items-center gap-4">
              <Image
                src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={u.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="text-white font-semibold">{u.name}</p>
                <p className="text-white/50 text-sm">{u.role}</p>
              </div>
            </div>

            <button
              onClick={() => unblock(u.userId)}
              className="px-4 py-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white text-sm flex items-center gap-1"
            >
              <IoCloseCircleOutline /> Unblock
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
