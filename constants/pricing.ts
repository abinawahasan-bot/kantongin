export type PricingPlan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "Rp 1,5 jt",
    period: "/bln",
    description:
      "Paket awal yang tepat untuk brand dan UMKM yang baru ingin membangun pondasi pemasaran digital.",
    features: [
      "1 kampanye affiliate aktif per bulan",
      "Akses jaringan 100+ kreator terkurasi",
      "Pelaporan performa bulanan yang transparan",
      "Pendampingan tim via WhatsApp",
    ],
    highlight: false,
    cta: "Mulai Sekarang",
  },
  {
    name: "Professional",
    price: "Rp 4,9 jt",
    period: "/bln",
    description:
      "Paket paling populer untuk brand yang serius menumbuhkan hasil kampanye secara konsisten.",
    features: [
      "Hingga 5 kampanye aktif: affiliate, open promo, & endorsement",
      "Akses penuh 500+ kreator dengan kurasi sesuai DNA brand",
      "Social media management hingga 3 platform",
      "Strategi konten & jadwal publikasi terkelola penuh",
      "Dashboard analitik real-time",
      "Account manager dedicated",
    ],
    highlight: true,
    cta: "Mulai Sekarang",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Solusi khusus untuk korporasi dan brand berskala besar dengan kebutuhan yang lebih kompleks.",
    features: [
      "Kampanye tanpa batas & kolaborasi brand eksklusif",
      "Akses jaringan kreator premium nasional",
      "Tim strategi & produksi konten khusus",
      "Integrasi API & laporan custom",
      "SLA prioritas dengan dukungan 24/7",
    ],
    highlight: false,
    cta: "Hubungi Kami",
  },
];
