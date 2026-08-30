import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { siteConfig } from "@/constants/site";
import { buildBreadcrumbList, JsonLdData } from "@/components/common/JsonLd";
import { buildOgImageUrl } from "@/lib/og";
import { mdxComponents } from "@/lib/mdx-components";
import { categoryToSlug, getCategories, getPost, posts } from "../_posts";
import { getRelatedPosts } from "../related";
import { formatDate, PostCard } from "../PostCard";

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug)?.frontmatter;
  if (!post) return {};
  const ogImage = buildOgImageUrl(post.title, siteConfig.tagline);
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/blog/${slug}`,
      title: post.title,
      description: post.description,
      siteName: siteConfig.name,
      publishedTime: post.date,
      authors: [post.author],
      locale: "id_ID",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${post.title} | KantongIn`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const mod = getPost(slug);
  if (!mod) notFound();

  const { frontmatter: post, content } = mod;
  const url = `${siteConfig.url}/blog/${slug}`;
  const relatedPosts = getRelatedPosts(posts, slug);
  const categoryHref = `/blog/kategori/${categoryToSlug(post.category)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "id-ID",
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
    mainEntityOfPage: url,
  };

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonLdData
        data={buildBreadcrumbList([
          { name: "Blog", url: "/blog" },
          { name: post.category, url: categoryHref },
          { name: post.title },
        ])}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:pb-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-muted"
        >
          <Link
            href="/blog"
            className="font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <span aria-hidden="true">›</span>
          <Link
            href={categoryHref}
            className="font-medium transition-colors hover:text-primary"
          >
            {post.category}
          </Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page" className="text-muted-foreground">
            {post.title}
          </span>
        </nav>

        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke blog
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4" aria-hidden="true" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(post.date)}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => {
              const isCategory = getCategories().includes(tag);
              if (isCategory) {
                return (
                  <Link
                    key={tag}
                    href={`/blog/kategori/${categoryToSlug(tag)}`}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {tag}
                  </Link>
                );
              }
              return (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </header>

        <div className="mt-10 border-t border-border pt-8">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {relatedPosts.length > 0 ? (
          <section
            aria-labelledby="artikel-terkait"
            className="mt-14 border-t border-border pt-10"
          >
            <h2
              id="artikel-terkait"
              className="text-2xl font-bold tracking-tight text-foreground"
            >
              Artikel terkait
            </h2>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <li key={related.slug} className="h-full">
                  <PostCard post={related} />
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Lihat semua artikel
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        ) : null}
      </article>
    </main>
  );
}