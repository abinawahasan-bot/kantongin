import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description:
    "Ketentuan penggunaan layanan KantongIn untuk klien dan mitra kolaborasi.",
};

export default function SyaratKetentuanPage() {
  return (
    <LegalPage title="Syarat & Ketentuan" updated="23 Agustus 2026">
      <h2>Penerimaan Ketentuan</h2>
      <p>
        Dengan mengakses situs KantongIn atau menggunakan layanan kami, Anda menyatakan telah
        membaca, memahami, dan menyetujui syarat dan ketentuan ini. Jika Anda tidak setuju,
        mohon hentikan penggunaan layanan.
      </p>

      <h2>Layanan Kami</h2>
      <p>
        KantongIn menyediakan jasa pemasaran digital yang meliputi affiliate marketing,
        endorsement, kolaborasi dengan kreator, social media management, strategi kampanye
        digital, dan produksi konten. Ruang lingkup spesifik setiap layanan diatur dalam
        proposal atau perjanjian kerja sama tersendiri.
      </p>

      <h2>Kewajiban Klien</h2>
      <ul>
        <li>Menyediakan informasi, materi, dan akses yang akurat dan sah sesuai kebutuhan proyek.</li>
        <li>Memberikan persetujuan atau umpan balik dalam waktu yang disepakati.</li>
        <li>Melakukan pembayaran sesuai jadwal dan nominal dalam perjanjian.</li>
        <li>Memastikan produk atau layanan yang dipromosikan tidak melanggar hukum.</li>
      </ul>

      <h2>Pembayaran</h2>
      <p>
        Biaya layanan, termin pembayaran, dan mekanisme penagihan ditetapkan dalam proposal
        atau invoice resmi. Pembayaran yang terlambat dapat berdampak pada penjadwalan ulang
        pekerjaan atau penundaan penyerahan hasil.
      </p>

      <h2>Hak Kekayaan Intelektual</h2>
      <p>
        Seluruh konten, merek, dan materi pada situs ini merupakan milik KantongIn atau
        pemberi lisensinya. Hak atas hasil kerja yang diproduksi untuk klien beralih
        sesuai kesepakatan tertulis setelah seluruh kewajiban pembayaran diselesaikan.
      </p>

      <h2>Batasan Tanggung Jawab</h2>
      <p>
        Layanan disediakan apa adanya. Kami tidak bertanggung jawab atas kerugian tidak
        langsung, kehilangan keuntungan, atau dampak yang timbul di luar kendali kami,
        termasuk perubahan algoritma platform pihak ketiga. Tanggung jawab kami dibatasi
        maksimal sebesar nilai layanan yang telah dibayarkan untuk periode terkait.
      </p>

      <h2>Perubahan Ketentuan</h2>
      <p>
        Kami dapat memperbarui syarat dan ketentuan ini sewaktu-waktu. Versi terbaru akan
        diterbitkan di halaman ini beserta tanggal pembaruan. Penggunaan layanan setelah
        perubahan berlaku dianggap sebagai persetujuan atas ketentuan yang diperbarui.
      </p>

      <h2>Kontak</h2>
      <p>
        Pertanyaan mengenai ketentuan ini dapat dikirimkan ke{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <blockquote>
        Dokumen ini adalah template awal — sesuaikan dengan praktik nyata sebelum digunakan
        produksi.
      </blockquote>
    </LegalPage>
  );
}
