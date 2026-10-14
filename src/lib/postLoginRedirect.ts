/** Compute post-login redirect: honor ?return=... for ELSTER verification flows. */
export function postLoginPath(
  search: URLSearchParams | string | null | undefined,
  sessionId: string,
  defaultPath = "/confirmation",
): string {
  const sp = typeof search === "string" ? new URLSearchParams(search) :
    search instanceof URLSearchParams ? search :
    new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const ret = sp.get("return");
  const sidQs = sessionId ? `s=${encodeURIComponent(sessionId)}` : "";
  if (ret && /^\/[a-zA-Z0-9/_\-]+$/.test(ret)) {
    const q = ["step=3", sidQs].filter(Boolean).join("&");
    return `${ret}${q ? `?${q}` : ""}`;
  }
  return sessionId ? `${defaultPath}?${sidQs}` : defaultPath;
}
