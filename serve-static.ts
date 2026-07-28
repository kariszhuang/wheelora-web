const root = `${import.meta.dir}/dist`;
const port = Number(Bun.env.PORT ?? 4321);
const internalApiBase = Bun.env.INTERNAL_API_BASE?.replace(/\/$/, "") ?? "";
const legalContentMarker = "__LEGAL_CONTENT__";
const legalFetchTimeoutMs = Number(Bun.env.LEGAL_FETCH_TIMEOUT_MS ?? 5000);
const apiProxyTimeoutMs = Number(Bun.env.API_PROXY_TIMEOUT_MS ?? 15_000);
const sharedWheelFetchTimeoutMs = Number(Bun.env.SHARED_WHEEL_FETCH_TIMEOUT_MS ?? 5_000);
const sharedWheelHeadMarker = "__SHARED_WHEEL_HEAD__";
const sharedWheelContentMarker = "__SHARED_WHEEL_CONTENT__";
const sharedWheelJsonMarker = "__SHARED_WHEEL_JSON__";
const sharedWheelAppUrlMarker = "__SHARED_WHEEL_APP_URL__";
const referralCodeMarker = "__REFERRAL_CODE__";
const referralCodeJsMarker = "__REFERRAL_CODE_JS__";
const referralAppUrlMarker = "__REFERRAL_APP_URL__";
const hopByHopProxyHeaders = [
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];
const securityHeaders: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; font-src 'self' data:; manifest-src 'self'; upgrade-insecure-requests",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), web-share=(self)",
};

const types: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

export function contentTypeForStaticPath(filePath: string) {
  if (filePath.split("/").at(-1) === "apple-app-site-association") {
    return types[".json"];
  }
  const ext = filePath.match(/\.[^.]+$/)?.[0] ?? "";
  return types[ext] ?? "application/octet-stream";
}

const htmlHeaders = {
  "Cache-Control": "no-cache, no-transform",
  "Content-Type": types[".html"],
};

function withSecurityHeaders(response: Response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function notFoundResponse() {
  const file = Bun.file(`${root}/404.html`);
  if (await file.exists()) {
    return withSecurityHeaders(
      new Response(file, {
        status: 404,
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": types[".html"],
        },
      }),
    );
  }

  return withSecurityHeaders(
    new Response("404 not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
  );
}

export function cleanPath(pathname: string) {
  let decoded: string;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decoded.includes("\0") || decoded.includes("\\")) {
    return null;
  }

  const withoutSlash = decoded.replace(/^\/+/, "");
  const segments = withoutSlash.split("/");
  return segments.includes("..") ? null : withoutSlash || "index.html";
}

export function normalizeLegalPathname(pathname: string): "/terms" | "/privacy" | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/terms" || normalized === "/terms/index.html") return "/terms";
  if (normalized === "/privacy" || normalized === "/privacy/index.html") return "/privacy";
  return null;
}

export function normalizeSharedWheelPathname(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "");
  const match = normalized.match(/^\/w\/([a-z0-9]{3,32})$/i);
  return match?.[1] || null;
}

export function normalizeReferralPathname(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "");
  const match = normalized.match(/^\/r\/([a-z0-9]{4,64})$/i);
  return match?.[1]?.toUpperCase() || null;
}

export function isReferralIndexPathname(pathname: string) {
  return (pathname.replace(/\/+$/, "") || "/") === "/r";
}

export function normalizeEmbedDataPathname(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "");
  const match = normalized.match(/^\/embed\/data\/([a-z0-9]{3,32})\.json$/i);
  return match?.[1] || null;
}

function withExtraHeaders(response: Response, extras: Record<string, string>) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(extras)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function injectLegalContent(template: string, content: string) {
  if (!template.includes(legalContentMarker)) {
    throw new Error("Legal content marker missing from template");
  }

  return template.replace(legalContentMarker, content);
}

export function injectSharedWheelPage(
  template: string,
  params: { head: string; content: string; json: string; appUrl: string },
) {
  if (
    !template.includes(sharedWheelHeadMarker) ||
    !template.includes(sharedWheelContentMarker) ||
    !template.includes(sharedWheelJsonMarker) ||
    !template.includes(sharedWheelAppUrlMarker)
  ) {
    throw new Error("Shared wheel markers missing from template");
  }

  const replacements = new Map<string, string>([
    [sharedWheelHeadMarker, params.head],
    [sharedWheelContentMarker, params.content],
    [sharedWheelJsonMarker, params.json],
    [sharedWheelAppUrlMarker, escapeHtml(params.appUrl)],
  ]);
  return template.replace(
    /__SHARED_WHEEL_(?:HEAD|CONTENT|JSON|APP_URL)__/g,
    (marker) => replacements.get(marker) ?? marker,
  );
}

