# Wheelora Web Lab

Open-source Astro + Svelte learning project for [Wheelora](https://wheelora.ai), an AI decision wheel concept built around fast choices, local-first creation, starter packs, weighted spins, and a playful interactive demo.

This repository is intentionally the public web experience only. The mobile app, backend API, database schema, and private product docs live elsewhere.

## Why This Is Public

I made this repository public as an educational, hobby-oriented build log for how I approach a modern Astro + Svelte web project. The goal is to make the implementation inspectable: fast pages, accessible UI, SEO metadata, AI crawler context, responsive layout, and a real interactive Svelte demo.

It is a reference for how I like to build product-shaped web experiences:

- ship the actual product feel on the first screen
- keep the page static-first for speed and hosting simplicity
- use Svelte only where interactivity earns its bundle cost
- design for mobile Lighthouse performance from the start
- make SEO, social previews, legal pages, and AI crawler context first-class

This repository is shared for learning, portfolio, and hobby purposes. It is not legal advice, immigration advice, or a statement about anyone's employment status. If you are in a visa-sensitive situation, talk to a qualified attorney or your school advisor before relying on any project structure.

## Lighthouse Snapshot

Latest mobile PageSpeed Insights run shared from production:

| Category | Score |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

| Metric | Result |
| --- | ---: |
| First Contentful Paint | 0.9 s |
| Largest Contentful Paint | 1.5 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1.0 s |

Captured Apr 27, 2026 at 11:01 PM CDT with Lighthouse 13.0.1, mobile emulation, Moto G Power, and Slow 4G throttling. Lighthouse values vary by run, network, region, and deploy environment, so treat these as a production snapshot rather than a permanent guarantee.

## What To Look At

If you are here to learn from the project, these are the most interesting parts:

- Astro page architecture with shared SEO and structured data
- Svelte 5 interactive wheel demo embedded into static pages
- weighted spin logic with physics-inspired easing
- SVG text fitting on wheel arcs
- mobile-first layout with no layout shift in the Lighthouse run
- static assets, favicons, web manifest, `robots.txt`, and `llms.txt`
- Docker production serving with security headers
- legal page rendering that can hydrate from an API without making the whole site server-rendered

## Tech Stack

### Astro 6

Astro owns routing, static page generation, document structure, SEO metadata, and the production build. The project uses Astro because content-heavy pages should ship as HTML first, with JavaScript added only where needed.

Key pieces:

- file-based pages in `src/pages`
- shared shell and metadata in `src/layouts/BaseLayout.astro`
- static output generated into `dist`
- sitemap generation through `@astrojs/sitemap`
- no production sourcemaps in `astro.config.mjs`

### Svelte 5

Svelte powers the interactive product demo: wheel lists, theme switching, animated spins, result states, and SVG text fitting. The static pages stay Astro-rendered, while Svelte handles the parts that need state and motion.

Important demo files:

- `src/components/svelte/WebDemoApp.svelte`
- `src/components/svelte/WheelUI.svelte`
- `src/components/svelte/ThemeShowcase.svelte`
- `src/store/theme.ts`

### TypeScript

The spin physics, weighted result calculation, and text fitting helpers are written in TypeScript:

- `src/lib/spinLogic.ts`
- `src/lib/textPathFitting.ts`

The wheel demo uses weighted outcomes, secure random sampling when available, SVG arc labels, and bounded animation timing so the UI feels close to the app without needing the app runtime.

### CSS

The global CSS is hand-authored in `src/styles/global.css`. The visual system is intentionally lightweight: no Tailwind build step, no component library theme runtime, and no CSS-in-JS.

The CSS focuses on:

- stable responsive layout
- mobile-first hero composition
- reduced layout shift
- accessible contrast
- compact interactive controls
- a polished product-demo surface without large framework overhead

### Bun + npm Lockfiles

The deployment image uses Bun, and the repo includes `bun.lock`. `package-lock.json` is also present so the project remains easy to install with npm in environments where Bun is not the default.

### Docker

The Dockerfile has separate dependency, build, dev, and production targets. The production image serves the static `dist` output with a small Bun server in `serve-static.ts`, mostly so legal pages can be rendered through the backend legal API when deployed behind the production proxy.

## Project Structure

```text
.
├── public/
│   ├── assets/brand/
│   ├── llms.txt
│   ├── robots.txt
│   └── site.webmanifest
├── scripts/
│   └── clean-sitemap.js
├── src/
│   ├── components/
│   │   ├── LegalDocument.astro
│   │   └── svelte/
│   ├── data/
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── spinLogic.ts
│   │   └── textPathFitting.ts
│   ├── pages/
│   ├── store/
│   └── styles/
├── astro.config.mjs
├── Dockerfile
├── package.json
└── serve-static.ts
```

## Local Development

Use Node.js 22.12+.

```bash
npm install
npm run dev
```

The dev server binds to `0.0.0.0:4321` so it works cleanly from containers and local network testing.

## Production Build

```bash
npm run build
npm run preview
```

`npm run build` runs Astro and then normalizes sitemap timestamps through `scripts/clean-sitemap.js`.

## Docker Preview

```bash
docker compose up --build web-preview
```

The preview service maps the production server to port `4323`.

## Legal Page Rendering

The `/terms` and `/privacy` routes are part of the public website, but production legal content is rendered from the Wheelora backend API.

At runtime, `serve-static.ts` expects:

```bash
INTERNAL_API_BASE=https://your-internal-api.example.com
```

Static fallback/client rendering can also use:

```bash
PUBLIC_LEGAL_API_BASE=https://your-public-api.example.com
```

If you fork this site for another project, replace the legal integration with your own content or API.

## SEO + AI Crawler Context

The site includes:

- canonical URLs
- Open Graph and Twitter card metadata
- JSON-LD for Organization, WebSite, SoftwareApplication, FAQ, and homepage entities
- `robots.txt`
- `llms.txt`
- generated sitemap index
- production social preview artwork

Most of this lives in `src/layouts/BaseLayout.astro`, `src/data/site.ts`, `src/pages`, and `public`.

## Performance Notes

The current production shape is intentionally simple:

- static Astro pages for the document shell
- limited client JavaScript
- no analytics script in this public snapshot
- explicit image dimensions for key layout assets
- no production sourcemaps
- responsive CSS without runtime styling libraries
- immutable caching for static assets in `serve-static.ts`
- no blocking third-party font loading

The interactive demo is the largest client-side feature, so most performance work is about keeping that component purposeful, bounded, and visually stable.

## Reusing This

You are welcome to study the implementation and adapt the code under the license terms. Please do not reuse Wheelora names, logos, icons, screenshots, product copy, or brand assets for another product.

## License

Code is released under the MIT License. Wheelora brand names, logos, icons, screenshots, and product assets are not licensed for reuse. See `LICENSE.md` and `TRADEMARKS.md`.
