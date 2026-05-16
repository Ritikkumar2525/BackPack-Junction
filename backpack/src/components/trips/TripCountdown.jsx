"use client";
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export default function TripCountdown({ startDate }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (!startDate) return;
    const target = new Date(startDate).getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
        expired: false,
      };
    };
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [startDate]);

  if (!time || !startDate) return null;
  if (time.expired) return <p className="text-xs text-burnt-orange font-medium text-center mt-4">Trip has started!</p>;

  const Block = ({ val, label }) => (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-cream tabular-nums">{String(val).padStart(2, "0")}</span>
      <span className="text-[9px] text-cream/40 uppercase tracking-wider mt-1">{label}</span>
    </div>
  );

  return (
    <div className="mt-6 pt-5 border-t border-white/10">
      <p className="text-[10px] text-cream/40 uppercase tracking-widest font-bold text-center mb-3 flex items-center justify-center gap-1.5"><Timer size={12} /> Departure In</p>
      <div className="flex justify-center gap-4">
        <Block val={time.days} label="Days" />
        <span className="text-cream/20 text-xl mt-1">:</span>
        <Block val={time.hours} label="Hrs" />
        <span className="text-cream/20 text-xl mt-1">:</span>
        <Block val={time.mins} label="Min" />
        <span className="text-cream/20 text-xl mt-1">:</span>
        <Block val={time.secs} label="Sec" />
      </div>
    </div>
  );
}
