export const REVEAL_SECTION_EVENT = "kantongin:reveal-section";

export const LAZY_SECTION_ANCHORS = [
  "#how-it-works",
  "#affiliate",
  "#creators",
  "#portfolio",
  "#testimonials",
  "#cta",
  "#faq",
  "#contact",
  "#services",
  "#pricing",
] as const;

export function isLazyAnchor(href: string): boolean {
  return (LAZY_SECTION_ANCHORS as readonly string[]).includes(href);
}

export function revealSection(hash: string): void {
  window.dispatchEvent(new CustomEvent<string>(REVEAL_SECTION_EVENT, { detail: hash }));
}

function waitForElement(selector: string, timeout = 2500): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) return resolve(el);
      if (Date.now() - start > timeout) return resolve(null);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export async function revealAndScroll(
  href: string,
  scrollTo: (target: string) => void
): Promise<void> {
  if (isLazyAnchor(href)) {
    revealSection(href);
    const el = await waitForElement(href);
    if (el) scrollTo(href);
    return;
  }
  scrollTo(href);
}