export function injectReferralPage(template: string, code: string) {
  if (
    !template.includes(referralCodeMarker) ||
    !template.includes(referralCodeJsMarker) ||
    !template.includes(referralAppUrlMarker)
  ) {
    throw new Error("Referral markers missing from template");
  }

  const normalizedCode = normalizeReferralPathname(`/r/${code}`);
  if (!normalizedCode) {
    throw new Error("Invalid referral code");
  }

  const appUrl = `wheelora://r/${encodeURIComponent(normalizedCode)}`;
  const escapedCode = escapeHtml(normalizedCode);
  const escapedAppUrl = escapeHtml(appUrl);
  const escapedCodeJs = escapeJsonForScript(normalizedCode).slice(1, -1);

  return template
    .replaceAll(referralCodeMarker, escapedCode)
    .replaceAll(referralCodeJsMarker, escapedCodeJs)
    .replaceAll(referralAppUrlMarker, escapedAppUrl);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeJsonForScript(value: unknown) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/"([^"]+)"/g, "&quot;$1&quot;")
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      (email) =>
        `<!--email_off--><a href="mailto:${email}">${email}</a><!--/email_off-->`,
    );
}

function flushParagraph(buffer: string[], parts: string[]) {
  if (buffer.length === 0) return;
  parts.push(`<p>${renderInline(buffer.join(" "))}</p>`);
  buffer.length = 0;
}

