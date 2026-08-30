import { describe, expect, it } from "vitest";
import { posts } from "@/app/blog/_posts";
import { siteConfig } from "@/constants/site";
import { buildFeedXml, escapeXml } from "./feed";

describe("escapeXml", () => {
  it("meng-escape karakter XML sensitif", () => {
    expect(escapeXml(`A & B <tag> "kutip" 'apostrof'`)).toBe(
      "A &amp; B &lt;tag&gt; &quot;kutip&quot; &apos;apostrof&apos;"
    );
  });
});

describe("buildFeedXml", () => {
  it("menghasilkan dokumen RSS 2.0", () => {
    const xml = buildFeedXml();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).toContain("<lastBuildDate>");
  });

  it("memuat permalink semua posting", () => {
    const xml = buildFeedXml();
    for (const post of posts) {
      expect(xml).toContain(`${siteConfig.url}/blog/${post.slug}`);
    }
  });

  it("menempatkan posting terbaru lebih dulu", () => {
    const xml = buildFeedXml();
    const sortedDesc = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
    const newest = sortedDesc[0];
    const oldest = sortedDesc[sortedDesc.length - 1];
    expect(xml.indexOf(`${siteConfig.url}/blog/${newest.slug}`)).toBeLessThan(
      xml.indexOf(`${siteConfig.url}/blog/${oldest.slug}`)
    );
  });
});