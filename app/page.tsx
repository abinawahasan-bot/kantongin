import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Statistics } from "@/components/sections/Statistics";
import { TrustedBy } from "@/components/sections/TrustedBy";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustedBy />
      <Statistics />
      <Services />
    </main>
  );
}
