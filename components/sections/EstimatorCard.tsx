"use client";

import { ArrowRight, MessageSquareText } from "lucide-react";
import { useState } from "react";
import {
  PriceEstimator,
  type EstimatorSelection,
} from "@/components/common/PriceEstimator";
import { GlowCard } from "@/components/common/GlowCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { computeEstimate, encodeEstimatePayload } from "@/lib/estimator";
import { buildWhatsAppLink, estimateDirectMessage } from "@/lib/wa";

export function EstimatorCard() {
  const [selection, setSelection] = useState<EstimatorSelection>({
    serviceId: null,
    addonIds: [],
    budgetId: null,
  });

  const { serviceId, addonIds, budgetId } = selection;
  const ready = Boolean(serviceId);
  const estimate = serviceId
    ? computeEstimate(serviceId, addonIds)
    : null;

  const directLink = serviceId
    ? buildWhatsAppLink(estimateDirectMessage(serviceId, addonIds))
    : "/#contact";

  const formLink =
    serviceId && budgetId
      ? `/?estimasi=${encodeURIComponent(
          encodeEstimatePayload({ s: serviceId, a: addonIds, b: budgetId })
        )}#contact`
      : "/#contact";

  return (
    <section id="estimasi" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Estimasi Harga"
          title="Hitung Estimasi Website Anda"
          description="Pilih jenis website dan fitur tambahan untuk melihat estimasi awal. Harga final ditentukan setelah konsultasi scope — transparan, tanpa biaya tersembunyi."
        />

        <GlowCard className="mt-12 p-6 sm:p-10">
          <PriceEstimator value={selection} onChange={setSelection} />

          <div className="mt-8 flex flex-col items-stretch gap-3 border-t border-border/70 pt-8 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="rounded-full disabled:pointer-events-none"
              disabled={!ready}
            >
              <a
                href={directLink}
                onClick={(event) => {
                  if (!ready) event.preventDefault();
                }}
                target={ready ? "_blank" : undefined}
                rel={ready ? "noopener noreferrer" : undefined}
              >
                <MessageSquareText className="size-4" aria-hidden="true" />
                Kirim rincian via WhatsApp
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full disabled:pointer-events-none"
              disabled={!ready}
            >
              <a href={formLink} onClick={(event) => {
                  if (!ready) event.preventDefault();
                }}>
                Konsultasi lewat form di beranda
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            {estimate
              ? estimate.hasCustom
                ? "Termasuk komponen custom — harga final menyesuaikan scope konsultasi."
                : "Estimasi bersifat indikatif (mulai dari) — harga final ditentukan setelah diskusi scope."
              : "Pilih jenis layanan di atas untuk melihat estimasi awal."}
          </p>
        </GlowCard>
      </div>
    </section>
  );
}