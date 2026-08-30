export const siteConfig = {
  name: "KantongIn",
  tagline: "Jasa Pembuatan Website Profesional",
  description:
    "KantongIn membantu UMKM, startup, dan brand tampil profesional lewat jasa pembuatan website — landing page, company profile, toko online, hingga web app.",
  // CATATAN: `kantongin.com` bukan milik kami. URL di bawah memakai deployment
  // Vercel aktif; ubah saat punya domain sendiri. Email bisnis ditampilkan via
  // mailto; semua lead mengalir ke WhatsApp (tanpa jalur email backend).
  url: "https://kantongin-beige.vercel.app",
  email: "abinawahasan@gmail.com",
  socials: {
    instagram: "https://instagram.com/kantonginofc",
    tiktok: "https://tiktok.com/@kantonginofc",
    whatsapp: "https://wa.me/6285775149968",
  },
  analytics: {
    // Custom events Vercel dikoleksi di plan Pro; di Hobby kode tetap berjalan
    // tanpa error namun data tidak tampil di dashboard.
    enabled: true,
  },
} as const;
