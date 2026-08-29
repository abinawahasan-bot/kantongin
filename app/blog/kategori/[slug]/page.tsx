import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/constants/site";
import { buildOgImageUrl } from "@/lib/og";
import { categoryToSlug, getCategories, getPostsByCategory } from "../../_posts";
import { PostCard } from "../../PostCard";

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: categoryToSlug(category) }));
}

function findCategory(slug: string): string | undefined {
  return getCategories().find((category) => categoryToSlug(category) === slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};
  const description = `Semua artikel KantongIn dalam kategori ${category} — tips membangun website, landing page, toko online, dan SEO untuk UMKM.`;
  return {
    title: `${category} | Blog`,
    description,
    openGraph: {
      title: `${category} | Blog`,
      description,
      url: `${siteConfig.url}/blog/kategori/${slug}`,
      siteName: siteConfig.name,
      locale: "id_ID",
      images: [
        {
          url: buildOgImageUrl(`Kategori: ${category}`, siteConfig.tagline),
          width: 1200,
          height: 630,
          alt: `${category} | KantongIn`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category} | Blog`,
      description,
      images: [buildOgImageUrl(`Kategori: ${category}`, siteConfig.tagline)],
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const categoryPosts = getPostsByCategory(category);

  return (
    <main id="main" tabIndex={-1}>
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pb-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke blog
        </Link>

        <div className="mt-8 flex max-w-3xl flex-col gap-4">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Blog / Kategori
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {category}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {categoryPosts.length > 1
              ? `${categoryPosts.length} artikel dalam kategori ${category}.`
              : `1 artikel dalam kategori ${category}.`}{" "}
            Jelajahi wawasan lain seputar website, e-commerce, dan digital marketing.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <li key={post.slug} className="h-full">
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}