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
const EstimateWizard = dynamic(
  () => import("@/components/sections/EstimateWizard").then((mod) => mod.EstimateWizard),
  { ssr: false }
);
const Statistics = dynamic(
  () => import("@/components/sections/Statistics").then((mod) => mod.Statistics),
  { ssr: false }
);
const Services = dynamic(
  () => import("@/components/sections/Services").then((mod) => mod.Services),
  { ssr: false }
);
const WhyChooseUs = dynamic(
  () => import("@/components/sections/WhyChooseUs").then((mod) => mod.WhyChooseUs),
  { ssr: false }
);
const Pricing = dynamic(
  () => import("@/components/sections/Pricing").then((mod) => mod.Pricing),
  { ssr: false }
);

export function LazyHowItWorks() {
  return (
    <LazyMount hashes={["#how-it-works", "#affiliate", "#creators"]}>
      <HowItWorks />
    </LazyMount>
  );
}

export function LazyStatistics() {
  return (
    <LazyMount>
      <Statistics />
    </LazyMount>
  );
}

export function LazyServices() {
  return (
    <LazyMount hashes={["#services"]}>
      <Services />
    </LazyMount>
  );
}

export function LazyWhyChooseUs() {
  return (
    <LazyMount>
      <WhyChooseUs />
    </LazyMount>
  );
}

export function LazyPricing() {
  return (
    <LazyMount hashes={["#pricing"]}>
      <Pricing />
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

export function LazyEstimateWizard() {
  return (
    <LazyMount hashes={["#contact"]}>
      <EstimateWizard />
    </LazyMount>
  );
}
