"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageSquareText, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GlowCard } from "@/components/common/GlowCard";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SocialIcon } from "@/components/common/SocialIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/constants/site";
import { contactSchema, type ContactValues } from "@/lib/schemas/forms";
import { buildWhatsAppLink, contactToWhatsAppMessage } from "@/lib/wa";

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });
  const [sent, setSent] = useState(false);

  const onSubmit = (values: ContactValues) => {
    const url = buildWhatsAppLink(contactToWhatsAppMessage(values));
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    reset();
  };

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const;

  return (
    <section id="contact" className="scroll-mt-28">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Kontak"
          title="Ayo bicarakan proyek Anda"
          description="Ceritakan kebutuhan website Anda, dan tim kami akan merespons dalam 1×24 jam kerja."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <motion.div {...fadeUp} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Contoh proyek &amp; testimoni di halaman ini bersifat ilustratif.
            </p>
            {siteConfig.email && (
              <GlowCard className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Email</h3>
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
                  <h3 className="text-sm font-semibold text-foreground">WhatsApp</h3>
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
                  <MessageSquareText className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Jam respons</h3>
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
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-name">Nama</Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Nama Anda"
                      autoComplete="name"
                      aria-invalid={errors.name ? true : undefined}
                      {...register("name")}
                    />
                    {errors.name ? (
                      <p role="alert" className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="nama@email.com"
                      autoComplete="email"
                      aria-invalid={errors.email ? true : undefined}
                      {...register("email")}
                    />
                    {errors.email ? (
                      <p role="alert" className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-service">Jenis Layanan</Label>
                    <select
                      id="contact-service"
                      className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-invalid={errors.service ? true : undefined}
                      {...register("service")}
                    >
                      <option value="">Pilih jenis layanan...</option>
                      <option>Landing Page</option>
                      <option>Company Profile</option>
                      <option>E-commerce / Toko Online</option>
                      <option>Web App / Dashboard</option>
                      <option>Maintenance & Support</option>
                      <option>Lainnya</option>
                    </select>
                    {errors.service ? (
                      <p role="alert" className="text-sm text-destructive">
                        {errors.service.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-subject">Subjek</Label>
                    <Input
                      id="contact-subject"
                      type="text"
                      placeholder="Contoh: Proyek website"
                      aria-invalid={errors.subject ? true : undefined}
                      {...register("subject")}
                    />
                    {errors.subject ? (
                      <p role="alert" className="text-sm text-destructive">
                        {errors.subject.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Label htmlFor="contact-message">Pesan</Label>
                  <Textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Ceritakan kebutuhan Anda..."
                    className="resize-none"
                    aria-invalid={errors.message ? true : undefined}
                    {...register("message")}
                  />
                  {errors.message ? (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                >
                  <SocialIcon name="whatsapp" className="size-4" aria-hidden="true" />
                  Kirim via WhatsApp
                </Button>

                {sent ? (
                  <p
                    role="status"
                    className="mt-4 text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    WhatsApp dibuka di tab baru. Lanjutkan dengan menekan Kirim
                    agar pesan sampai ke tim kami.
                  </p>
                ) : null}
              </form>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
