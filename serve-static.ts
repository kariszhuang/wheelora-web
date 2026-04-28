const root = `${import.meta.dir}/dist`;
const port = Number(Bun.env.PORT ?? 4321);
const internalApiBase = Bun.env.INTERNAL_API_BASE?.replace(/\/$/, "") ?? "";
const legalContentMarker = "__LEGAL_CONTENT__";
const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "SAMEORIGIN",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
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

function cleanPath(pathname: string) {
  const decoded = decodeURIComponent(pathname);
  const withoutSlash = decoded.replace(/^\/+/, "");
  return withoutSlash.includes("..") ? null : withoutSlash || "index.html";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/"([^"]+)"/g, "&quot;$1&quot;")
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      (email) => `<a href="mailto:${email}">${email}</a>`,
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
      new Response(template.replace(legalContentMarker, injected), {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": types[".html"],
        },
      }),
    );
  } catch (error) {
    console.error(`Failed to render ${pathname} from internal legal API`, error);
    const template = await file.text();
    const fallback = "<p>Could not load legal content right now. Please try again in a moment.</p>";
    return withSecurityHeaders(
      new Response(template.replace(legalContentMarker, fallback), {
        status: 502,
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": types[".html"],
        },
      }),
    );
  }
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
      return withSecurityHeaders(
        new Response(file, {
          headers: {
            "Cache-Control":
              ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
            "Content-Type": types[ext] ?? "application/octet-stream",
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
  headers.set("host", target.host);

  const response = await fetch(target, {
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    headers,
    method: request.method,
    redirect: "manual",
  });
  return withSecurityHeaders(response);
}

Bun.serve({
  hostname: "0.0.0.0",
  port,
  fetch: (request) => {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/terms" || pathname === "/privacy") {
      return renderLegalPage(pathname);
    }
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return proxyApi(request, pathname);
    }

    return responseFor(pathname);
  },
});

console.log(`Wheelora web listening on ${port}`);
