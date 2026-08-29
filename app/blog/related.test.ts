import { describe, expect, it } from "vitest";
import type { Post } from "./_posts";
import { getRelatedPosts } from "./related";

const posts: Post[] = [
  {
    slug: "a",
    category: "X",
    tags: ["t1", "t2"],
    title: "A",
    description: "",
    date: "2026-08-01",
    author: "T",
  },
  {
    slug: "b",
    category: "X",
    tags: ["t1"],
    title: "B",
    description: "",
    date: "2026-08-02",
    author: "T",
  },
  {
    slug: "c",
    category: "Y",
    tags: ["t3"],
    title: "C",
    description: "",
    date: "2026-08-03",
    author: "T",
  },
  {
    slug: "d",
    category: "Y",
    tags: ["t3"],
    title: "D",
    description: "",
    date: "2026-08-04",
    author: "T",
  },
];

describe("getRelatedPosts", () => {
  it("kategori sama lebih diprioritaskan, exclude diri", () => {
    expect(getRelatedPosts(posts, "a").map((p) => p.slug)).toEqual([
      "b",
      "d",
      "c",
    ]);
  });

  it("limit 1 memilih kandidat bernilai tertinggi", () => {
    expect(getRelatedPosts(posts, "a", 1).map((p) => p.slug)).toEqual(["b"]);
  });

  it("mengisi limit dengan posting terbaru lain", () => {
    expect(getRelatedPosts(posts, "c", 3).map((p) => p.slug)).toEqual([
      "d",
      "b",
      "a",
    ]);
  });

  it("tidak pernah menyertakan diri sendiri", () => {
    expect(getRelatedPosts(posts, "a").some((p) => p.slug === "a")).toBe(false);
  });

  it("slug tak dikenal mengembalikan array kosong", () => {
    expect(getRelatedPosts(posts, "zzz")).toEqual([]);
  });
});