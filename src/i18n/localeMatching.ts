import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "./locales";

export const EXACT_LOCALE_ALIASES: Record<string, LocaleCode> = {
  zh: "zh-Hans", "zh-cn": "zh-Hans", "zh-sg": "zh-Hans", "zh-my": "zh-Hans",
  "zh-hans": "zh-Hans", "zh-hans-cn": "zh-Hans", "zh-hans-sg": "zh-Hans", "zh-hans-my": "zh-Hans",
  "zh-hant": "zh-Hant", "zh-tw": "zh-Hant", "zh-hk": "zh-Hant", "zh-mo": "zh-Hant",
  "zh-hant-tw": "zh-Hant", "zh-hant-hk": "zh-Hant", "zh-hant-mo": "zh-Hant",
  pt: "pt-BR", "pt-br": "pt-BR", "pt-pt": "pt-PT", in: "id",
};

export const BASE_LOCALE_ALIASES: Record<string, LocaleCode> = {
  en: "en", es: "es", fr: "fr", de: "de", ja: "ja", ko: "ko", it: "it", nl: "nl",
  ru: "ru", ar: "ar", hi: "hi", id: "id", in: "id", vi: "vi", th: "th", tr: "tr", pl: "pl",
};

export function resolveLocaleTag(tag?: string | null): LocaleCode {
  if (!tag) return DEFAULT_LOCALE;
  const normalized = tag.trim().replace(/_/g, "-").toLowerCase();
  const exact = EXACT_LOCALE_ALIASES[normalized];
  if (exact) return exact;
  const supported = SUPPORTED_LOCALES.find((locale) => locale.code.toLowerCase() === normalized);
  if (supported) return supported.code;
  return BASE_LOCALE_ALIASES[normalized.split("-")[0]] ?? DEFAULT_LOCALE;
}

export function resolveLocaleFromTags(tags: Array<string | null | undefined>): LocaleCode {
  for (const tag of tags) {
    const resolved = resolveLocaleTag(tag);
    if (resolved !== DEFAULT_LOCALE || tag?.toLowerCase().startsWith("en")) return resolved;
  }
  return DEFAULT_LOCALE;
}
