export type Step = {
  title: string;
  description: string;
};

export type Flow = {
  id: "brand" | "creator";
  label: string;
  anchorId: string;
  steps: Step[];
};

export const flows: Flow[] = [
  {
    id: "brand",
    label: "Untuk Brand",
    anchorId: "affiliate",
    steps: [
      {
        title: "Konsultasi",
        description:
          "Ceritakan tujuan dan kebutuhan kampanyemu. Tim kami mendengarkan, menggali target audiens, lalu menyusun pendekatan yang paling tepat untuk brand-mu.",
      },
      {
        title: "Briefing & Strategi",
        description:
          "Kami menyusun brief lengkap, memilih kreator yang relevan, dan merancang strategi eksekusi — semua disepakati bersama sebelum kampanye berjalan.",
      },
      {
        title: "Peluncuran Kampanye",
        description:
          "Kampanye tayang serentak di jaringan kreator terkurasi. Tim kami memantau performa secara real-time dan memastikan semuanya berjalan sesuai rencana.",
      },
      {
        title: "Report & Optimasi",
        description:
          "Terima laporan performa yang transparan dan terukur. Kami menganalisis hasil lalu mengoptimasi strategi untuk hasil yang lebih baik di kampanye berikutnya.",
      },
    ],
  },
  {
    id: "creator",
    label: "Untuk Kreator",
    anchorId: "creators",
    steps: [
      {
        title: "Daftar & Verifikasi",
        description:
          "Daftarkan akun kreatormu dalam hitungan menit. Tim kami memverifikasi profil dan kualitas kontenmu untuk bergabung ke jaringan kreator terkurasi.",
      },
      {
        title: "Pilih Kolaborasi",
        description:
          "Jelajahi kampanye brand yang sesuai dengan gaya dan audiensmu. Pilih kolaborasi yang kamu sukai dengan komisi yang jelas sejak awal.",
      },
      {
        title: "Terbitkan Konten",
        description:
          "Buat dan terbitkan konten sesuai brief. Kode pelacakan memastikan setiap klik dan penjualan tercatat otomatis, tanpa perlu rekap manual.",
      },
      {
        title: "Raih Komisi",
        description:
          "Pantau performa kontenmu secara real-time dan raih komisi dari setiap penjualan yang berhasil. Komisi bisa dicairkan kapan saja.",
      },
    ],
  },
];
