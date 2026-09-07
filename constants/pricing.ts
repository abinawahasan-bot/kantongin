export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
  icon: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Landing Page",
    price: "Rp 300 rb",
    icon: "rocket",
    description:
      "Website satu halaman fokus konversi untuk produk, kampanye, atau personal branding Anda.",
    features: [
      "1–3 halaman, desain custom",
      "Responsif untuk semua perangkat",
      "Form kontak & integrasi WhatsApp",
      "Basic SEO",
      "Gratis revisi dalam tahap desain",
    ],
    highlight: false,
    cta: "Konsultasi Gratis",
  },
  {
    name: "Company Profile",
    price: "Rp 800 rb",
    icon: "building2",
    description:
      "Website multi-halaman profesional yang membangun kredibilitas dan kepercayaan sejak kunjungan pertama.",
    features: [
      "Hingga 8 halaman + blog",
      "Layout & navigasi sitemap rapi",
      "Optimasi SEO lengkap",
      "Integrasi WhatsApp & media sosial",
      "Setup domain, hosting & pelatihan admin",
    ],
    highlight: true,
    cta: "Konsultasi Gratis",
  },
  {
    name: "E-commerce / Toko Online",
    price: "Rp 1,3 jt",
    icon: "shoppingBag",
    description:
      "Toko online siap jualan — katalog, keranjang, pembayaran, dan ongkir terintegrasi.",
    features: [
      "Katalog produk tanpa batas",
      "Keranjang & checkout cepat",
      "Payment gateway terintegrasi",
      "Panel kelola pesanan & stok",
      "Optimasi SEO toko online",
    ],
    highlight: false,
    cta: "Konsultasi Gratis",
  },
  {
    name: "Custom / Web App",
    price: "Custom",
    icon: "layoutDashboard",
    description:
      "Solusi khusus untuk kebutuhan kompleks: web app, dashboard, e-commerce skala besar, hingga integrasi sistem.",
    features: [
      "Web app dengan login & database",
      "Dashboard & laporan custom",
      "Integrasi API atau sistem lama",
      "E-commerce skala besar",
      "Dedicated project manager",
    ],
    highlight: false,
    cta: "Hubungi Kami",
  },
];
