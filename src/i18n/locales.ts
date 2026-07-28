export const DEFAULT_LOCALE = "en" as const;

export const SUPPORTED_LOCALES = [
  { code: "en", htmlLang: "en", ogLocale: "en_US", nativeName: "English", dir: "ltr" },
  { code: "zh-Hans", htmlLang: "zh-Hans", ogLocale: "zh_CN", nativeName: "简体中文", dir: "ltr" },
  { code: "zh-Hant", htmlLang: "zh-Hant", ogLocale: "zh_TW", nativeName: "繁體中文", dir: "ltr" },
  { code: "es", htmlLang: "es", ogLocale: "es_ES", nativeName: "Español", dir: "ltr" },
  { code: "fr", htmlLang: "fr", ogLocale: "fr_FR", nativeName: "Français", dir: "ltr" },
  { code: "de", htmlLang: "de", ogLocale: "de_DE", nativeName: "Deutsch", dir: "ltr" },
  { code: "ja", htmlLang: "ja", ogLocale: "ja_JP", nativeName: "日本語", dir: "ltr" },
  { code: "ko", htmlLang: "ko", ogLocale: "ko_KR", nativeName: "한국어", dir: "ltr" },
  { code: "pt-BR", htmlLang: "pt-BR", ogLocale: "pt_BR", nativeName: "Português (Brasil)", dir: "ltr" },
  { code: "pt-PT", htmlLang: "pt-PT", ogLocale: "pt_PT", nativeName: "Português (Portugal)", dir: "ltr" },
  { code: "it", htmlLang: "it", ogLocale: "it_IT", nativeName: "Italiano", dir: "ltr" },
  { code: "nl", htmlLang: "nl", ogLocale: "nl_NL", nativeName: "Nederlands", dir: "ltr" },
  { code: "ru", htmlLang: "ru", ogLocale: "ru_RU", nativeName: "Русский", dir: "ltr" },
  { code: "ar", htmlLang: "ar", ogLocale: "ar_AR", nativeName: "العربية", dir: "rtl" },
  { code: "hi", htmlLang: "hi", ogLocale: "hi_IN", nativeName: "हिन्दी", dir: "ltr" },
  { code: "id", htmlLang: "id", ogLocale: "id_ID", nativeName: "Bahasa Indonesia", dir: "ltr" },
  { code: "vi", htmlLang: "vi", ogLocale: "vi_VN", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "th", htmlLang: "th", ogLocale: "th_TH", nativeName: "ไทย", dir: "ltr" },
  { code: "tr", htmlLang: "tr", ogLocale: "tr_TR", nativeName: "Türkçe", dir: "ltr" },
  { code: "pl", htmlLang: "pl", ogLocale: "pl_PL", nativeName: "Polski", dir: "ltr" },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]["code"];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function getLocale(code: string | undefined): SupportedLocale | undefined {
  return SUPPORTED_LOCALES.find((locale) => locale.code === code);
}

export function localizePath(locale: LocaleCode, path = "/"): string {
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}/` : `/${locale}${path}`;
}

export function localeAlternates(path = "/") {
  return SUPPORTED_LOCALES.map((locale) => ({ locale, path: localizePath(locale.code, path) }));
}
