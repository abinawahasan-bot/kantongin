"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MessageSquareText,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  PriceEstimator,
  type EstimatorSelection,
} from "@/components/common/PriceEstimator";
import { GlowCard } from "@/components/common/GlowCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SocialIcon } from "@/components/common/SocialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/constants/site";
import {
  computeEstimate,
  decodeEstimatePayload,
  getBudget,
  getService,
} from "@/lib/estimator";
import { estimateContactSchema } from "@/lib/schemas/forms";
import { buildWhatsAppLink, estimateToWhatsAppMessage } from "@/lib/wa";
import { cn } from "@/lib/utils";

const STEPS = ["Kebutuhan", "Detail", "Kontak"] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

function StepIndicator({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Langkah konsultasi">
      {STEPS.map((label, index) => {
        const active = index === step;
        const done = index < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                done && "bg-primary text-primary-foreground",
                active && "border-2 border-primary text-primary",
                !active && !done && "border border-border text-muted"
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                active ? "text-foreground" : "text-muted"
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 ? (
              <span aria-hidden="true" className="mx-1 h-px w-4 bg-border" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function EstimateWizard() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<EstimatorSelection>({
    serviceId: null,
    addonIds: [],
    budgetId: null,
  });
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [serviceError, setServiceError] = useState<string | undefined>();
  const [selectionError, setSelectionError] = useState<string | undefined>();
  const [messageError, setMessageError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const payload = decodeEstimatePayload(searchParams.get("estimasi"));
    if (payload) {
      setSelection({
        serviceId: payload.s,
        addonIds: payload.a,
        budgetId: payload.b,
      });
    }
  }, [searchParams]);

  const service = selection.serviceId
    ? getService(selection.serviceId)
    : undefined;
  const budget = selection.budgetId ? getBudget(selection.budgetId) : undefined;
  const estimate = selection.serviceId
    ? computeEstimate(selection.serviceId, selection.addonIds)
    : undefined;

  const goNext = () => {
    if (step === 0) {
      const missingService = !selection.serviceId;
      const missingBudget = !selection.budgetId;
      setServiceError(
        missingService ? "Pilih jenis layanan dulu" : undefined
      );
      setSelectionError(missingBudget ? "Pilih perkiraan budget" : undefined);
      if (missingService || missingBudget) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      const invalid = message.trim().length < 10;
      setMessageError(invalid ? "Pesan minimal 10 karakter" : undefined);
      if (invalid) return;
      setStep(2);
    }
  };

  const goBack = () => setStep((current) => Math.max(0, current - 1));

  const onSubmit = () => {
    const parsed = estimateContactSchema.safeParse({
      name,
      email,
      service: selection.serviceId,
      addons: selection.addonIds,
      budget: selection.budgetId,
      message,
    });
    if (!parsed.success) {
      const issues = parsed.error.issues;
      setNameError(issues.find((i) => i.path[0] === "name")?.message);
      setEmailError(issues.find((i) => i.path[0] === "email")?.message);
      setServiceError(issues.find((i) => i.path[0] === "service")?.message);
      setSelectionError(issues.find((i) => i.path[0] === "budget")?.message);
      setMessageError(issues.find((i) => i.path[0] === "message")?.message);
      return;
    }
    const url = buildWhatsAppLink(estimateToWhatsAppMessage(parsed.data));
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Estimasi Harga"
          title="Hitung Estimasi Website Anda"
          description="Pilih kebutuhan Anda, lihat estimasi awal, dan kirim rinciannya ke tim kami via WhatsApp — dibalas dalam 1×24 jam kerja."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
          <motion.div {...fadeUp} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Contoh proyek &amp; testimoni di halaman ini bersifat ilustratif.
              Estimasi bersifat indikatif (mulai dari) — harga final ditentukan
              setelah konsultasi scope.
            </p>

            <GlowCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <MessageSquareText className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Cara kerjanya
                  </h3>
                  <ol className="mt-2 flex list-decimal flex-col gap-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                    <li>Pilih jenis layanan &amp; fitur tambahan.</li>
                    <li>Isi detail &amp; data kontak.</li>
                    <li>Kirim rincian ke WhatsApp kami.</li>
                  </ol>
                </div>
              </div>
            </GlowCard>

            {siteConfig.email && (
              <GlowCard className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Email
                    </h3>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="mt-1 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                    >
                      {siteConfig.email}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Untuk proposal, penawaran, dan kerja sama umum.
                    </p>
                  </div>
                </div>
              </GlowCard>
            )}

            <GlowCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    WhatsApp
                  </h3>
                  <a
                    href={buildWhatsAppLink(
                      "Halo KantongIn, saya ingin konsultasi pembuatan website."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-primary"
                  >
                    +62 857-7514-9968
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Konsultasi cepat untuk kebutuhan mendesak.
                  </p>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-6">
              <div className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Phone className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Jam respons
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Senin–Jumat, 09.00–17.00 WIB. Pesan di luar jam akan dibalas
                    pada jam kerja berikutnya.
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          <motion.div {...fadeUp}>
            <GlowCard className="h-full p-6 sm:p-8">
              <StepIndicator step={step} />

              <div className="mt-8">
                {step === 0 ? (
                  <PriceEstimator
                    value={selection}
                    onChange={setSelection}
                    serviceError={serviceError}
                    selectionError={selectionError}
                  />
                ) : null}

                {step === 1 ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="estimate-subject">Subjek</Label>
                      <Input
                        id="estimate-subject"
                        type="text"
                        readOnly
                        value={
                          service
                            ? `${service.label} — Estimasi Harga`
                            : ""
                        }
                        aria-describedby="estimate-subject-hint"
                      />
                      <p
                        id="estimate-subject-hint"
                        className="text-xs text-muted-foreground"
                      >
                        Terisi otomatis dari pilihan Anda.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="estimate-message">Pesan</Label>
                      <Textarea
                        id="estimate-message"
                        rows={6}
                        placeholder="Ceritakan kebutuhan Anda — contoh: butuh landing page untuk peluncuran produk baru bulan depan..."
                        className="resize-none"
                        aria-invalid={messageError ? true : undefined}
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                      {messageError ? (
                        <p role="alert" className="text-sm text-destructive">
                          {messageError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="estimate-name">Nama</Label>
                        <Input
                          id="estimate-name"
                          type="text"
                          placeholder="Nama Anda"
                          autoComplete="name"
                          aria-invalid={nameError ? true : undefined}
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                        {nameError ? (
                          <p role="alert" className="text-sm text-destructive">
                            {nameError}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="estimate-email">Email</Label>
                        <Input
                          id="estimate-email"
                          type="email"
                          placeholder="nama@email.com"
                          autoComplete="email"
                          aria-invalid={emailError ? true : undefined}
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                        {emailError ? (
                          <p role="alert" className="text-sm text-destructive">
                            {emailError}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div
                      aria-label="Ringkasan konsultasi"
                      className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-muted-foreground">Layanan</span>
                        <span className="text-foreground">
                          {service?.label ?? "-"}
                        </span>
                      </div>
                      {estimate && estimate.addons.length > 0 ? (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">
                            Fitur tambahan
                          </span>
                          <span className="text-foreground">
                            {estimate.addons
                              .map((addon) => addon.label)
                              .join(", ")}
                          </span>
                        </div>
                      ) : null}
                      {estimate ? (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">
                            Estimasi awal
                          </span>
                          <span className="font-semibold text-foreground">
                            {estimate.estimateLabel}
                          </span>
                        </div>
                      ) : null}
                      {budget ? (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">Budget</span>
                          <span className="text-foreground">{budget.label}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="rounded-full"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Kembali
                  </Button>
                ) : (
                  <span aria-hidden="true" />
                )}

                {step < 2 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={goNext}
                    className="rounded-full"
                  >
                    {step === 0 ? "Lanjut ke Detail" : "Lanjut ke Kontak"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={onSubmit}
                    className="rounded-full"
                  >
                    <SocialIcon
                      name="whatsapp"
                      className="size-4"
                      aria-hidden="true"
                    />
                    Kirim via WhatsApp
                  </Button>
                )}
              </div>

              {sent ? (
                <p
                  role="status"
                  className="mt-4 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  WhatsApp dibuka di tab baru. Lanjutkan dengan menekan Kirim
                  agar pesan sampai ke tim kami.
                </p>
              ) : null}
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}