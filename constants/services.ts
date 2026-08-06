export type Service = {
  icon: string;
  title: string;
  description: string;
  points?: string[];
};

export const services: Service[] = [
  {
    icon: "handshake",
    title: "Affiliate Marketing",
    description:
      "Jalankan program affiliate yang terukur. Kami menghubungkan brand dan UMKM dengan ribuan affiliate aktif — bayar komisi hanya saat penjualan benar-benar terjadi.",
    points: [
      "Komisi berbasis performa",
      "Pelacakan real-time",
      "Akses ribuan affiliate terkurasi",
    ],
  },
  {
    icon: "megaphone",
    title: "Open Promotion",
    description:
      "Sebarkan pesan brand-mu ke audiens luas lewat slot open promo di jaringan kreator terkurasi, tanpa perlu riset kreator satu per satu.",
    points: ["Jangkauan luas & cepat", "Kreator terkurasi", "Laporan performa transparan"],
  },
  {
    icon: "star",
    title: "Endorsement / KOL",
    description:
      "Bangun kepercayaan dengan endorsement dari kreator yang relevan dan kredibel. Kami memilihkan KOL yang selaras dengan nilai dan audiens brand-mu.",
  },
  {
    icon: "users",
    title: "Brand Collaboration",
    description:
      "Ciptakan kolaborasi brand-to-brand dan co-marketing yang saling menguntungkan, untuk menjangkau audiens baru dan memperkuat posisi brand di pasar.",
    points: ["Sinergi antar brand", "Ide kolaborasi kreatif", "Ekspansi audiens"],
  },
  {
    icon: "share2",
    title: "Social Media Management",
    description:
      "Kelola kehadiran media sosial brand-mu secara profesional — konten konsisten, jadwal teratur, dan interaksi aktif yang membangun komunitas.",
  },
  {
    icon: "target",
    title: "Digital Campaign Strategy",
    description:
      "Rancang strategi kampanye digital berbasis data yang tepat sasaran, mulai dari riset audiens, pemilihan channel, hingga optimalisasi anggaran iklan.",
    points: ["Riset audiens mendalam", "Pemilihan channel tepat", "Optimasi anggaran"],
  },
  {
    icon: "clapperboard",
    title: "Content Production",
    description:
      "Produksi konten berkualitas tinggi — video, foto, dan reels — yang siap memperkuat citra brand di setiap platform dan memikat audiens.",
  },
];
