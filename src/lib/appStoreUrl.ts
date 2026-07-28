function readObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

export function normalizeAppleAppStoreUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value.trim());
    const isAppListing =
      /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?app\/(?:[^/]+\/)?id\d+\/?$/i.test(
        url.pathname,
      );
    const opensWriteReview = Array.from(url.searchParams.entries()).some(
      ([key, value]) =>
        key.toLowerCase() === "action" &&
        value.toLowerCase() === "write-review",
    );
    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "apps.apple.com" ||
      url.username ||
      url.password ||
      !isAppListing ||
      opensWriteReview
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveAppleAppStoreUrl(config: unknown): string | null {
  const root = readObject(config);
  const clientVersion = readObject(root?.clientVersion);
  const ios = readObject(clientVersion?.ios);
  return normalizeAppleAppStoreUrl(ios?.updateUrl);
}
