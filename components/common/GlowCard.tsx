"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

const BORDER_STYLE: CSSProperties = {
  padding: "1px",
  background:
    "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent), color-mix(in oklab, var(--accent) 45%, transparent))",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};

export function GlowCard({ children, className }: GlowCardProps) {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  const rotateX = useSpring(0, { stiffness: 140, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 140, damping: 20 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = () => setFinePointer(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!finePointer || reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.set((px - 0.5) * 6);
    rotateX.set((0.5 - py) * 6);
    event.currentTarget.style.setProperty("--spot-x", `${px * 100}%`);
    event.currentTarget.style.setProperty("--spot-y", `${py * 100}%`);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    rotateX.set(0);
    rotateY.set(0);
    event.currentTarget.style.setProperty("--spot-x", "50%");
    event.currentTarget.style.setProperty("--spot-y", "50%");
  };

  return (
    <motion.div
      className={cn("group relative rounded-lg bg-surface", className)}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={BORDER_STYLE} />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(500px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--primary) 14%, transparent), transparent 55%)",
        }}
      />
      <div className="relative z-[1] h-full">{children}</div>
    </motion.div>
  );
}
