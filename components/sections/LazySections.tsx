"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "@/components/common/LazyMount";

const HowItWorks = dynamic(
  () => import("@/components/sections/HowItWorks").then((mod) => mod.HowItWorks),
  { ssr: false }
);
const Portfolio = dynamic(
  () => import("@/components/sections/Portfolio").then((mod) => mod.Portfolio),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import("@/components/sections/Testimonials").then((mod) => mod.Testimonials),
  { ssr: false }
);
const FAQ = dynamic(
  () => import("@/components/sections/FAQ").then((mod) => mod.FAQ),
  { ssr: false }
);
const CTASection = dynamic(
  () => import("@/components/sections/CTASection").then((mod) => mod.CTASection),
  { ssr: false }
);
const ContactSection = dynamic(
  () =>
    import("@/components/sections/ContactSection").then((mod) => mod.ContactSection),
  { ssr: false }
);

export function LazyHowItWorks() {
  return (
    <LazyMount hashes={["#how-it-works", "#affiliate", "#creators"]}>
      <HowItWorks />
    </LazyMount>
  );
}

export function LazyPortfolio() {
  return (
    <LazyMount hashes={["#portfolio"]}>
      <Portfolio />
    </LazyMount>
  );
}

export function LazyTestimonials() {
  return (
    <LazyMount hashes={["#testimonials"]}>
      <Testimonials />
    </LazyMount>
  );
}

export function LazyFAQ() {
  return (
    <LazyMount hashes={["#faq"]}>
      <FAQ />
    </LazyMount>
  );
}

export function LazyCTASection() {
  return (
    <LazyMount hashes={["#cta"]}>
      <CTASection />
    </LazyMount>
  );
}

export function LazyContactSection() {
  return (
    <LazyMount hashes={["#contact"]}>
      <ContactSection />
    </LazyMount>
  );
}
