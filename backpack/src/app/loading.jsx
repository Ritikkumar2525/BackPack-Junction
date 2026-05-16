import React from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-midnight text-cream flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-burnt-orange/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <Loader2 size={48} className="text-burnt-orange animate-spin mb-6" />
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-cream mb-2">
          Preparing your adventure...
        </h2>
        <p className="text-cream/40 text-sm">
          Fetching the latest destination details
        </p>
      </div>
    </div>
  );
}
