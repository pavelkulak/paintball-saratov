# Project rules

## Architecture

- Next.js App Router is the only frontend.
- The public site runs as a Node.js server with server-side rendering. Do not restore static export as the production mode.
- Bitrix with PHP and its database is deployed separately from the Next.js container. The frontend must never connect to the Bitrix database.
- Content is read from the stable public JSON contract `GET /api/v1/home` by server-only code at request time.
- Lead forms use the separate Bitrix D7 endpoint `POST /api/v1/leads`; keep this integration separate from the public content contract.
- Bitrix internal details such as `IBLOCK_ID`, `PROPERTY_*`, database fields, and ORM entities must not appear in the frontend contract.

## Data fetching

- Keep the Bitrix response validated at the boundary with Zod.
- Keep the request in a server-only module used by server-rendered routes.
- Fetch public content without caching so CMS edits appear on the next request. Change caching only with an explicit freshness decision.
- Do not add TanStack Query or client-side Bitrix content requests.
- `BITRIX_API_URL` is required at runtime, not during `next build`, and must remain server-only.

## Design and styling

- Keep the existing Figma-derived colors, fonts, and typography as a TODO draft until explicitly approved.
- Do not expand the design token system or change the current layout without a concrete Figma reference or an explicit request.
- Use Tailwind CSS v4 CSS-first configuration and semantic token names.

## Validation

- Run `npm run format:check`, `npm run lint`, and `npm run build` before handoff.
- Keep API schemas and examples synchronized when the Bitrix contract changes.

- Keep the Bitrix admin site, core, uploads, runtime configuration, and database outside this repository.
- The tracked `cms/local/` directory contains only project-owned PHP integration code for deployment into the separate Bitrix installation.
- Do not commit credentials or database connection settings.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
