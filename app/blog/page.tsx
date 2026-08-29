import type { Metadata } from "next";
import { siteConfig } from "@/constants/site";
import { buildOgImageUrl } from "@/lib/og";
import { posts } from "./_posts";
import { PostCard } from "./PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips membangun website, landing page, toko online, dan SEO untuk UMKM serta brand dari tim KantongIn.",
  openGraph: {
    title: "Blog | KantongIn",
    description:
      "Tips membangun website, landing page, toko online, dan SEO untuk UMKM serta brand dari tim KantongIn.",
    images: [
      {
        url: buildOgImageUrl("Wawasan & strategi terbaru", siteConfig.tagline),
        width: 1200,
        height: 630,
        alt: "Wawasan & strategi terbaru | KantongIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | KantongIn",
    description:
      "Tips membangun website, landing page, toko online, dan SEO untuk UMKM serta brand dari tim KantongIn.",
    images: [buildOgImageUrl("Wawasan & strategi terbaru", siteConfig.tagline)],
  },
};

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
            <li key={post.slug} className="h-full">
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}