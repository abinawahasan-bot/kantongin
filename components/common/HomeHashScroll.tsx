"use client";

import { useEffect } from "react";
import { useLenis } from "@/lib/lenis";
import { isLazyAnchor, revealAndScroll } from "@/lib/reveal-section";

/**
 * Saat beranda termuat dengan hash (mis. "/#services" via deep-link atau
 * navigasi dari halaman lain), tunggu section ter-mount oleh LazyMount lalu
 * scroll halus ke section tersebut.
 */
export function HomeHashScroll() {
  const { scrollTo } = useLenis();

  useEffect(() => {
    const hash = window.location.hash;
    if (!isLazyAnchor(hash)) return;
    void revealAndScroll(hash, (target) => scrollTo(target));
  }, [scrollTo]);

  return null;
}