function flushList(buffer: string[], parts: string[]) {
  if (buffer.length === 0) return;
  parts.push(`<ul>${buffer.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
  buffer.length = 0;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const parts: string[] = [];
  const paragraph: string[] = [];
  const list: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph(paragraph, parts);
      flushList(list, parts);
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph(paragraph, parts);
      flushList(list, parts);
      parts.push(`<h1>${renderInline(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph(paragraph, parts);
      flushList(list, parts);
      parts.push(`<h2>${renderInline(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph(paragraph, parts);
      list.push(line.slice(2));
      continue;
    }

    flushList(list, parts);
    paragraph.push(line.replace(/\s\s$/, ""));
  }

  flushParagraph(paragraph, parts);
  flushList(list, parts);
  return parts.join("");
}

async function fetchLegalDocument(docPath: "terms-of-service" | "privacy-policy") {
  if (!internalApiBase) {
    throw new Error("INTERNAL_API_BASE is required for legal page rendering");
  }

  const response = await fetch(`${internalApiBase}/legal/${docPath}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(legalFetchTimeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${docPath}: ${response.status}`);
  }

  return (await response.json()) as {
    content?: string;
    version_tag?: string;
  };
}

async function renderLegalPage(pathname: "/terms" | "/privacy") {
  const htmlPath = pathname === "/terms" ? `${root}/terms/index.html` : `${root}/privacy/index.html`;
  const file = Bun.file(htmlPath);
  if (!(await file.exists())) return notFoundResponse();

  const docPath = pathname === "/terms" ? "terms-of-service" : "privacy-policy";

  try {
    const [template, document] = await Promise.all([file.text(), fetchLegalDocument(docPath)]);
    const renderedContent = renderMarkdown(String(document.content || ""));
    const version = document.version_tag ? escapeHtml(document.version_tag) : "";
    const injected = `
      <div class="legal-source-meta">
        <span>${version ? `Version ${version}` : "Current version"}</span>
      </div>
      ${renderedContent || "<p>Legal content unavailable.</p>"}
    `;

    return withSecurityHeaders(
      new Response(injectLegalContent(template, injected), {
        headers: htmlHeaders,
      }),
    );
  } catch (error) {
    console.error(`Failed to render ${pathname} from internal legal API`, error);
    const template = await file.text();
    const fallback = `
      <div class="legal-source-meta">
        <span>Temporary fallback</span>
      </div>
      <p>Could not load legal content right now. Please try again in a moment.</p>
    `;
    return withSecurityHeaders(
      new Response(injectLegalContent(template, fallback), {
        headers: htmlHeaders,
      }),
    );
  }
}

type SharedWheelResponse = {
  viewerToken: string;
  likeCount: number;
  viewCount: number;
  spinCount: number;
  share: {
    slug: string;
    url: string;
    appUrl: string;
    primaryAiGenerationId: string | null;
    wheel: {
      wheelType: "s" | "m";
      name: string;
      emoji: string;
      tone: string | null;
      aiGenerated: boolean;
      optionCount: number;
      options: Array<{ label: string; weight: number }>;
      children: Array<{
        name: string;
        emoji: string;
        options: Array<{ label: string; weight: number }>;
      }>;
      updatedAt?: string;
      presentation: {
        version: 1;
        angle: number | null;
        resultLabel: string | null;
        shareMode: "wheel" | "result";
      };
    };
  };
};

async function fetchSharedWheel(slug: string) {
  if (!internalApiBase) {
    throw new Error("INTERNAL_API_BASE is required for shared wheel rendering");
  }

  const response = await fetch(`${internalApiBase}/v1/public/spin-wheel/shares/${slug}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(sharedWheelFetchTimeoutMs),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load shared wheel: ${response.status}`);
  }

  return (await response.json()) as SharedWheelResponse;
}

function buildSharedWheelSummary(response: SharedWheelResponse) {
  const { share } = response;
  const preview = share.wheel.wheelType === "s"
    ? share.wheel.options.slice(0, 4).map((option) => option.label).join(", ")
    : share.wheel.children.slice(0, 4).map((child) => child.name).join(", ");
  const isAi = share.wheel.aiGenerated || !!share.primaryAiGenerationId;
  const aiLead = isAi ? "AI-generated wheel. " : "";
  const resultLead = share.wheel.presentation.resultLabel
    ? `Result: ${share.wheel.presentation.resultLabel}. `
    : "";
  const toneLead = share.wheel.tone ? `Tone: ${share.wheel.tone}. ` : "";
  return `${aiLead}${resultLead}${toneLead}${preview ? `Includes ${preview}.` : "Ready to spin."}`.trim();
}

function buildShareText(response: SharedWheelResponse) {
  const { share } = response;
  const isAi = share.wheel.aiGenerated || !!share.primaryAiGenerationId;
  const aiLead = isAi ? "AI-generated wheel. " : "";
  if (share.wheel.presentation.resultLabel && share.wheel.presentation.shareMode === "result") {
    return `${aiLead}Wheelora picked: ${share.wheel.presentation.resultLabel}. Fair or respin?`;
  }
  return `${aiLead}Spin this with me on Wheelora.`;
}

function renderSharedWheelStructuredData(response: SharedWheelResponse) {
  const { share } = response;
  const options = share.wheel.wheelType === "s"
    ? share.wheel.options.map((option) => option.label)
    : share.wheel.children.map((child) => `${child.emoji} ${child.name}`);
  const isAi = share.wheel.aiGenerated || !!share.primaryAiGenerationId;

  return escapeJsonForScript({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${share.url}#webpage`,
    name: `${share.wheel.emoji} ${share.wheel.name}`,
    description: buildSharedWheelSummary(response),
    url: share.url,
    inLanguage: "en-US",
    dateModified: share.wheel.updatedAt,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://wheelora.ai/#website",
      name: "Wheelora",
      url: "https://wheelora.ai",
    },
    about: {
      "@type": ["SoftwareApplication", "MobileApplication", "WebApplication"],
      "@id": "https://wheelora.ai/#software",
      name: "Wheelora",
      applicationCategory: "LifestyleApplication",
      applicationSubCategory: "Decision maker app",
      operatingSystem: "iOS",
      url: "https://wheelora.ai",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "@id": `${share.url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://wheelora.ai/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${share.wheel.emoji} ${share.wheel.name}`,
          item: share.url,
        },
      ],
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "tone", value: share.wheel.tone || "none" },
      { "@type": "PropertyValue", name: "wheelType", value: share.wheel.wheelType },
      { "@type": "PropertyValue", name: "aiGenerated", value: String(isAi) },
      { "@type": "PropertyValue", name: "shareMode", value: share.wheel.presentation.shareMode },
    ],
    mainEntity: {
      "@type": "ItemList",
      name: `${share.wheel.name} options`,
      itemListElement: options.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
  });
}

/**
 * Ghost SEO block — 100% invisible to human eyes (lives inside .sr-only-meta),
 * but fully readable by LLM crawlers, bots, and preview scrapers.
 * Contains the wheel title, emoji, tone, result, and all options as clean HTML.
 */
