import { describe, expect, it } from "bun:test";
import {
  cleanPath,
  contentTypeForStaticPath,
  injectLegalContent,
  injectReferralPage,
  injectSharedWheelPage,
  isReferralIndexPathname,
  normalizeEmbedDataPathname,
  normalizeLegalPathname,
  normalizeReferralPathname,
  normalizeSharedWheelPathname,
} from "./serve-static";

describe("cleanPath", () => {
  it("normalizes root and nested static paths", () => {
    expect(cleanPath("/")).toBe("index.html");
    expect(cleanPath("/assets/app.js")).toBe("assets/app.js");
  });

  it("rejects traversal, malformed encoding, null bytes, and backslashes", () => {
    expect(cleanPath("/../etc/passwd")).toBeNull();
    expect(cleanPath("/%2e%2e/etc/passwd")).toBeNull();
    expect(cleanPath("/%E0%A4%A")).toBeNull();
    expect(cleanPath("/safe%00path")).toBeNull();
    expect(cleanPath("/..\\etc\\passwd")).toBeNull();
  });
});

describe("contentTypeForStaticPath", () => {
  it("serves Apple's extensionless association file as JSON", () => {
    expect(
      contentTypeForStaticPath(
        "/srv/web/.well-known/apple-app-site-association",
      ),
    ).toBe("application/json; charset=utf-8");
  });

  it("keeps ordinary extension-based content types", () => {
    expect(contentTypeForStaticPath("/srv/web/assets/app.js")).toBe(
      "application/javascript; charset=utf-8",
    );
  });
});

describe("normalizeLegalPathname", () => {
  it("normalizes slash and index variants for terms", () => {
    expect(normalizeLegalPathname("/terms")).toBe("/terms");
    expect(normalizeLegalPathname("/terms/")).toBe("/terms");
    expect(normalizeLegalPathname("/terms/index.html")).toBe("/terms");
    expect(normalizeLegalPathname("/terms/index.html/")).toBe("/terms");
  });

  it("normalizes slash and index variants for privacy", () => {
    expect(normalizeLegalPathname("/privacy")).toBe("/privacy");
    expect(normalizeLegalPathname("/privacy/")).toBe("/privacy");
    expect(normalizeLegalPathname("/privacy/index.html")).toBe("/privacy");
    expect(normalizeLegalPathname("/privacy/index.html/")).toBe("/privacy");
  });

  it("ignores non-legal routes", () => {
    expect(normalizeLegalPathname("/")).toBeNull();
    expect(normalizeLegalPathname("/faq")).toBeNull();
    expect(normalizeLegalPathname("/terms-and-conditions")).toBeNull();
  });
});

describe("injectLegalContent", () => {
  it("replaces the placeholder marker", () => {
    expect(injectLegalContent("<article>__LEGAL_CONTENT__</article>", "<p>ok</p>")).toBe(
      "<article><p>ok</p></article>",
    );
  });

  it("fails closed when the marker is missing", () => {
    expect(() => injectLegalContent("<article>No marker</article>", "<p>ok</p>")).toThrow(
      "Legal content marker missing from template",
    );
  });
});

describe("normalizeSharedWheelPathname", () => {
  it("extracts short share slugs", () => {
    expect(normalizeSharedWheelPathname("/w/abc")).toBe("abc");
    expect(normalizeSharedWheelPathname("/w/AbC/")).toBe("AbC");
  });

  it("ignores non-share routes", () => {
    expect(normalizeSharedWheelPathname("/w")).toBeNull();
    expect(normalizeSharedWheelPathname("/w/abc/extra")).toBeNull();
    expect(normalizeSharedWheelPathname("/faq")).toBeNull();
  });
});

describe("normalizeReferralPathname", () => {
  it("extracts referral codes from invite routes", () => {
    expect(normalizeReferralPathname("/r/ML7TH4J9G")).toBe("ML7TH4J9G");
    expect(normalizeReferralPathname("/r/ml7th4j9g/")).toBe("ML7TH4J9G");
  });

  it("ignores invalid or unrelated referral routes", () => {
    expect(normalizeReferralPathname("/r")).toBeNull();
    expect(normalizeReferralPathname("/r/abc")).toBeNull();
    expect(normalizeReferralPathname("/r/abc/extra")).toBeNull();
    expect(normalizeReferralPathname("/faq")).toBeNull();
  });
});

describe("isReferralIndexPathname", () => {
  it("detects bare referral index paths so placeholders never leak", () => {
    expect(isReferralIndexPathname("/r")).toBe(true);
    expect(isReferralIndexPathname("/r/")).toBe(true);
    expect(isReferralIndexPathname("/r/ML7TH4J9G")).toBe(false);
    expect(isReferralIndexPathname("/")).toBe(false);
  });
});

describe("injectReferralPage", () => {
  it("replaces referral markers with safe code and app link", () => {
    const template = [
      "__REFERRAL_CODE__",
      "__REFERRAL_CODE_JS__",
      "__REFERRAL_APP_URL__",
    ].join("|");

    expect(injectReferralPage(template, "ml7th4j9g")).toBe(
      "ML7TH4J9G|ML7TH4J9G|wheelora://r/ML7TH4J9G",
    );
  });

  it("fails closed when markers are missing", () => {
    expect(() => injectReferralPage("<main>No marker</main>", "ML7TH4J9G")).toThrow(
      "Referral markers missing from template",
    );
  });
});

describe("injectSharedWheelPage", () => {
  it("replaces the shared wheel markers", () => {
    const template = [
      "__SHARED_WHEEL_HEAD__",
      "<main>__SHARED_WHEEL_CONTENT__</main>",
      "<a href=\"__SHARED_WHEEL_APP_URL__\">Open</a>",
      "<script>__SHARED_WHEEL_JSON__</script>",
    ].join(" ");
    const rendered = injectSharedWheelPage(template, {
      head: "<title>x</title>",
      content: "<article>y</article>",
      json: '{"title":"__SHARED_WHEEL_APP_URL__"}',
      appUrl: "wheelora://shared/a&b",
    });
    expect(rendered).toContain("<article>y</article>");
    expect(rendered).toContain('href="wheelora://shared/a&amp;b"');
    expect(rendered).toContain(
      '<script>{"title":"__SHARED_WHEEL_APP_URL__"}</script>',
    );
  });

  it("fails closed when markers are missing", () => {
    expect(() =>
      injectSharedWheelPage("<main>No marker</main>", {
        head: "",
        content: "",
        json: "{}",
        appUrl: "wheelora://shared/abc",
      }),
    ).toThrow("Shared wheel markers missing from template");
  });
});

describe("normalizeEmbedDataPathname", () => {
  it("extracts embed slugs from json routes", () => {
    expect(normalizeEmbedDataPathname("/embed/data/abc.json")).toBe("abc");
    expect(normalizeEmbedDataPathname("/embed/data/ABC.json/")).toBe("ABC");
  });

  it("ignores unrelated routes", () => {
    expect(normalizeEmbedDataPathname("/embed/data/abc123def456")).toBeNull();
    expect(normalizeEmbedDataPathname("/embed/data/abc/extra.json")).toBeNull();
    expect(normalizeEmbedDataPathname("/w/abc")).toBeNull();
  });
});
