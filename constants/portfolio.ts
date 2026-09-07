export type PortfolioCategory =
  | "E-commerce"
  | "Company Profile"
  | "Landing Page"
  | "Web App";

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
  featured?: boolean;
};

export const portfolioCategories: PortfolioCategory[] = [
  "E-commerce",
  "Company Profile",
  "Landing Page",
  "Web App",
];

export const projects: PortfolioProject[] = [
  {
    id: "rumahkreasi-toko-online",
    title: "RumahKreasi Fashion Store",
    category: "E-commerce",
    result: "2x Penjualan Online",
    gradient: "from-rose-500 to-pink-600",
    featured: true,
    image: "/portfolio/lokalkita-kedai-paman.jpg",
    imageAlt: "Rak pakaian komunitas di ruang kedai kopi yang hangat",
    description:
      "Toko online fashion dengan katalog produk, keranjang belanja, dan integrasi payment gateway. Website responsif yang membuat belanja terasa mudah di semua perangkat.",
    metrics: [
      { label: "Penjualan", value: "+2x" },
      { label: "PageSpeed", value: "96" },
      { label: "Produk", value: "1.200" },
    ],
  },
  {
    id: "kopikita-online",
    title: "KopiKita Online",
    category: "E-commerce",
    result: "Rp 250 Jt GMV",
    gradient: "from-amber-500 to-orange-600",
    image: "/portfolio/kopi-nusantara-launch.jpg",
    imageAlt: "Barista menuang kopi premium dengan presisi tinggi",
    description:
      "Toko online untuk brand F&B dengan sistem pemesanan, pembayaran digital, dan integrasi ongkir. Pesanan masuk otomatis dan mudah dikelola dari satu panel.",
    metrics: [
      { label: "GMV", value: "Rp 250 Jt" },
      { label: "Order", value: "9.400" },
      { label: "Konversi", value: "3,1%" },
    ],
  },
  {
    id: "sembakoid-marketplace",
    title: "SembakoID Grocery",
    category: "E-commerce",
    result: "60% Lead Meningkat",
    gradient: "from-emerald-500 to-teal-600",
    image: "/portfolio/glowskin-ramadan.jpg",
    imageAlt: "Koleksi produk dalam kemasan elegan di rak penyimpanan",
    description:
      "Toko online grosir dengan pencarian produk, keranjang, dan checkout cepat. Fitur stok dan laporan penjualan memudahkan tim mengelola ribuan SKU.",
    metrics: [
      { label: "Lead", value: "+60%" },
      { label: "SKU", value: "5.000" },
      { label: "SEO Rank", value: "Top 5" },
    ],
  },
  {
    id: "klinik-sehat-profile",
    title: "Klinik Sehat Pro",
    category: "Company Profile",
    result: "8x Jadwal Booking",
    gradient: "from-sky-500 to-blue-600",
    image: "/portfolio/fitfuel-endorsement.jpg",
    imageAlt: "Suasana sehat dengan atlet berlatih dengan energi tinggi",
    description:
      "Company profile klinik dengan halaman layanan, tim dokter, dan form booking online. Desain bersih dan terpercaya yang meningkatkan kepercayaan pasien.",
    metrics: [
      { label: "Booking", value: "8x" },
      { label: "PageSpeed", value: "98" },
      { label: "Halaman", value: "7" },
    ],
  },
  {
    id: "nusaproperti-landing",
    title: "NusaProperti Landing",
    category: "Landing Page",
    result: "2,4x Lead Properti",
    gradient: "from-violet-500 to-purple-600",
    featured: true,
    image: "/portfolio/pesona-wisata-series.jpg",
    imageAlt: "Hamparan lahan luas dengan pemandangan hijau di destinasi tropis",
    description:
      "Landing page properti dengan galeri unit, simulasi kredit, dan form lead yang terhubung WhatsApp. Fokus konversi membuat tim sales lebih mudah menindaklanjuti prospek.",
    metrics: [
      { label: "Lead", value: "2,4x" },
      { label: "Konversi", value: "4,8%" },
      { label: "Speed", value: "0,9s" },
    ],
  },
  {
    id: "financehub-webapp",
    title: "FinanceHub Dashboard",
    category: "Web App",
    result: "40% Hemat Admin",
    gradient: "from-cyan-500 to-blue-600",
    image: "/portfolio/technest-social.jpg",
    imageAlt: "Perangkat gadget modern di atas meja kerja minimalis",
    description:
      "Web app dashboard keuangan dengan login multi-role, laporan real-time, dan integrasi API. Proses manual digantikan alur otomatis yang lebih cepat dan akurat.",
    metrics: [
      { label: "Efisiensi", value: "+40%" },
      { label: "Pengguna", value: "210" },
      { label: "Uptime", value: "99,9%" },
    ],
  },
];