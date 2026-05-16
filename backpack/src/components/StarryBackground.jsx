"use client";

import { useEffect, useRef, memo } from "react";

/**
 * StarryBackground — GPU-accelerated canvas with frame-rate throttling.
 * Renders at 30fps (not 60) since twinkling stars don't need high refresh,
 * cutting GPU workload in half while looking identical.
 */
function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    
    let width, height;
    let stars = [];
    let animationFrameId;
    let lastFrameTime = 0;
    const TARGET_FPS = 30; // Stars don't need 60fps
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2); // Cap DPR for perf
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Fewer stars on mobile for better perf
      const numStars = width < 768 ? 60 : 120;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.03 + 0.005,
          growing: Math.random() > 0.5,
        });
      }
    };

    const draw = (timestamp) => {
      animationFrameId = requestAnimationFrame(draw);

      // Throttle to target FPS
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;

      // Single fill for background
      ctx.fillStyle = "#0a0f17";
      ctx.fillRect(0, 0, width, height);

      // Batch all stars with same technique
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (s.growing) {
          s.alpha += s.speed;
          if (s.alpha >= 1) { s.growing = false; s.alpha = 1; }
        } else {
          s.alpha -= s.speed;
          if (s.alpha <= 0.2) { s.growing = true; s.alpha = 0.2; }
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 6.2832); // Math.PI * 2
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
    };

    // Debounced resize
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ willChange: "contents" }}
    />
  );
}

export default memo(StarryBackground);
