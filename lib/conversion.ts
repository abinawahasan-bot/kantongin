export const POPUP_SCROLL_TRIGGER = 0.6;
export const POPUP_STORAGE_KEY = "kong.popup.seen";

export type ConversionRoute = "blog" | "layanan" | "harga" | "none";

export function getRouteFromPathname(pathname: string): ConversionRoute {
  if (pathname === "/layanan") return "layanan";
  if (pathname === "/harga") return "harga";
  if (/^\/blog\/[^/]+\/?$/.test(pathname)) return "blog";
  return "none";
}

export function shouldShowPopup(options: {
  route: ConversionRoute;
  scrollRatio: number;
  mouseLeftViewport: boolean;
  seen: boolean;
}): boolean {
  if (options.seen || options.route === "none") return false;
  if (options.route === "blog") {
    return options.scrollRatio >= POPUP_SCROLL_TRIGGER;
  }
  if (options.route === "layanan" || options.route === "harga") {
    return options.mouseLeftViewport;
  }
  return false;
}

export function getScrollRatio(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const max = scrollHeight - clientHeight;
  if (max <= 0) return 1;
  return Math.min(Math.max(scrollTop, 0) / max, 1);
}

export function hasSeenPopup(storage: Pick<Storage, "getItem"> | null): boolean {
  return storage?.getItem(POPUP_STORAGE_KEY) === "1";
}

export function markPopupSeen(storage: Pick<Storage, "setItem"> | null): void {
  storage?.setItem(POPUP_STORAGE_KEY, "1");
}