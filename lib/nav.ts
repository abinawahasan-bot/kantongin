/** href anchor section berawalan `#` (mis. "#services"). */
export function isSectionHref(href: string): boolean {
  return href.startsWith("#") && href.length > 1;
}

/**
 * Resolve href nav agar item anchor section tetap berguna di halaman selain
 * beranda: "#services" dari "/harga" menjadi "/#services" (deep-link home).
 * Di beranda href dibiarkan apa adanya untuk scroll halus via Lenis.
 */
export function resolveNavHref(pathname: string, href: string): string {
  if (isSectionHref(href) && pathname !== "/") {
    return `/${href}`;
  }
  return href;
}