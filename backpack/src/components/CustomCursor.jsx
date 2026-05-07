"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState(""); // Can be used to show text like "DRAG", "VIEW"

  // useMotionValue ensures 60fps performance without React re-renders
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsVisible(true);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      
      // Determine what we're hovering over
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']")
      ) {
        setIsHovering(true);
        setHoverType("interactive");
      } else if (
        target.tagName.toLowerCase() === "img" || 
        target.closest("img")
      ) {
        setIsHovering(true);
        setHoverType("image");
      } else {
        setIsHovering(false);
        setHoverType("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor globally, except for inputs
    const style = document.createElement("style");
    style.innerHTML = `
      @media (pointer: fine) {
        body, *:not(input):not(textarea) {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 
        The Magic "Difference" Cursor 
        It uses mix-blend-mode to invert whatever is behind it.
      */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          backgroundColor: "#ffffff",
        }}
        animate={{
          width: isHovering ? (hoverType === "image" ? 80 : 64) : 14,
          height: isHovering ? (hoverType === "image" ? 80 : 64) : 14,
        }}
        transition={{ duration: 0.3, ease: "circOut" }}
      >
        <AnimatePresence>
          {isHovering && hoverType === "image" && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="text-[10px] font-bold tracking-widest uppercase text-black"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
