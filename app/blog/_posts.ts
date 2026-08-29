import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
};

export const postFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string().trim().min(1),
  category: z.string().trim().min(1),
  tags: z.array(z.string()),
});

export function parseFrontmatter(
  slug: string,
  data: unknown
): PostFrontmatter {
  const result = postFrontmatterSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Frontmatter tidak valid: ${slug} (${issues})`);
  }
  return result.data;
}

export type Post = PostFrontmatter & { slug: string };

export type PostContent = { frontmatter: PostFrontmatter; content: string };

const POSTS_DIR = path.join(process.cwd(), "app", "blog", "_posts");

function readPostFile(slug: string): PostContent | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: parseFrontmatter(slug, data), content };
}

function listSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export const posts: Post[] = listSlugs()
  .map((slug) => {
    const post = readPostFile(slug);
    if (!post) throw new Error(`Frontmatter tidak valid: ${slug}`);
    return { ...post.frontmatter, slug };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): PostContent | null {
  if (!posts.some((post) => post.slug === slug)) return null;
  return readPostFile(slug);
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCategories(): string[] {
  return [...new Set(posts.map((p) => p.category))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getPostsByCategory(category: string): Post[] {
  return posts.filter((p) => p.category === category);
}
