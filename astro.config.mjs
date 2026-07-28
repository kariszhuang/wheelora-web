// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import sitemap, { ChangeFreqEnum } from "@astrojs/sitemap";

export default defineConfig({
  site: "https://wheelora.ai",
  output: "static",
  vite: {
    build: {
      sourcemap: false,
      reportCompressedSize: false,
    },
  },
  integrations: [
    svelte(),
    sitemap({
      filter: (page) => !["https://wheelora.ai/404/", "https://wheelora.ai/w/"].includes(page),
      serialize(item) {
        // Use YYYY-MM-DD format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const today = `${year}-${month}-${day}`;

        // Set high priority and daily change for home page
        if (item.url === "https://wheelora.ai/") {
          item.changefreq = ChangeFreqEnum.DAILY;
          item.priority = 1.0;
          item.lastmod = today;
        } else {
          item.changefreq = ChangeFreqEnum.WEEKLY;
          item.priority = 0.8;
          item.lastmod = today;
        }
        return item;
      },
    }),
  ],
});
