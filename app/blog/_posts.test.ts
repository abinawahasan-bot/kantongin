import { describe, expect, it } from "vitest";
import { getPost, posts } from "./_posts";

describe("_posts (fs)", () => {
  it("menemukan minimal dua post terurut terbaru dulu", () => {
    expect(posts.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date.localeCompare(posts[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("getPost mengembalikan frontmatter dan konten", () => {
    const post = getPost("affiliate-marketing-untuk-umkm");
    expect(post).not.toBeNull();
    expect(post?.frontmatter.title).toBeTruthy();
    expect(post?.content.length).toBeGreaterThan(100);
  });

  it("getPost mengembalikan null untuk slug tak dikenal atau berbahaya", () => {
    expect(getPost("tidak-ada")).toBeNull();
    expect(getPost("../layout")).toBeNull();
  });
});
