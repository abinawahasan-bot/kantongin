export type Stat = {
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
};

export const stats: Stat[] = [
  { value: 120, suffix: "+", label: "Website Selesai" },
  { value: 45, suffix: "+", label: "Brand & UMKM" },
  { value: 4.9, suffix: "", decimals: 1, label: "Rating Klien" },
  { value: 2, suffix: "+", label: "Tahun Pengalaman" },
  { value: 98, suffix: "%", label: "Klien Merekomendasikan" },
];
