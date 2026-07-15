const COVER_HOST = "static.olelive.com";

export function coverUrl(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.hostname === COVER_HOST ? `/covers${parsed.pathname}` : url;
  } catch {
    return url;
  }
}
