"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-midnight text-cream flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-10 max-w-lg w-full text-center relative z-10 border border-red-500/20"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
          <AlertTriangle size={36} />
        </div>
        
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-4">
          Oops! Something went wrong.
        </h1>
        
        <p className="text-cream/40 mb-8 leading-relaxed">
          We apologize for the inconvenience. An unexpected error occurred while loading this page. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn-primary py-3 px-6 flex items-center justify-center gap-2"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="btn-secondary py-3 px-6 flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-950/30 rounded-xl border border-red-900/50 text-left overflow-auto text-xs text-red-200 font-mono text-opacity-80 max-h-40">
            {error.message || "Unknown rendering error occurred."}
          </div>
        )}
      </motion.div>
    </div>
  );
}
