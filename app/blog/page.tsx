import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { posts } from "./_posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips membangun website, landing page, toko online, dan SEO untuk UMKM serta brand dari tim KantongIn.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogPage() {
  return (
    <main id="main" tabIndex={-1}>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28">
        <div className="flex max-w-3xl flex-col gap-4">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Blog
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Wawasan &amp; strategi terbaru
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Tips praktis seputar website, landing page, toko online, dan optimasi
            SEO untuk membantu bisnis Anda tampil profesional dan bertumbuh.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <GlowCard className="flex h-full flex-col p-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" aria-hidden="true" />
                      {formatDate(post.date)}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" aria-hidden="true" />
                      {post.author}
                    </span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary">
                    Baca selengkapnya
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </GlowCard>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
