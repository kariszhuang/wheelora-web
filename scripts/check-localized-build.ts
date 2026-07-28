import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SUPPORTED_LOCALES, localizePath } from "../src/i18n/locales";

const siteRoot = "https://wheelora.ai";
const dist = resolve(import.meta.dir, "../dist");
const sitemap = readFileSync(resolve(dist, "sitemap-0.xml"), "utf8");

for (const locale of SUPPORTED_LOCALES) {
  const route = localizePath(locale.code);
  const file = locale.code === "en"
    ? resolve(dist, "index.html")
    : resolve(dist, locale.code, "index.html");
  const html = readFileSync(file, "utf8");
  const canonical = `${siteRoot}${route}`;

  if (!html.includes(`<html lang="${locale.htmlLang}" dir="${locale.dir}"`)) {
    throw new Error(`${locale.code}: incorrect html lang/dir`);
  }
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) {
    throw new Error(`${locale.code}: incorrect canonical`);
  }
  for (const alternate of SUPPORTED_LOCALES) {
    const alternateUrl = `${siteRoot}${localizePath(alternate.code)}`;
    if (!html.includes(`hreflang="${alternate.htmlLang}" href="${alternateUrl}"`)) {
      throw new Error(`${locale.code}: missing ${alternate.code} hreflang`);
    }
  }
  if (!html.includes(`hreflang="x-default" href="${siteRoot}/"`)) {
    throw new Error(`${locale.code}: missing x-default`);
  }
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) {
    throw new Error(`${locale.code}: missing sitemap URL`);
  }
}

console.log(`Localized build verified for ${SUPPORTED_LOCALES.length} locales.`);
