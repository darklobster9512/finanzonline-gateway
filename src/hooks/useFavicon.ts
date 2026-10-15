import { useEffect } from "react";

const typeFromUrl = (url: string) => {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png": return "image/png";
    case "webp": return "image/webp";
    case "svg": return "image/svg+xml";
    case "ico": return "image/x-icon";
    case "jpg":
    case "jpeg": return "image/jpeg";
    default: return undefined;
  }
};

/**
 * Swap the browser-tab favicon while this component is mounted.
 * Restores the previous favicon on unmount.
 */
export function useFavicon(href: string) {
  useEffect(() => {
    if (!href) return;
    const head = document.head;
    const existing = head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]');
    const prev = Array.from(existing).map((l) => ({
      el: l,
      href: l.href,
      type: l.type,
    }));
    // Remove existing icons so the browser picks ours.
    existing.forEach((l) => l.parentNode?.removeChild(l));

    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    const t = typeFromUrl(href);
    if (t) link.type = t;
    head.appendChild(link);

    return () => {
      link.parentNode?.removeChild(link);
      prev.forEach(({ el, href, type }) => {
        el.href = href;
        if (type) el.type = type;
        head.appendChild(el);
      });
    };
  }, [href]);
}
