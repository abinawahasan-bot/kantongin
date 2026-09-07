export type Service = {
  icon: string;
  title: string;
  description: string;
  points?: string[];
};

export const services: Service[] = [
  {
    icon: "shoppingCart",
    title: "E-commerce / Toko Online",
    description:
      "Bangun toko online yang siap jualan 24/7 — katalog produk, keranjang, pembayaran, dan integrasi ongkir. Ubah pengunjung menjadi pelanggan.",
    points: [
      "Katalog & sistem pembayaran",
      "Integrasi payment gateway",
      "Manajemen produk mudah",
    ],
  },
  {
    icon: "layoutTemplate",
    title: "Website Landing Page",
    description:
      "Halaman satu halaman yang fokus mengonversi pengunjung menjadi lead atau pembeli — untuk kampanye, produk baru, atau personal branding.",
    points: ["Desain fokus konversi", "Form & CTA tertanam", "Cepat dimuat"],
  },
  {
    icon: "building2",
    title: "Website Company Profile",
    description:
      "Profil perusahaan multi-halaman profesional: visi, layanan, tim, hingga blog. Membangun kredibilitas dan kepercayaan klien sejak kunjungan pertama.",
    points: ["Multi-halaman & rapi", "Optimasi SEO", "Mudah dikelola"],
  },
  {
    icon: "monitorSmartphone",
    title: "Web App / Dashboard",
    description:
      "Aplikasi web custom dengan login, database, dan dashboard — untuk internal tim, layanan pelanggan, atau integrasi sistem bisnis.",
    points: ["Login & role pengguna", "Database & dashboard", "Integrasi API"],
  },
  {
    icon: "wrench",
    title: "Maintenance & Support",
    description:
      "Website tetap aman, cepat, dan relevan: update konten, pemantauan keamanan, backup, serta bantuan teknis berkala.",
    points: ["Update konten berkala", "Keamanan & backup", "Bantuan teknis"],
  },
  {
    icon: "clipboardCheck",
    title: "Konsultasi & Audit Website",
    description:
      "Menilai kondisi website Anda saat ini — kecepatan, SEO, keamanan, dan pengalaman pengguna — lalu menyusun rekomendasi perbaikan yang jelas dan terprioritas.",
    points: [
      "Audit kecepatan & SEO",
      "Rekomendasi prioritas",
      "Review UX & konversi",
    ],
  },
  {
    icon: "searchCheck",
    title: "SEO & Digital Marketing",
    description:
      "Optimasi konten dan teknis agar bisnis Anda mudah ditemukan di Google, sekaligus menjangkau audiens target secara efektif dan terukur.",
    points: [
      "Optimasi on-page & teknis",
      "Riset kata kunci",
      "Integrasi media sosial",
    ],
  },
];