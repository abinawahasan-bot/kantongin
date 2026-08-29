export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  result: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Dulu usaha kami ada di marketplace, sekarang punya toko online sendiri. Dalam dua bulan sejak website diluncurkan, penjualan online naik hampir dua kali lipat dan pelanggan bisa checkout langsung 24 jam.",
    name: "Rina Wijaya",
    role: "Founder",
    company: "Kopi Selatan",
    rating: 5,
    result: "Penjualan online naik 2x dalam 2 bulan",
  },
  {
    quote:
      "Website toko kami terasa beda — cepat, rapi, dan mudah dikelola sendiri. Tim KantongIn juga mengajarkan cara update produk, jadi kami tidak bergantung pada siapa pun.",
    name: "Dina Prameswari",
    role: "Owner",
    company: "Aura Beauty",
    rating: 5,
    result: "Kelola toko online secara mandiri",
  },
  {
    quote:
      "Butuh company profile yang kredibel untuk pitching ke investor. Hasilnya melebihi ekspektasi — desainnya profesional, dimuat cepat, dan sejak website tayang banyak klien baru yang menghubungi kami.",
    name: "Andi Pratama",
    role: "Chief Marketing Officer",
    company: "Brankas Digital",
    rating: 5,
    result: "Lebih banyak klien baru sejak website tayang",
  },
  {
    quote:
      "Landing page untuk kampanye produk baru kami selesai tepat waktu dan benar-benar mengonversi. Form yang dulu sepi sekarang penuh, dan tim sales tinggal menindaklanjuti lead yang masuk.",
    name: "Sari Handayani",
    role: "Kepala Operasional",
    company: "Belanja Bahagia",
    rating: 4,
    result: "Lead kampanye meningkat 60%",
  },
  {
    quote:
      "Paket maintenance bikin tenang — website kami selalu aman, cepat, dan kontennya tetap segar. Ada masalah, direspons cepat. Rasanya seperti punya tim IT sendiri.",
    name: "Bagas Aditya",
    role: "Founder",
    company: "Studio Piksel",
    rating: 5,
    result: "Website aman & terawat tanpa ribet",
  },
];