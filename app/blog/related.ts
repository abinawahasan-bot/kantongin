import type { Post } from "./_posts";

function score(candidate: Post, target: Post): number {
  let total = 0;
  if (candidate.category === target.category) total += 2;
  total += Math.min(
    candidate.tags.filter((tag) => target.tags.includes(tag)).length,
    2
  );
  return total;
}

export function getRelatedPosts(posts: Post[], slug: string, limit = 3): Post[] {
  const target = posts.find((post) => post.slug === slug);
  if (!target) return [];

  const scored = posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({ post, score: score(post, target) }));
  const sorted = scored.sort(
    (a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date)
  );

  const picked = sorted.slice(0, limit).map((entry) => entry.post);
  if (picked.length >= limit || sorted.length <= picked.length) return picked;

  return [...picked, ...sorted.slice(limit).map((entry) => entry.post)].slice(
    0,
    limit
  );
}