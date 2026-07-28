import { describe, expect, it } from "bun:test";
import {
  normalizeAppleAppStoreUrl,
  resolveAppleAppStoreUrl,
} from "./appStoreUrl";

describe("normalizeAppleAppStoreUrl", () => {
  it("accepts Apple app listing URLs and preserves useful query parameters", () => {
    expect(
      normalizeAppleAppStoreUrl(
        "https://apps.apple.com/us/app/wheelora/id6770766627?pt=123&ct=website",
      ),
    ).toBe(
      "https://apps.apple.com/us/app/wheelora/id6770766627?pt=123&ct=website",
    );
  });

  it("rejects empty, non-HTTPS, credentialed, off-domain, review, and non-listing URLs", () => {
    expect(normalizeAppleAppStoreUrl("")).toBeNull();
    expect(
      normalizeAppleAppStoreUrl("http://apps.apple.com/app/id6770766627"),
    ).toBeNull();
    expect(
      normalizeAppleAppStoreUrl(
        "https://user:pass@apps.apple.com/app/id6770766627",
      ),
    ).toBeNull();
    expect(
      normalizeAppleAppStoreUrl(
        "https://apps.apple.com.example.com/app/id6770766627",
      ),
    ).toBeNull();
    expect(
      normalizeAppleAppStoreUrl(
        "https://apps.apple.com/app/id6770766627?action=write-review",
      ),
    ).toBeNull();
    expect(normalizeAppleAppStoreUrl("https://apps.apple.com/search")).toBeNull();
  });
});

describe("resolveAppleAppStoreUrl", () => {
  it("uses the client update URL as the release switch", () => {
    expect(
      resolveAppleAppStoreUrl({
        clientVersion: {
          ios: {
            updateUrl:
              "https://apps.apple.com/us/app/wheelora/id6770766627",
          },
        },
        policies: {
          appReview: {
            iosUrl:
              "https://apps.apple.com/app/id6770766627?action=write-review",
          },
        },
      }),
    ).toBe("https://apps.apple.com/us/app/wheelora/id6770766627");
  });

  it("stays prelaunch when the update URL is absent or invalid", () => {
    expect(
      resolveAppleAppStoreUrl({
        clientVersion: { ios: { updateUrl: "https://example.com/app" } },
        policies: {
          appReview: {
            iosUrl:
              "https://apps.apple.com/app/id6770766627?action=write-review",
          },
        },
      }),
    ).toBeNull();
    expect(
      resolveAppleAppStoreUrl({
        policies: {
          appReview: {
            iosUrl:
              "https://apps.apple.com/app/id6770766627?action=write-review",
          },
        },
      }),
    ).toBeNull();
    expect(resolveAppleAppStoreUrl({ policies: { appReview: {} } })).toBeNull();
    expect(resolveAppleAppStoreUrl(null)).toBeNull();
  });
});
