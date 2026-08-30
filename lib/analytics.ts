"use client";

import { track } from "@vercel/analytics";
import { siteConfig } from "@/constants/site";

export type ConversionEvent =
  | "cta_whatsapp_click"
  | "wizard_submit"
  | "estimator_submit"
  | "blog_cta_click"
  | "popup_shown"
  | "popup_dismissed"
  | "popup_cta_click";

export type ConversionPayload = Record<string, string | number | boolean | null>;

export const MAX_CUSTOM_PROPERTIES = 2;

const isPrimitive = (value: unknown): value is string | number | boolean | null =>
  value === null ||
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean";

/** Ambil maksimal `max` properti primitif (Vercel membatasi jumlah properti). */
export function normalizePayload(
  payload?: ConversionPayload,
  max = MAX_CUSTOM_PROPERTIES
): ConversionPayload {
  if (!payload) return {};
  const normalized: ConversionPayload = {};
  for (const [key, value] of Object.entries(payload)) {
    if (Object.keys(normalized).length >= max) break;
    if (isPrimitive(value)) normalized[key] = value;
  }
  return normalized;
}

/** Kirim event konversi ke Vercel Analytics (custom events dikoleksi di plan Pro). */
export function trackConversion(
  event: ConversionEvent,
  payload?: ConversionPayload
): void {
  if (typeof window === "undefined") return;
  if (!siteConfig.analytics.enabled) return;
  track(event, normalizePayload(payload));
}