import { JsonLdFaq } from "@/components/common/JsonLd";
import { HomeHashScroll } from "@/components/common/HomeHashScroll";
import {
  LazyEstimateWizard,
  LazyCTASection,
  LazyFAQ,
  LazyHowItWorks,
  LazyPortfolio,
  LazyPricing,
  LazyServices,
  LazyStatistics,
  LazyTestimonials,
  LazyWhyChooseUs,
} from "@/components/sections/LazySections";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";

export default function Home() {
  return (
    <>
      <JsonLdFaq />
      <main id="main" tabIndex={-1}>
        <HomeHashScroll />
        <Hero />
        <TrustedBy />
        <LazyStatistics />
        <LazyServices />
        <LazyWhyChooseUs />
        <LazyHowItWorks />
        <LazyPortfolio />
        <LazyTestimonials />
        <LazyPricing />
        <LazyCTASection />
        <LazyFAQ />
        <LazyEstimateWizard />
      </main>
    </>
  );
}
