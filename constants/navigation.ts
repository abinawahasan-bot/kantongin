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
  {
    label: "Layanan",
    href: "#services",
    mega: [
      {
        title: "Kolaborasi Kreator",
        items: [
          { label: "Affiliate Marketing", href: "#services" },
          { label: "Open Promotion", href: "#services" },
          { label: "Endorsement / KOL", href: "#services" },
        ],
      },
      {
        title: "Brand & Kampanye",
        items: [
          { label: "Brand Collaboration", href: "#services" },
          { label: "Social Media Management", href: "#services" },
          { label: "Digital Campaign Strategy", href: "#services" },
          { label: "Content Production", href: "#services" },
        ],
      },
    ],
  },
  { label: "Portofolio", href: "#portfolio" },
  { label: "Affiliate", href: "#affiliate" },
  { label: "Kreator", href: "#creators" },
  { label: "Harga", href: "#pricing" },
  { label: "Blog", href: "#faq" },
  { label: "Kontak", href: "#contact" },
];
