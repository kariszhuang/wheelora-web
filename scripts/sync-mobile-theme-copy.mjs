import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const mobileLocales = resolve(webRoot, "../mobile/src/core/i18n/locales");
const localeCodes = [
  "en", "zh-Hans", "zh-Hant", "es", "fr", "de", "ja", "ko", "pt-BR", "pt-PT",
  "it", "nl", "ru", "ar", "hi", "id", "vi", "th", "tr", "pl",
];

const copy = Object.fromEntries(localeCodes.map((locale) => {
  const source = JSON.parse(readFileSync(resolve(mobileLocales, `${locale}.json`), "utf8"));
  const theme = source.settings.theme;
  return [locale, {
    label: theme.title,
    selected: theme.selected,
    preview: theme.choose,
    names: theme.names,
    taglines: theme.taglines,
  }];
}));

const output = `// Generated from mobile/src/core/i18n/locales/* by scripts/sync-mobile-theme-copy.mjs.\n`
  + `import type { LocaleCode } from "./locales";\n\n`
  + `export type ThemeShowcaseCopy = {\n`
  + `  label: string;\n  selected: string;\n  preview: string;\n`
  + `  names: Record<string, string>;\n  taglines: Record<string, string>;\n};\n\n`
  + `export const THEME_SHOWCASE_COPY = ${JSON.stringify(copy, null, 2)} as const satisfies Record<LocaleCode, ThemeShowcaseCopy>;\n`;

writeFileSync(resolve(webRoot, "src/i18n/themeShowcase.generated.ts"), output);