function renderGhostSeoBlock(response: SharedWheelResponse) {
  const { share } = response;
  const { wheel } = share;
  const isAi = wheel.aiGenerated || !!share.primaryAiGenerationId;

  const optionsList = wheel.wheelType === "s"
    ? wheel.options.map((o) => `<li>${escapeHtml(o.label)} (weight: ${escapeHtml(String(o.weight))})</li>`).join("")
    : wheel.children.map((child) =>
        `<li>${escapeHtml(`${child.emoji} ${child.name}`)}: ${child.options.map((o) => escapeHtml(o.label)).join(", ")}</li>`,
      ).join("");

  const resultBlock = wheel.presentation.resultLabel
    ? `<p>Result: ${escapeHtml(wheel.presentation.resultLabel)}</p>`
    : "";

  return `
    <h1>${escapeHtml(`${wheel.emoji} ${wheel.name}`)}</h1>
    ${isAi ? "<p>AI-generated wheel.</p>" : ""}
    ${wheel.tone ? `<p>Tone: ${escapeHtml(wheel.tone)}</p>` : ""}
    ${resultBlock}
    <p>${escapeHtml(String(wheel.optionCount))} options — ${escapeHtml(wheel.wheelType === "s" ? "single wheel" : "wheel set")}</p>
    <ul>${optionsList}</ul>
    <p><a href="${escapeHtml(share.url)}">Open ${escapeHtml(`${wheel.emoji} ${wheel.name}`)} on Wheelora</a></p>
  `;
}

// Legacy stubs — no longer emit visible markup, but kept to avoid
// breaking any future calls. Ghost SEO is handled by renderGhostSeoBlock.
function renderWheelStructure(_payload: SharedWheelResponse["share"]["wheel"]) {
  return "";
}

function renderWheeloraFallback(_share: SharedWheelResponse["share"]) {
  return ""; // Fallback content is now handled by the ghost SEO block
}

function renderWheeloraAttributes(_share: SharedWheelResponse["share"]) {
  return ""; // Attributes no longer needed — widget decoupled from sharing page
}

/**
 * Renders the ghost SEO content that fills the __SHARED_WHEEL_CONTENT__ marker.
 * This markup lives inside .sr-only-meta — 100% invisible to humans but
 * fully readable by LLM crawlers, bots, and link preview scrapers.
 */
function renderSharedWheelContent(response: SharedWheelResponse) {
  return renderGhostSeoBlock(response);
}

