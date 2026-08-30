export type Faq = {
  question: string;
  answer: string;
};

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const faqs: Faq[] = [
  {
    question: "Berapa lama pengerjaan website?",
    answer:
      "Tergantung jenisnya: Landing Page sekitar 1–2 minggu, Company Profile 2–3 minggu, dan E-commerce/Toko Online 3–6 minggu. Estimasi pasti disepakati di awal setelah konsultasi kebutuhan Anda.",
  },
  {
    question: "Bagaimana alur pembayaran proyeknya?",
    answer:
      "Alurnya sederhana dan transparan: konsultasi kebutuhan gratis, penawaran & kontrak tertulis, lalu DP 50% untuk memulai pengerjaan. Anda memeriksa hasil di tiap tahap, dan pelunasan 50% dilakukan saat website selesai.",
  },
  {
    question: "Apakah harga sudah termasuk domain & hosting?",
    answer:
      "Belum — harga paket fokus pada jasa pembuatan website. Kami membantu Anda menyiapkan domain dan hosting yang sesuai (termasuk pilihan yang hemat), dan biayanya transparan sejak awal, tanpa biaya tersembunyi.",
  },
  {
    question: "Apakah ada kontrak atau perjanjian tertulis?",
    answer:
      "Ya. Setiap proyek didampingi kontrak tertulis sederhana yang memuat lingkup pekerjaan, biaya, timeline, dan jumlah revisi. Kontrak melindungi Anda dan kami — semua kesepakatan jelas sejak awal.",
  },
  {
    question: "Bisakah saya minta revisi?",
    answer:
      "Tentu. Setiap paket menyertakan gratis revisi pada tahap desain dan pengembangan. Kami mengundang Anda memeriksa hasil di tiap tahap, jadi hasil akhir sesuai keinginan sebelum website diluncurkan.",
  },
  {
    question: "Setelah selesai, website dan aset milik siapa?",
    answer:
      "Semuanya 100% milik Anda — kode website, domain, dan hosting terdaftar atas nama Anda. Anda bebas memindahkan atau mengembangkan website dengan pihak lain kapan pun tanpa halangan.",
  },
  {
    question: "Apakah website bisa dikelola sendiri setelah selesai?",
    answer:
      "Bisa. Kami membangun website dengan sistem yang mudah dikelola dan menyertakan pelatihan admin singkat. Anda (atau tim Anda) bisa memperbarui konten, produk, dan artikel secara mandiri.",
  },
  {
    question: "Apakah layanan ini cocok untuk UMKM?",
    answer:
      "Sangat cocok. Paket Landing Page dan Company Profile dirancang khusus untuk UMKM dan bisnis yang baru go online dengan anggaran terjangkau. Untuk kebutuhan lebih besar, tersedia paket Custom / Web App.",
  },
  {
    question: "Apakah melayani klien di luar kota?",
    answer:
      "Ya. Kami melayani klien di seluruh Indonesia secara daring — konsultasi, progress, dan revisi dilakukan lewat WhatsApp atau video call, jadi lokasi bukan halangan.",
  },
  {
    question: "Apakah website sudah aman dan cepat diakses?",
    answer:
      "Ya. Setiap website kami bangun dengan standar keamanan (HTTPS, proteksi data, backup berkala) dan dioptimasi agar cepat dimuat di semua perangkat — termasuk SEO dasar agar mudah ditemukan di mesin pencari.",
  },
  {
    question: "Bagaimana dukungan setelah website diluncurkan?",
    answer:
      "Anda mendapat garansi perbaikan selama 1 bulan setelah peluncuran serta bisa memilih paket Maintenance & Support untuk update konten, pemantauan keamanan, backup, dan bantuan teknis berkala. Tim kami juga siap merespons cepat via WhatsApp.",
  },
];