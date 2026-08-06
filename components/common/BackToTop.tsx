"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useLenis } from "@/lib/lenis";

const SHOW_AFTER = 600;

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const { scrollTo } = useLenis();

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > SHOW_AFTER);
  });

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Kembali ke atas"
          onClick={() => scrollTo(0)}
          className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
