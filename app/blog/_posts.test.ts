import { describe, expect, it } from "vitest";
import { getPost, parseFrontmatter, posts } from "./_posts";

describe("_posts (fs)", () => {
  it("menemukan minimal dua post terurut terbaru dulu", () => {
    expect(posts.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date.localeCompare(posts[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("getPost mengembalikan frontmatter dan konten", () => {
    const post = getPost("pentingnya-website-untuk-umkm");
    expect(post).not.toBeNull();
    expect(post?.frontmatter.title).toBeTruthy();
    expect(post?.content.length).toBeGreaterThan(100);
  });

  it("getPost mengembalikan null untuk slug tak dikenal atau berbahaya", () => {
    expect(getPost("tidak-ada")).toBeNull();
    expect(getPost("../layout")).toBeNull();
  });
});

describe("validasi frontmatter", () => {
  it("semua post punya 5 field lengkap dengan tipe benar", () => {
    for (const post of posts) {
      expect(post.title.trim()).toBeTruthy();
      expect(post.description.trim()).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.author.trim()).toBeTruthy();
      expect(Array.isArray(post.tags)).toBe(true);
      expect(post.tags.length).toBeGreaterThan(0);
      expect(post.slug).not.toContain("/");
    }
  });

  it("parseFrontmatter menolak data tidak valid dengan pesan jelas", () => {
    expect(() =>
      parseFrontmatter("dummy", { title: "x" })
    ).toThrow(/Frontmatter tidak valid/);
  });
});
