"use client";

import { useInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";
import type { RefObject } from "react";

export function useInViewOnce<T extends Element>(
  ref: RefObject<T | null>,
  options?: Omit<UseInViewOptions, "once">
): boolean {
  return useInView(ref, { once: true, ...options });
}
