"use client";

import { motion, useReducedMotion, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  href,
  target,
  rel,
  type = "button",
  ariaLabel,
  onClick,
  strength = 12,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const x: MotionValue<number> = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });
  const y: MotionValue<number> = useSpring(0, { stiffness: 200, damping: 18, mass: 0.4 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = () => setFinePointer(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const canMagnet = finePointer && !reduceMotion;

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!canMagnet) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(relX, relY);
    const clamped = Math.min(distance, strength);
    const ratio = distance === 0 ? 0 : clamped / distance;

    x.set(relX * ratio);
    y.set(relY * ratio);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!reduceMotion) {
      const rect = event.currentTarget.getBoundingClientRect();
      const id = rippleId.current++;
      const size = Math.max(rect.width, rect.height);
      setRipples((prev) => [...prev, { id, x: event.clientX - rect.left, y: event.clientY - rect.top, size }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 700);
    }

    onClick?.(event);
  };

  const content = (
    <>
      <span className="relative z-[1] inline-flex items-center gap-2">{children}</span>
      {ripples.length > 0 ? (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full bg-foreground/15"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                x: "-50%",
                y: "-50%",
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </span>
      ) : null}
    </>
  );

  const commonProps = {
    className: cn(
      "relative inline-flex cursor-pointer select-none items-center justify-center",
      className
    ),
    "aria-label": ariaLabel,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    style: { x, y, willChange: "transform" },
  };

  if (href !== undefined) {
    return (
      <motion.a
        {...commonProps}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button {...commonProps} type={type}>
      {content}
    </motion.button>
  );
}
