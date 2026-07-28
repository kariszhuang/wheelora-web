import { describe, expect, test } from "bun:test";
import { HOME_COPY, getHomeCopy } from "./home";
import { SUPPORTED_LOCALES } from "./locales";
import { THEME_SHOWCASE_COPY } from "./themeShowcase.generated";

function leafPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return [path];
  if (Array.isArray(value)) return value.flatMap((item, index) => leafPaths(item, `${path}.${index}`));
  if (value && typeof value === "object") return Object.entries(value).flatMap(([key, item]) => leafPaths(item, `${path}.${key}`));
  return [];
}

describe("landing-page translations", () => {
  test("publishes every mobile locale with the complete English shape", () => {
    const english = getHomeCopy("en")!;
    const expected = leafPaths(english).sort();
    expect(Object.keys(HOME_COPY)).toEqual(SUPPORTED_LOCALES.map(({ code }) => code));
    expect(Object.keys(THEME_SHOWCASE_COPY)).toEqual(SUPPORTED_LOCALES.map(({ code }) => code));
    for (const [locale, copy] of Object.entries(HOME_COPY)) {
      expect(SUPPORTED_LOCALES.some((entry) => entry.code === locale)).toBe(true);
      expect(leafPaths(copy).sort()).toEqual(expected);
      expect(JSON.stringify(copy)).not.toMatch(/\bundefined\b|null/);
    }
  });

  test("does not leak known English landing-page copy into localized pages", () => {
    const englishPhrases = [
      "how it works", "join waitlist", "interactive demo",
      "tap the center", "my wheels", "spin for a decision", "ai-assisted",
      "weighted spins", "from stuck to decided", "built for real life",
      "ten visual themes", "private by default", "start free",
      "launching on iphone", "say it. spin it.",
    ];
    for (const locale of SUPPORTED_LOCALES.filter(({ code }) => code !== "en")) {
      const renderedCopy = `${JSON.stringify(HOME_COPY[locale.code])} ${JSON.stringify(THEME_SHOWCASE_COPY[locale.code])}`.toLowerCase();
      for (const phrase of englishPhrases) expect(renderedCopy).not.toContain(phrase);
    }
  });

  test("blocks known high-risk terminology and script regressions", () => {
    const text = (locale: keyof typeof HOME_COPY) => JSON.stringify(HOME_COPY[locale]);
    expect(text("zh-Hans")).not.toMatch(/[轉盤選個這後發數據帳刪設間為儲]/);
    expect(text("zh-Hant")).not.toMatch(/[转盘选个这后发数据账删设间为储]/);
    expect(text("tr").toLowerCase()).not.toContain("tekerlek");
    expect(text("ko")).not.toMatch(/휠|당신|귀하/);
    expect(text("ja")).not.toContain("ホイール");
    expect(text("vi").toLowerCase()).not.toContain("bánh xe");
    expect(text("hi")).not.toContain("स्पिन स्पिन");
    expect(text("fr").toLowerCase()).not.toMatch(/\b(vous|votre|vos|touchez|tournez|avancez|gardez|partagez|choisissez|créez|synchronisez|dites)\b/);
    for (const locale of SUPPORTED_LOCALES.filter(({ code }) => code !== "en")) {
      expect(text(locale.code)).not.toContain("Spin Wheels");
    }
  });
});
