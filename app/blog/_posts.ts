import type { ComponentType } from "react";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
};

type PostModule = {
  frontmatter: PostFrontmatter;
  default: ComponentType;
};

const modules = import.meta.glob("./_posts/*.mdx", {
  eager: true,
}) as Record<string, PostModule>;

export type Post = PostFrontmatter & { slug: string };

export const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.match(/\.\/_posts\/(.+)\.mdx$/)?.[1] ?? "",
    ...mod.frontmatter,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return modules[`./_posts/${slug}.mdx`] ?? null;
}
