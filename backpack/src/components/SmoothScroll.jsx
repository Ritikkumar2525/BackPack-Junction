"use client";

import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

// Module-level storage — survives re-renders and route changes
const scrollPositions = new Map();
let isPopStateNav = false;

export default function SmoothScroll({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const isRestoringRef = useRef(false);
  const isFirstRenderRef = useRef(true);

  // ─── 1. Initialize Lenis ───
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothTouch: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // ─── 2. Continuously save scroll position ───
  // KEY FIX: Use window.location.pathname (updates instantly on pushState)
  // instead of React's pathname (updates on next render).
  // This means when Next.js scrolls to 0 during transition,
  // the save goes to the NEW page's key, not the old one.
  useEffect(() => {
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      const currentPath = window.location.pathname;
      scrollPositions.set(currentPath, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── 3. Force-save on link click (before Next.js navigates) ───
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) return;

      // Internal SPA link — save current scroll immediately
      scrollPositions.set(window.location.pathname, window.scrollY);
    };

    // Also catch programmatic router.push via div onClick etc.
    const handleClickAll = (e) => {
      // Save scroll for current pathname on any click that might trigger navigation
      scrollPositions.set(window.location.pathname, window.scrollY);
    };

    document.addEventListener("click", handleClick, true);
    // Use a lower-priority listener for general clicks
    document.addEventListener("mousedown", handleClickAll, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mousedown", handleClickAll, true);
    };
  }, []);

  // ─── 4. Detect back/forward via popstate ───
  useEffect(() => {
    const handlePopState = () => {
      isPopStateNav = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ─── 5. Restore scroll with retry logic ───
  const restoreScroll = useCallback((targetPos) => {
    if (!lenisRef.current) return;
    isRestoringRef.current = true;

    let attempts = 0;
    const maxAttempts = 20;

    const attemptRestore = () => {
      if (!lenisRef.current) {
        isRestoringRef.current = false;
        return;
      }

      lenisRef.current.scrollTo(targetPos, { immediate: true });

      if (Math.abs(window.scrollY - targetPos) > 5 && attempts < maxAttempts) {
        attempts++;
        setTimeout(attemptRestore, 60);
      } else {
        setTimeout(() => { isRestoringRef.current = false; }, 150);
      }
    };

    requestAnimationFrame(attemptRestore);
  }, []);

  // ─── 6. React to route changes ───
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      // Save initial scroll position
      scrollPositions.set(pathname, window.scrollY);
      return;
    }

    if (isPopStateNav) {
      // BACK or FORWARD navigation — restore saved position
      isPopStateNav = false;
      const savedPos = scrollPositions.get(pathname);

      if (savedPos !== undefined && savedPos > 0) {
        restoreScroll(savedPos);
      } else {
        // No saved position, scroll to top
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }
    } else {
      // NEW forward navigation — scroll to top
      isRestoringRef.current = true;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      setTimeout(() => { isRestoringRef.current = false; }, 150);
    }
  }, [pathname, restoreScroll]);

  return <div style={{ width: "100%" }}>{children}</div>;
}
