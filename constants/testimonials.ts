export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Tim KantongIn bukan sekadar eksekutor, mereka partner strategis. Dalam tiga bulan, brand awareness kami melonjak dan penjualan nyaris tiga kali lipat — sesuatu yang tak pernah kami capai dengan agensi sebelumnya.",
    name: "Rina Wijaya",
    role: "Founder",
    company: "Kopi Selatan",
    rating: 5,
  },
  {
    quote:
      "Kolaborasi kreator yang mereka kurasi benar-benar memahami DNA brand kami. Setiap konten terasa otentik dan alami, dan itu tercermin dari engagement yang konsisten tinggi sepanjang kampanye.",
    name: "Dina Prameswari",
    role: "Brand Manager",
    company: "Aura Beauty",
    rating: 5,
  },
  {
    quote:
      "Sebagai kreator, saya menghargai brief yang jelas dan tim yang memberi ruang untuk berekspresi. KantongIn membuat proses kolaborasi terasa mudah, profesional, dan menyenangkan dari awal sampai tuntas.",
    name: "Bagas Aditya",
    role: "Kreator Konten",
    company: "Studio Piksel",
    rating: 5,
  },
  {
    quote:
      "Sistem affiliate yang transparan dan pembayaran yang selalu tepat waktu membuat saya serius. Komisi yang mengalir konsisten setiap bulan kini menjadi salah satu sumber penghasilan utama saya.",
    name: "Sari Handayani",
    role: "Affiliate Marketer",
    company: "Belanja Bahagia",
    rating: 4,
  },
  {
    quote:
      "Untuk startup dengan tim yang kecil, KantongIn terasa seperti departemen marketing sendiri. Laporan yang terukur dan rekomendasi berbasis data membantu kami mengalokasikan budget dengan jauh lebih cerdas.",
    name: "Andi Pratama",
    role: "Chief Marketing Officer",
    company: "Brankas Digital",
    rating: 5,
  },
];
