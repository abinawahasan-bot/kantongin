export type Step = {
  title: string;
  description: string;
};

export type Flow = {
  id: "new-site" | "maintenance";
  label: string;
  anchorId: string;
  steps: Step[];
};

export const flows: Flow[] = [
  {
    id: "new-site",
    label: "Website Baru",
    anchorId: "website-baru",
    steps: [
      {
        title: "Konsultasi",
        description:
          "Ceritakan kebutuhan dan tujuan websitenya. Tim kami mendengarkan, memahami bisnis Anda, lalu menyusun rekomendasi paling tepat — gratis tanpa komitmen.",
      },
      {
        title: "Desain & Development",
        description:
          "Kami merancang tampilan yang sesuai identitas brand lalu mengembangkannya — responsif, cepat, dan SEO-ready. Anda bisa pantau progresnya di setiap tahap.",
      },
      {
        title: "Review & Peluncuran",
        description:
          "Anda mencoba websitenya, kami menyempurnakan detailnya. Setelah semuanya pas, website diluncurkan dan siap mendatangkan pelanggan.",
      },
      {
        title: "Optimasi & Dukungan",
        description:
          "Kami memantau performa, menjaga kecepatan dan keamanan, serta siap membantu pengembangan selanjutnya agar bisnis Anda terus bertumbuh.",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance & Support",
    anchorId: "maintenance",
    steps: [
      {
        title: "Audit Website",
        description:
          "Kami meninjau kondisi website Anda — kecepatan, keamanan, SEO, dan pengalaman pengguna — lalu menyusun prioritas perbaikan yang jelas.",
      },
      {
        title: "Perbaikan & Update",
        description:
          "Kami memperbarui konten, meng-update komponen, dan membenahi isu teknis secara berkala supaya website selalu prima dan bebas dari ancaman.",
      },
      {
        title: "Pemantauan Berkala",
        description:
          "Kami memantau uptime, backup data, dan performa secara rutin. Setiap masalah terdeteksi cepat dan ditangani sebelum mengganggu bisnis Anda.",
      },
      {
        title: "Laporan & Rekomendasi",
        description:
          "Anda menerima laporan berkala beserta rekomendasi pengembangan. Website tetap relevan seiring pertumbuhan bisnis Anda.",
      },
    ],
  },
];