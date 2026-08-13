# Project rules

## Architecture

- Next.js App Router is the only frontend.
- The public site is a static export. Do not add server-side rendering or runtime content requests.
- Bitrix is a headless CMS/backend only. The frontend must never connect to the Bitrix database.
- Content is read from the stable public JSON contract `GET /api/v1/home` during `next build` only.
- Lead forms use the separate Bitrix D7 endpoint `POST /api/v1/leads` from the browser.
- Bitrix internal details such as `IBLOCK_ID`, `PROPERTY_*`, database fields, and ORM entities must not appear in the frontend contract.

## Data fetching

- Keep the Bitrix response validated at the boundary with Zod.
- Keep the request in a server-only module used by statically generated routes.
- Do not add TanStack Query, Next Runtime caching, or client-side Bitrix content requests.
- A build without `BITRIX_API_URL` must fail. CI/production builds must provide `BITRIX_API_URL`.

## Design and styling

- Keep the existing Figma-derived colors, fonts, and typography as a TODO draft until explicitly approved.
- Do not expand the design token system or change the current layout without a concrete Figma reference or an explicit request.
- Use Tailwind CSS v4 CSS-first configuration and semantic token names.

## Validation

- Run `npm run format:check`, `npm run lint`, and `npm run build` before handoff.
- Keep API schemas and examples synchronized when the Bitrix contract changes.

## Bitrix MCP

- Bitrix MCP is a local development aid, not the website runtime or Bitrix admin UI.
- Keep raw SQL writes disabled. The local OSPanel-only `bitrix_tinker` capability may execute explicitly requested D7/public API mutations after a backup; production and shared databases stay read-only.
- Do not commit `.bitrix-mcp`, `cms/bitrix`, `cms/upload`, runtime configuration, or credentials.
- Use the project skill in `.agents/skills/bitrix-mcp/SKILL.md` for the MCP workflow and fallback rules.
