export type MegaColumn = {
  title: string;
  items: { label: string; href: string }[];
};

export type NavItem = {
  label: string;
  href: string;
  mega?: MegaColumn[];
};

export const navItems: NavItem[] = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang Kami", href: "/tentang-kami" },
  {
    label: "Layanan",
    href: "#services",
    mega: [
      {
        title: "Pembuatan Website",
        items: [
          { label: "Lihat semua layanan", href: "/layanan" },
          { label: "E-commerce / Toko Online", href: "#services" },
          { label: "Website Landing Page", href: "#services" },
          { label: "Website Company Profile", href: "#services" },
        ],
      },
      {
        title: "Layanan Lainnya",
        items: [
          { label: "Web App / Dashboard", href: "#services" },
          { label: "Maintenance & Support", href: "#services" },
          { label: "Konsultasi Website", href: "#services" },
        ],
      },
    ],
  },
  { label: "Proses", href: "#how-it-works" },
  { label: "Portofolio", href: "#portfolio" },
  { label: "Harga", href: "/harga" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "#contact" },
];
