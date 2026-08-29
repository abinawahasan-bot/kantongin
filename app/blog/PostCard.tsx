import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { GlowCard } from "@/components/common/GlowCard";
import { categoryToSlug, getCategories, type Post } from "./_posts";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function PostCard({ post }: { post: Post }) {
  const href = `/blog/${post.slug}`;
  const categoryHref = `/blog/kategori/${categoryToSlug(post.category)}`;

  return (
    <GlowCard className="flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
        <Link
          href={categoryHref}
          className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 font-medium text-primary transition-colors hover:border-primary/40"
        >
          {post.category}
        </Link>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {formatDate(post.date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {post.author}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-semibold leading-snug text-foreground">
        <Link href={href} className="transition-colors hover:text-primary">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {post.description}
      </p>
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
      <Link
        href={href}
        className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary"
      >
        Baca selengkapnya
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </GlowCard>
  );
}