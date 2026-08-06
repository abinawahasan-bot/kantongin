"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  className?: string;
  density?: number;
};

type Rgb = [number, number, number];

type Particle = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  wobbleAmp: number;
  wobbleFreq: number;
  wobblePhase: number;
  alpha: number;
  color: Rgb;
};

const MARGIN = 8;

export function Particles({ className, density = 40 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let rafId = 0;
    let running = false;
    let particles: Particle[] = [];

    const hexToRgb = (hex: string): Rgb => {
      const clean = hex.replace("#", "");
      const full =
        clean.length === 3
          ? clean
              .split("")
              .map((char) => char + char)
              .join("")
          : clean;
      const value = Number.parseInt(full, 16);
      return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
    };

    const build = () => {
      const styles = getComputedStyle(canvas);
      const primary = hexToRgb(styles.getPropertyValue("--primary").trim() || "#22C55E");
      const accent = hexToRgb(styles.getPropertyValue("--accent").trim() || "#3B82F6");

      particles = Array.from({ length: density }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 1.2,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.04 - Math.random() * 0.12,
        wobbleAmp: 2 + Math.random() * 6,
        wobbleFreq: 0.004 + Math.random() * 0.018,
        wobblePhase: Math.random() * Math.PI * 2,
        alpha: 0.08 + Math.random() * 0.28,
        color: index % 5 === 0 ? accent : primary,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y +=
          particle.vy + Math.sin(time * particle.wobbleFreq + particle.wobblePhase) * 0.02 * particle.wobbleAmp;

        if (particle.y < -MARGIN) particle.y = height + MARGIN;
        if (particle.y > height + MARGIN) particle.y = -MARGIN;
        if (particle.x < -MARGIN) particle.x = width + MARGIN;
        if (particle.x > width + MARGIN) particle.x = -MARGIN;

        const [r, g, b] = particle.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha})`;
        ctx.fillRect(Math.round(particle.x), Math.round(particle.y), particle.size, particle.size);
      }
    };

    const loop = (time: number) => {
      draw(time);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [density, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
