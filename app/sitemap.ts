import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

type PostModule = { frontmatter: { date: string } };

const modules = import.meta.glob("./blog/_posts/*.mdx", {
  eager: true,
}) as Record<string, PostModule>;

export default function sitemap(): MetadataRoute.Sitemap {
  const blogEntries: MetadataRoute.Sitemap = Object.keys(modules).map(
    (path) => ({
      url: `${siteConfig.url}/blog/${
        path.match(/\.\/blog\/_posts\/(.+)\.mdx$/)?.[1] ?? ""
      }`,
      lastModified: new Date(modules[path].frontmatter.date),
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
