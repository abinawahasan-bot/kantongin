import { siteConfig } from "@/constants/site";
import type { ContactValues, EstimateContactValues } from "@/lib/schemas/forms";
import {
  computeEstimate,
  formatRp,
  getBudget,
  type EstimatorAddonId,
  type EstimatorServiceId,
} from "@/lib/estimator";

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

export function estimateToWhatsAppMessage(values: EstimateContactValues): string {
  const estimate = computeEstimate(values.service, values.addons);
  const budget = getBudget(values.budget);
  const addonLines = estimate.addons.map((addon) =>
    addon.price === null
      ? `• ${addon.label} (custom)`
      : `• ${addon.label} (+${formatRp(addon.price)})`
  );

  return [
    "Halo KantongIn, saya ingin konsultasi pembuatan website!",
    "",
    `Nama: ${values.name}`,
    `Email: ${values.email}`,
    `Jenis Layanan: ${estimate.service.label}`,
    addonLines.length > 0
      ? `Fitur tambahan:\n${addonLines.join("\n")}`
      : "Fitur tambahan: -",
    `Estimasi awal: ${estimate.estimateLabel}`,
    `Budget: ${budget?.label ?? "-"}`,
    `Pesan: ${values.message}`,
    "",
    "(angka estimasi & fitur dapat berubah setelah konsultasi scope)",
  ].join("\n");
}

export function estimateDirectMessage(
  serviceId: EstimatorServiceId,
  addonIds: EstimatorAddonId[]
): string {
  const estimate = computeEstimate(serviceId, addonIds);
  const addonLines = estimate.addons.map((addon) =>
    addon.price === null
      ? `• ${addon.label} (custom)`
      : `• ${addon.label} (+${formatRp(addon.price)})`
  );

  return [
    "Halo KantongIn, saya ingin konsultasi pembuatan website!",
    "",
    `Jenis Layanan: ${estimate.service.label}`,
    addonLines.length > 0
      ? `Fitur tambahan:\n${addonLines.join("\n")}`
      : "Fitur tambahan: -",
    `Estimasi awal: ${estimate.estimateLabel}`,
    "",
    "(angka estimasi & fitur dapat berubah setelah konsultasi scope)",
  ].join("\n");
}