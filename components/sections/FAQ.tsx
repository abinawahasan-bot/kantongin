"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { faqs } from "@/constants/faqs";

export function FAQ() {
  const [query, setQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section id="faq" className="relative scroll-mt-28 py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            description="Masih ragu? Temukan jawaban tentang layanan, pembayaran komisi, dan cara bergabung bersama KantongIn."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-12">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pertanyaan..."
              aria-label="Cari pertanyaan yang sering diajukan"
              className="h-12 rounded-full border-border bg-surface pl-11 pr-4 text-sm"
            />
          </div>

          <div className="mt-8">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger className="text-left text-base font-semibold text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16 text-center">
                <SearchX className="size-8 text-muted" aria-hidden="true" />
                <p className="text-base font-semibold text-foreground">Tidak ada hasil ditemukan</p>
                <p className="text-sm text-muted-foreground">
                  Coba kata kunci lain, atau hubungi tim kami untuk pertanyaan lebih lanjut.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
