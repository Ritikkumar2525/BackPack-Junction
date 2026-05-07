"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Shield, User, Mail, Phone, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    { id: "admin-001", name: "Ritik Kumar", email: "admin@backpackjunction.com", phone: "+91 82870 54501", role: "admin", createdAt: "2025-06-01" },
    { id: "user-demo-001", name: "Demo Traveler", email: "demo@backpackjunction.com", phone: "+91 98765 43210", role: "user", createdAt: "2026-01-15" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Users</h1>
        <p className="text-cream/35 text-sm mt-1">{users.length} registered users</p>
      </div>
      <div className="space-y-3">
        {users.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-burnt-orange/10 text-burnt-orange"}`}>
              {u.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-cream font-medium">{u.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-cream/5 text-cream/30"}`}>{u.role}</span>
              </div>
              <div className="flex gap-4 mt-1 text-xs text-cream/30">
                <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
