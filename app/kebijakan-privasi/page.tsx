import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Bagaimana KantongIn mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

export default function KebijakanPrivasiPage() {
  return (
    <LegalPage title="Kebijakan Privasi" updated="23 Agustus 2026">
      <h2>Identitas Pengendali Data</h2>
      <p>
        Pengendali data pribadi atas layanan KantongIn adalah <strong>[Nama Entitas]</strong>,
        badan hukum yang berdomisili di Indonesia dan bertanggung jawab atas pemrosesan data
        pribadi Anda sebagaimana dijelaskan dalam kebijakan ini.
      </p>

      <h2>Jenis Data yang Kami Kumpulkan</h2>
      <ul>
        <li>Data identitas: nama lengkap, alamat email, dan nomor telepon.</li>
        <li>Data bisnis: nama brand, jenis usaha, dan kebutuhan kampanye.</li>
        <li>Data teknis: alamat IP, jenis perangkat, browser, dan halaman yang dikunjungi.</li>
        <li>Korespondensi yang Anda kirimkan melalui formulir kontak atau newsletter.</li>
      </ul>

      <h2>Tujuan Penggunaan Data</h2>
      <p>Kami memproses data pribadi Anda untuk:</p>
      <ul>
        <li>Menanggapi permintaan konsultasi dan penawaran layanan.</li>
        <li>Mengelola kerja sama kampanye dan komunikasi operasional.</li>
        <li>Mengirimkan materi pemasaran bila Anda berlangganan newsletter.</li>
        <li>Meningkatkan kualitas, keamanan, dan performa situs.</li>
      </ul>

      <h2>Dasar Hukum Pemrosesan</h2>
      <p>
        Kami memproses data pribadi berdasarkan persetujuan Anda, pelaksanaan perjanjian
        kontraktual, kepentingan sah kami dalam mengoperasikan layanan, serta ketentuan
        peraturan perundang-undangan yang berlaku di Indonesia.
      </p>

      <h2>Berbagi Data dengan Pihak Ketiga</h2>
      <p>
        Kami tidak menjual data pribadi Anda. Data hanya dibagikan kepada penyedia layanan
        pendukung (misalnya hosting, analitik, atau layanan email) sepanjang diperlukan untuk
        tujuan di atas, atau bila diwajibkan oleh hukum.
      </p>

      <h2>Hak Anda sebagai Subjek Data</h2>
      <ul>
        <li>Mengakses dan memperoleh salinan data pribadi yang kami proses.</li>
        <li>Meminta perbaikan data yang tidak akurat atau tidak lengkap.</li>
        <li>Meminta penghapusan data pribadi dalam kondisi tertentu.</li>
        <li>Menarik persetujuan pemrosesan dan menolak komunikasi pemasaran.</li>
      </ul>

      <h2>Retensi Data</h2>
      <p>
        Data pribadi disimpan selama diperlukan untuk memenuhi tujuan pemrosesan, kewajiban
        hukum, atau penyelesaian sengketa. Setelah tidak diperlukan, data akan dihapus atau
        dianonimkan secara aman.
      </p>

      <h2>Kontak</h2>
      <p>
        Untuk pertanyaan atau permintaan terkait kebijakan ini, hubungi kami di{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>

      <blockquote>
        Dokumen ini adalah template awal — sesuaikan dengan praktik nyata sebelum digunakan
        produksi.
      </blockquote>
    </LegalPage>
  );
}
