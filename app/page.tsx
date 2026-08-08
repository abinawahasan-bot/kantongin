import { JsonLdFaq } from "@/components/common/JsonLd";
import {
  LazyContactSection,
  LazyCTASection,
  LazyFAQ,
  LazyHowItWorks,
  LazyPortfolio,
  LazyTestimonials,
} from "@/components/sections/LazySections";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Services } from "@/components/sections/Services";
import { Statistics } from "@/components/sections/Statistics";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function Home() {
  return (
    <>
      <JsonLdFaq />
      <main id="main" tabIndex={-1}>
        <Hero />
        <TrustedBy />
        <Statistics />
        <Services />
        <WhyChooseUs />
        <LazyHowItWorks />
        <LazyPortfolio />
        <LazyTestimonials />
        <Pricing />
        <LazyCTASection />
        <LazyFAQ />
        <LazyContactSection />
      </main>
    </>
  );
}
