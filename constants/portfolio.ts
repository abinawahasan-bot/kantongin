export type PortfolioCategory =
  | "Affiliate"
  | "Endorsement"
  | "Brand Collab"
  | "Social Media";

export type PortfolioMetric = {
  label: string;
  value: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  category: PortfolioCategory;
  result: string;
  gradient: string;
  image: string;
  imageAlt: string;
  description?: string;
  metrics?: PortfolioMetric[];
};

export const portfolioCategories: PortfolioCategory[] = [
  "Affiliate",
  "Endorsement",
  "Brand Collab",
  "Social Media",
];

export const projects: PortfolioProject[] = [
  {
    id: "glowskin-ramadan",
    title: "GlowSkin Ramadan Mega Sale",
    category: "Affiliate",
    result: "+312% ROAS",
    gradient: "from-emerald-500 to-teal-600",
    image: "/portfolio/glowskin-ramadan.jpg",
    imageAlt: "Koleksi produk skincare GlowSkin dalam kemasan elegan",
    description:
      "Kampanye affiliate Ramadan untuk brand skincare lokal. Seluruh jaringan affiliate kami meluncurkan promo dalam satu hari serentak, menghasilkan ledakan penjualan di periode paling kompetitif tahun ini.",
    metrics: [
      { label: "ROAS", value: "+312%" },
      { label: "GMV", value: "Rp 4,2 M" },
      { label: "Order", value: "18,4K" },
    ],
  },
  {
    id: "kopi-nusantara-launch",
    title: "Kopi Nusantara Affiliate Launch",
    category: "Affiliate",
    result: "Rp 1,8 M Penjualan",
    gradient: "from-amber-500 to-orange-600",
    image: "/portfolio/kopi-nusantara-launch.jpg",
    imageAlt: "Barista menuang kopi premium dengan presisi tinggi",
    description:
      "Peluncuran brand kopi premium dengan program affiliate berjenjang. Lebih dari 400 kreator membangun konten ulasan yang berubah menjadi penjualan konsisten selama tiga bulan pertama.",
    metrics: [
      { label: "Penjualan", value: "Rp 1,8 M" },
      { label: "Kreator", value: "420" },
      { label: "ROAS", value: "+278%" },
    ],
  },
  {
    id: "fitfuel-endorsement",
    title: "FitFuel Endorsement KOL",
    category: "Endorsement",
    result: "3,2 Jt Views",
    gradient: "from-violet-500 to-purple-600",
    image: "/portfolio/fitfuel-endorsement.jpg",
    imageAlt: "Atlet fitness sedang berlatih di gym dengan energi tinggi",
    description:
      "Endorsement 15 KOL fitness dan healthy lifestyle untuk brand suplemen. Konten autentik dari kreator terkurasi membangun kepercayaan sekaligus engagement tinggi pada audiens yang sangat relevan.",
    metrics: [
      { label: "Views", value: "3,2 Jt" },
      { label: "Engagement", value: "8,9%" },
      { label: "Reach", value: "1,1 Jt" },
    ],
  },
  {
    id: "pesona-wisata-series",
    title: "Pesona Wisata Endorsement Series",
    category: "Endorsement",
    result: "+45% Brand Recall",
    gradient: "from-sky-500 to-blue-600",
    image: "/portfolio/pesona-wisata-series.jpg",
    imageAlt: "Hamparan sawah berundak hijau di destinasi wisata tropis",
    description:
      "Serial endorsement destinasi wisata domestik yang melibatkan 18 kreator perjalanan. Visual memukau dan cerita lokal mengangkat kesadaran brand sekaligus mendorong pemesanan paket liburan.",
    metrics: [
      { label: "Brand Recall", value: "+45%" },
      { label: "Reach", value: "2,6 Jt" },
      { label: "KOL", value: "18" },
    ],
  },
  {
    id: "lokalkita-kedai-paman",
    title: "LokalKita x Kedai Paman Collab",
    category: "Brand Collab",
    result: "12K UGC Dibuat",
    gradient: "from-rose-500 to-pink-600",
    image: "/portfolio/lokalkita-kedai-paman.jpg",
    imageAlt: "Rak pakaian komunitas di ruang kedai kopi yang hangat",
    description:
      "Kolaborasi brand fashion lokal dengan jaringan kedai kopi untuk kampanye UGC lintas komunitas. Kampanye menghasilkan ribuan konten kreator dan ekspansi audiens yang signifikan bagi kedua brand.",
    metrics: [
      { label: "UGC", value: "12.000" },
      { label: "Engagement", value: "+63%" },
      { label: "Audiens Baru", value: "480K" },
    ],
  },
  {
    id: "technest-social",
    title: "TechNest Social Media Takeover",
    category: "Social Media",
    result: "98K Pengikut Baru",
    gradient: "from-cyan-500 to-blue-600",
    image: "/portfolio/technest-social.jpg",
    imageAlt: "Perangkat gadget modern di atas meja kerja minimalis",
    description:
      "Pengelolaan penuh media sosial brand gadget dengan strategi konten berbasis tren. Konsistensi unggahan dan interaksi aktif mengubah profil brand menjadi magnet audiens baru setiap minggunya.",
    metrics: [
      { label: "Pengikut", value: "98K" },
      { label: "Interaksi", value: "4,2 Jt" },
      { label: "Impresi", value: "12 Jt" },
    ],
  },
];
