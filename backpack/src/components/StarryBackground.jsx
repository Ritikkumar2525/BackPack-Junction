"use client";

import { useEffect, useRef } from "react";

export default function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    
    let width, height;
    let stars = [];
    let animationFrameId;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = window.innerWidth < 768 ? 75 : 150;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.05 + 0.01,
          growing: Math.random() > 0.5
        });
      }
    };

    const draw = () => {
      // Background gradient
      const gradient = ctx.createRadialGradient(width/2, height, 0, width/2, height, height);
      gradient.addColorStop(0, '#1b2735');
      gradient.addColorStop(1, '#090a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        
        // Twinkle effect
        if (s.growing) {
          s.alpha += s.speed;
          if (s.alpha >= 1) { s.growing = false; s.alpha = 1; }
        } else {
          s.alpha -= s.speed;
          if (s.alpha <= 0.2) { s.growing = true; s.alpha = 0.2; }
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none w-full h-full"
    />
  );
}