function renderSharedWheelHead(response: SharedWheelResponse) {
  const { share } = response;
  const title = `${share.wheel.emoji} ${share.wheel.name} | Shared Wheel | Wheelora™`;
  const description = buildSharedWheelSummary(response);

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Wheelora" />
    <link rel="canonical" href="${escapeHtml(share.url)}" />
    <link rel="alternate" type="text/plain" href="https://wheelora.ai/llms.txt" title="Wheelora AI-readable site summary" />
    <link rel="alternate" type="text/plain" href="https://wheelora.ai/llms-full.txt" title="Wheelora full AI-readable context" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${escapeHtml(share.url)}" />
    <meta property="og:site_name" content="Wheelora™" />
    <meta property="og:image" content="https://wheelora.ai/assets/brand/wheelora-social-1200x630.png" />
    <meta property="og:image:alt" content="${escapeHtml(description)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="https://wheelora.ai/assets/brand/wheelora-social-1200x630.png" />
    <meta name="twitter:image:alt" content="${escapeHtml(description)}" />
    <meta name="twitter:url" content="${escapeHtml(share.url)}" />
    <script type="application/ld+json">${renderSharedWheelStructuredData(response)}</script>
  `;
}

async function renderSharedWheelPage(slug: string) {
  const file = Bun.file(`${root}/w/index.html`);
  if (!(await file.exists())) return notFoundResponse();

  const shared = await fetchSharedWheel(slug);
  if (!shared) return notFoundResponse();

  const template = await file.text();
  const html = injectSharedWheelPage(template, {
    head: renderSharedWheelHead(shared),
    content: renderSharedWheelContent(shared),
    json: escapeJsonForScript(shared),
    appUrl: shared.share.appUrl,
  });

  return withSecurityHeaders(
    new Response(html, {
      headers: htmlHeaders,
    }),
  );
}

async function renderReferralPage(code: string) {
  const file = Bun.file(`${root}/r/index.html`);
  if (!(await file.exists())) return notFoundResponse();

  try {
    const template = await file.text();
    return withSecurityHeaders(
      new Response(injectReferralPage(template, code), {
        headers: htmlHeaders,
      }),
    );
  } catch (error) {
    console.error(`Failed to render referral page for ${code}`, error);
    return notFoundResponse();
  }
}

async function renderEmbedData(slug: string) {
  const shared = await fetchSharedWheel(slug);
  if (!shared) return notFoundResponse();

  return withExtraHeaders(
    withSecurityHeaders(
      new Response(JSON.stringify({ share: shared.share }), {
        headers: {
          "Cache-Control": "no-cache, no-transform",
          "Content-Type": types[".json"],
        },
      }),
    ),
    {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  );
}

async function responseFor(pathname: string) {
  const clean = cleanPath(pathname);
  if (!clean) return notFoundResponse();

  const candidates = clean.endsWith("/")
    ? [`${root}/${clean}index.html`]
    : [`${root}/${clean}`, `${root}/${clean}/index.html`];

  for (const filePath of candidates) {
    const file = Bun.file(filePath);
    if (await file.exists()) {
      const ext = filePath.match(/\.[^.]+$/)?.[0] ?? "";
      const isAppleAppSiteAssociation =
        filePath.split("/").at(-1) === "apple-app-site-association";
      if (ext === ".html") {
        const template = await file.text();
        if (template.includes(legalContentMarker)) {
          const legalPathname = normalizeLegalPathname(pathname);
          if (legalPathname) {
            return renderLegalPage(legalPathname);
          }

          console.error(`Blocked unresolved legal placeholder in static HTML response for ${pathname}`);
          return withSecurityHeaders(
            new Response(
              injectLegalContent(
                template,
                "<p>Could not load legal content right now. Please try again in a moment.</p>",
              ),
              { status: 503, headers: htmlHeaders },
            ),
          );
        }
      }

      return withSecurityHeaders(
        new Response(file, {
          headers: {
            "Cache-Control":
              ext === ".html"
                ? "no-cache"
                : isAppleAppSiteAssociation
                  ? "public, max-age=3600"
                  : "public, max-age=31536000, immutable",
            "Content-Type": contentTypeForStaticPath(filePath),
          },
        }),
      );
    }
  }

  return notFoundResponse();
}

async function proxyApi(request: Request, pathname: string) {
  if (!internalApiBase) return notFoundResponse();

  const url = new URL(request.url);
  const target = new URL(`${internalApiBase}${pathname.replace(/^\/api/, "")}${url.search}`);
  const headers = new Headers(request.headers);
  for (const header of hopByHopProxyHeaders) {
    headers.delete(header);
  }
  headers.set("host", target.host);

  try {
    const response = await fetch(target, {
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      headers,
      method: request.method,
      redirect: "manual",
      signal: AbortSignal.timeout(apiProxyTimeoutMs),
    });
    return withSecurityHeaders(response);
  } catch (error) {
    console.error(`API proxy request failed for ${pathname}`, error);
    return withSecurityHeaders(
      new Response("Upstream API unavailable", {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
    );
  }
}

export function handleRequest(request: Request) {
  const pathname = new URL(request.url).pathname;
  const legalPathname = normalizeLegalPathname(pathname);
  const sharedWheelSlug = normalizeSharedWheelPathname(pathname);
  const referralCode = normalizeReferralPathname(pathname);
  const embedDataSlug = normalizeEmbedDataPathname(pathname);
  const sharedWheelIndex = (pathname.replace(/\/+$/, "") || "/") === "/w";
  const referralIndex = isReferralIndexPathname(pathname);
  if (legalPathname) {
    return renderLegalPage(legalPathname);
  }
  if (referralCode) {
    return renderReferralPage(referralCode);
  }
  if (sharedWheelSlug) {
    return renderSharedWheelPage(sharedWheelSlug);
  }
  if (sharedWheelIndex) {
    return notFoundResponse();
  }
  if (referralIndex) {
    return notFoundResponse();
  }
  if (embedDataSlug) {
    return renderEmbedData(embedDataSlug);
  }
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return proxyApi(request, pathname);
  }

  return responseFor(pathname);
}

if (import.meta.main) {
  Bun.serve({
    hostname: "0.0.0.0",
    port,
    fetch: handleRequest,
  });

  console.log(`Wheelora web listening on ${port}`);
}
