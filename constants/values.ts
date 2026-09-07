export type Value = {
  icon: string;
  title: string;
  description: string;
  badge: string;
  points: string[];
};

export const values: Value[] = [
  {
    icon: "badgeCheck",
    title: "Design Modern & Responsif",
    description:
      "Tampilan kekinian yang menyesuaikan di semua perangkat — dari HP sampai layar lebar. Website Anda terlihat profesional di mana pun pelanggan membukanya.",
    badge: "Siap Mobile",
    points: [
      "Tampilan menyesuaikan semua ukuran layar",
      "Optimized untuk mobile-first browsing",
      "UI/UX profesional & modern",
    ],
  },
  {
    icon: "barChart",
    title: "Fast & SEO-Ready",
    description:
      "Website dimuat cepat dan teroptimasi untuk mesin pencari sejak awal. Pelanggan menemukan Anda lebih mudah — dan betah berlama-lama di website Anda.",
    badge: "PageSpeed 95+",
    points: [
      "PageSpeed score 95+ (mobile & desktop)",
      "Optimized Core Web Vitals",
      "Struktur SEO-friendly sejak awal",
    ],
  },
  {
    icon: "rocket",
    title: "Proses Transparan & Tepat Waktu",
    description:
      "Progres pengerjaan jelas di setiap tahap dengan estimasi yang realistis. Anda selalu tahu status proyek tanpa harus mengejar-ngejar tim kami.",
    badge: "Response < 24 Jam",
    points: [
      "Update progres real-time via WhatsApp",
      "Estimasi waktu pengerjaan yang akurat",
      "Dokumentasi lengkap di setiap tahap",
    ],
  },
  {
    icon: "trendingUp",
    title: "Support & Maintenance",
    description:
      "Website tidak berhenti setelah diluncurkan. Kami siap merawat, memperbarui, dan mengembangkan website Anda agar terus mendukung pertumbuhan bisnis.",
    badge: "Garansi 30 Hari",
    points: [
      "Garansi perbaikan gratis 30 hari",
      "Update konten & fitur kapan saja",
      "Monitoring uptime 24/7",
    ],
  },
];
