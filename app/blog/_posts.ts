import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
};

export type Post = PostFrontmatter & { slug: string };

export type PostContent = { frontmatter: PostFrontmatter; content: string };

const POSTS_DIR = path.join(process.cwd(), "app", "blog", "_posts");

function readPostFile(slug: string): PostContent | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as PostFrontmatter, content };
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
    return { slug, ...post.frontmatter };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): PostContent | null {
  if (!posts.some((post) => post.slug === slug)) return null;
  return readPostFile(slug);
}
