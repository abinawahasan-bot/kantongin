import { SocialIcon } from "@/components/common/SocialIcon";
import { buildWhatsAppLink } from "@/lib/wa";

const WA_CHAT_MESSAGE = "Halo KantongIn, saya ingin konsultasi pembuatan website.";

export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppLink(WA_CHAT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan tim KantongIn via WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <SocialIcon name="whatsapp" className="size-6" />
    </a>
  );
}