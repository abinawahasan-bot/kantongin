export type Stat = {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
};

export const stats: Stat[] = [
  { value: 350, suffix: "+", label: "Kampanye Berjalan" },
  { value: 120, suffix: "+", label: "Brand & UMKM" },
  { value: 850, suffix: "+", label: "Kreator Bergabung" },
  { value: 60, suffix: "rb", label: "Affiliates Aktif" },
  { value: 2.5, suffix: "M", decimals: 1, label: "Rupiah Komisi Disalurkan" },
];
