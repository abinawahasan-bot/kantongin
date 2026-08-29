import { siteConfig } from "@/constants/site";
import type { ContactValues } from "@/lib/schemas/forms";

export function waNumber(): string {
  return siteConfig.socials.whatsapp.match(/wa\.me\/(\d+)/)?.[1] ?? "";
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(message)}`;
}

export function contactToWhatsAppMessage(values: ContactValues): string {
  return [
    "Halo KantongIn, saya tertarik jasa pembuatan website!",
    "",
    `Nama: ${values.name}`,
    `Email: ${values.email}`,
    `Jenis Layanan: ${values.service}`,
    `Subjek: ${values.subject}`,
    `Pesan: ${values.message}`,
  ].join("\n");
}