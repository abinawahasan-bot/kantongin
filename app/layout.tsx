import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/common/JsonLd";
import { Providers } from "@/components/common/Providers";
import { BackToTop } from "@/components/common/BackToTop";
import { CursorGlow } from "@/components/common/CursorGlow";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { WhatsAppFloat } from "@/components/common/WhatsAppFloat";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/constants/site";
import "./globals.css";

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "jasa pembuatan website",
    "landing page",
    "company profile",
    "toko online",
    "web app",
    "SEO website",
    "UMKM go online",
    "desain website",
    "KantongIn",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  applicationName: siteConfig.name,
  appleWebApp: { title: siteConfig.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={plusJakarta.variable}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Lewati ke konten
        </a>
        <JsonLd />
        <Providers>
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          {children}
          <Footer />
          <BackToTop />
          <WhatsAppFloat />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
