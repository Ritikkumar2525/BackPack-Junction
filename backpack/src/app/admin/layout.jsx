"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { LayoutDashboard, MapPin, CalendarCheck, ImagePlus, Users, BarChart3, LogOut, Menu, X, ChevronRight, Settings } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Analytics", icon: BarChart3 },
  { href: "/admin/trips", label: "Manage Trips", icon: MapPin },
  { href: "/admin/bookings", label: "All Bookings", icon: CalendarCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/gallery", label: "Gallery", icon: ImagePlus },
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: "#0C1420" }}><div className="w-10 h-10 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  }

  return (
    <div className="h-screen overflow-hidden flex" style={{ background: "linear-gradient(135deg, #0a0f18 0%, #111827 50%, #0a0f18 100%)" }}>
      <aside className="hidden lg:flex flex-col w-72 border-r border-cream/5 p-6 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <img src="/logo.jpg" alt="" className="w-10 h-10 rounded-full object-cover border border-burnt-orange/30" />
          <div>
            <span className="text-base font-bold text-cream font-[family-name:var(--font-heading)]">BACKPACK <span className="text-burnt-orange">ADMIN</span></span>
            <span className="block text-[9px] uppercase tracking-[2px] text-red-400/40">Admin Panel</span>
          </div>
        </Link>
        <nav className="flex-1 space-y-1">
          {adminLinks.map(l => (
            <Link key={l.href} href={l.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-cream/50 hover:text-cream hover:bg-cream/5 transition-all group">
              <l.icon size={18} className="text-cream/30 group-hover:text-burnt-orange transition-colors" />{l.label}
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-50" />
            </Link>
          ))}
        </nav>
        <div className="border-t border-cream/5 pt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-sm font-bold">A</div>
            <div><p className="text-cream text-sm font-medium">{session?.user?.name}</p><p className="text-red-400/40 text-xs">Admin</p></div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0a0f18]/90 backdrop-blur-xl border-b border-cream/5">
        <span className="text-sm font-bold text-cream">BACKPACK <span className="text-burnt-orange">ADMIN</span></span>
        <button onClick={() => setOpen(!open)} className="text-cream p-2">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-0 z-40 lg:hidden bg-[#0a0f18]/95 backdrop-blur-xl pt-16 p-6">
            <nav className="space-y-1 mt-4">{adminLinks.map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base text-cream/60 hover:text-cream hover:bg-cream/5"><l.icon size={20} /> {l.label}</Link>)}</nav>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 min-w-0 h-screen overflow-y-auto lg:p-8 p-4 pt-20 lg:pt-8 pb-32" data-lenis-prevent>{children}</main>
    </div>
  );
}
