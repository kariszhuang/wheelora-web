import { describe, expect, test } from "bun:test";
import { resolveLocaleFromTags, resolveLocaleTag } from "./localeMatching";
import { getLocale, localizePath } from "./locales";

describe("web locale matching", () => {
  test("matches the mobile Chinese and Portuguese rules", () => {
    expect(resolveLocaleTag("zh-CN")).toBe("zh-Hans");
    expect(resolveLocaleTag("zh-SG")).toBe("zh-Hans");
    expect(resolveLocaleTag("zh-MY")).toBe("zh-Hans");
    expect(resolveLocaleTag("zh-HK")).toBe("zh-Hant");
    expect(resolveLocaleTag("zh-TW")).toBe("zh-Hant");
    expect(resolveLocaleTag("zh-MO")).toBe("zh-Hant");
    expect(resolveLocaleTag("pt")).toBe("pt-BR");
    expect(resolveLocaleTag("pt-PT")).toBe("pt-PT");
    expect(resolveLocaleTag("pt_BR")).toBe("pt-BR");
  });

  test("uses the first supported browser language", () => {
    expect(resolveLocaleFromTags(["xx-ZZ", "fr-CA"])).toBe("fr");
    expect(resolveLocaleFromTags(["xx-ZZ"])).toBe("en");
    expect(resolveLocaleFromTags(["de-AT", "es-MX"])).toBe("de");
    expect(resolveLocaleFromTags(["in-ID"])).toBe("id");
  });

  test("uses locale routes without breaking hash links or RTL metadata", () => {
    expect(localizePath("es", "/#demo")).toBe("/es/#demo");
    expect(localizePath("zh-Hans")).toBe("/zh-Hans/");
    expect(getLocale("ar")?.dir).toBe("rtl");
    expect(getLocale("zh-Hans")?.htmlLang).toBe("zh-Hans");
  });
});
