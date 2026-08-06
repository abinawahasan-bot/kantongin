import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/common/Providers";
import { BackToTop } from "@/components/common/BackToTop";
import { CursorGlow } from "@/components/common/CursorGlow";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/constants/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={plusJakarta.variable}>
      <body className="antialiased">
        <Providers>
          <LoadingScreen />
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          {children}
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
