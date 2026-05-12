"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Mail, Phone, Calendar, Search, Download, X, MapPin, CreditCard, ChevronRight } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (res.ok && data.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const viewUserBookings = async (user) => {
    setSelectedUser(user);
    setLoadingBookings(true);
    try {
      const res = await fetch(`/api/users/${user._id}/bookings`);
      const data = await res.json();
      setUserBookings(data.bookings || []);
    } catch (e) {
      console.error(e);
      setUserBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const exportCSV = () => {
    const csv = ["Name,Email,Phone,Role,Joined"].concat(
      users.map(u => `"${u.name || ''}","${u.email}","${u.phone || ''}","${u.role || 'user'}","${new Date(u.createdAt).toLocaleDateString('en-IN')}"`)
    ).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'backpack_users.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = users.filter(u =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || "").includes(search)
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-cream">Users</h1>
          <p className="text-cream/35 text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="glass px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:text-cream flex items-center gap-2 border border-cream/10">
            <Download size={14} /> Export CSV
          </button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="glass rounded-xl pl-9 pr-4 py-2.5 text-cream/90 placeholder-cream/20 text-sm outline-none border border-cream/5 focus:border-burnt-orange/30 w-56" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-cream font-[family-name:var(--font-heading)]">{users.length}</p>
          <p className="text-cream/30 text-xs mt-1">Total Users</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-cream font-[family-name:var(--font-heading)]">{users.filter(u => u.role === "admin").length}</p>
          <p className="text-cream/30 text-xs mt-1">Admins</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-cream font-[family-name:var(--font-heading)]">{users.filter(u => {
            const d = new Date(u.createdAt);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length}</p>
          <p className="text-cream/30 text-xs mt-1">New This Month</p>
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-cream/40">No users found.</div>
        ) : (
          filtered.map((u, i) => (
            <motion.div key={u._id || u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="glass-card p-5 flex items-center gap-4 hover:border-cream/10 transition-all cursor-pointer group"
              onClick={() => viewUserBookings(u)}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-burnt-orange/10 text-burnt-orange"}`}>
                {u.name ? u.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-cream font-medium truncate">{u.name || "Unknown User"}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-cream/5 text-cream/30"}`}>{u.role || "user"}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-1 text-xs text-cream/30">
                  <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                  {u.phone && <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>}
                  <span className="flex items-center gap-1"><Calendar size={11} /> Joined {new Date(u.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-cream/10 group-hover:text-cream/30 transition-colors flex-shrink-0" />
            </motion.div>
          ))
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto glass-card p-0 shadow-2xl">

              <div className="sticky top-0 z-10 bg-[#0A101A]/90 backdrop-blur-md border-b border-cream/5 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${selectedUser.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-burnt-orange/10 text-burnt-orange"}`}>
                    {selectedUser.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-cream">{selectedUser.name}</h2>
                    <p className="text-cream/40 text-xs">{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 rounded-full glass flex items-center justify-center text-cream/50 hover:text-cream"><X size={16} /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-cream/[0.03] border border-cream/5">
                    <p className="text-cream/30 text-[10px] uppercase">Phone</p>
                    <p className="text-cream text-sm mt-1">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cream/[0.03] border border-cream/5">
                    <p className="text-cream/30 text-[10px] uppercase">Role</p>
                    <p className="text-cream text-sm mt-1 capitalize">{selectedUser.role || "user"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cream/[0.03] border border-cream/5">
                    <p className="text-cream/30 text-[10px] uppercase">Joined</p>
                    <p className="text-cream text-sm mt-1">{new Date(selectedUser.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cream/[0.03] border border-cream/5">
                    <p className="text-cream/30 text-[10px] uppercase">Total Bookings</p>
                    <p className="text-cream text-sm mt-1">{loadingBookings ? "..." : userBookings.length}</p>
                  </div>
                </div>

                {/* User Bookings */}
                <div>
                  <h3 className="text-cream/60 text-sm font-semibold mb-3">Booking History</h3>
                  {loadingBookings ? (
                    <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-burnt-orange/30 border-t-burnt-orange rounded-full animate-spin" /></div>
                  ) : userBookings.length === 0 ? (
                    <p className="text-cream/20 text-sm text-center py-6">No bookings yet</p>
                  ) : (
                    <div className="space-y-2">
                      {userBookings.map((b, i) => (
                        <div key={b._id} className="p-4 rounded-xl bg-cream/[0.02] border border-cream/5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-burnt-orange/10 text-burnt-orange flex items-center justify-center flex-shrink-0">
                            <MapPin size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-cream text-sm font-medium truncate">{b.tripId?.title || "Trip"}</p>
                            <p className="text-cream/30 text-xs">{new Date(b.createdAt).toLocaleDateString("en-IN")} · {b.travellers?.length || 1} traveler{(b.travellers?.length || 1) > 1 ? "s" : ""}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-burnt-orange text-sm font-semibold">₹{b.totalAmount?.toLocaleString("en-IN")}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.bookingStatus === "Confirmed" ? "bg-emerald-500/10 text-emerald-400" : b.bookingStatus === "Cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>{b.bookingStatus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
