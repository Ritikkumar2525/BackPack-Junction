"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const u = session?.user;
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">My Profile</h1>
      <div className="glass-card p-6 flex items-center gap-5">
        {u?.image && !imageError ? <img src={u.image} alt="" className="w-20 h-20 rounded-2xl object-cover" onError={() => setImageError(true)} /> :
          <div className="w-20 h-20 rounded-2xl bg-burnt-orange/15 text-burnt-orange flex items-center justify-center text-2xl font-bold">{u?.name?.charAt(0)?.toUpperCase()}</div>}
        <div>
          <h2 className="text-cream text-xl font-bold">{u?.name}</h2>
          <p className="text-cream/30 text-sm">{u?.email}</p>
          <span className="inline-block mt-2 text-[10px] px-2.5 py-1 rounded-full bg-burnt-orange/10 text-burnt-orange uppercase tracking-wider">{u?.role || "user"}</span>
        </div>
      </div>
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-cream font-semibold text-sm">Account Details</h3>
        {[ { icon: User, label: "Full Name", value: u?.name },
           { icon: Mail, label: "Email", value: u?.email },
           { icon: Phone, label: "Phone", value: u?.phone || "Not set" },
           { icon: Shield, label: "Role", value: u?.role || "user" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-cream/[0.02]">
            <item.icon size={16} className="text-cream/20" />
            <div><p className="text-cream/30 text-[10px] uppercase">{item.label}</p><p className="text-cream text-sm">{item.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
