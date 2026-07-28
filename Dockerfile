FROM oven/bun:1.3.14-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN --mount=type=cache,id=wheelora-web-bun-1.3.14,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS dev
COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun . .
USER bun
EXPOSE 4321
CMD ["bun", "run", "dev"]

FROM base AS production
ENV NODE_ENV=production
COPY --from=build --chown=bun:bun /app/dist ./dist
COPY --chown=bun:bun serve-static.ts ./serve-static.ts
USER bun
EXPOSE 4321
CMD ["bun", "serve-static.ts"]
