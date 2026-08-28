import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Kebijakan Cookie",
  description:
    "Bagaimana KantongIn menggunakan cookie dan cara Anda mengelolanya.",
};

export default function KebijakanCookiePage() {
  return (
    <LegalPage title="Kebijakan Cookie" updated="23 Agustus 2026">
      <h2>Apa Itu Cookie</h2>
      <p>
        Cookie adalah berkas kecil yang disimpan oleh browser di perangkat Anda saat
        mengunjungi sebuah situs. Cookie membantu situs berfungsi dengan baik, mengingat
        preferensi Anda, dan memberikan gambaran tentang bagaimana situs digunakan.
      </p>

      <h2>Jenis Cookie yang Kami Gunakan</h2>
      <ul>
        <li>
          <strong>Cookie fungsional:</strong> diperlukan agar situs dapat beroperasi, seperti
          menyimpan status sesi dan preferensi tampilan.
        </li>
        <li>
          <strong>Cookie analitik:</strong> membantu kami memahami interaksi pengunjung
          secara agregat, misalnya halaman yang paling sering diakses, sehingga situs dapat
          ditingkatkan.
        </li>
      </ul>

      <h2>Cara Mengelola Cookie di Browser</h2>
      <p>
        Anda dapat menerima, menolak, atau menghapus cookie melalui pengaturan browser Anda
        (umumnya pada menu privasi atau keamanan). Perlu dicatat bahwa memblokir cookie
        fungsional dapat membuat sebagian fitur situs tidak bekerja sebagaimana mestinya.
        Panduan lengkap tersedia di halaman bantuan masing-masing browser.
      </p>

      <h2>Kontak</h2>
      <p>
        Pertanyaan tentang penggunaan cookie dapat disampaikan ke{" "}
        {siteConfig.email ? (
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        ) : (
          <span>kanal kontak yang tersedia di halaman beranda</span>
        )}
        .
      </p>

      <blockquote>
        Dokumen ini adalah template awal — sesuaikan dengan praktik nyata sebelum digunakan
        produksi.
      </blockquote>
    </LegalPage>
  );
}
