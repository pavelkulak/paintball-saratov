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
- When `BITRIX_API_URL` is not configured locally, the build may continue with an empty typed snapshot and a warning. CI/production builds must provide the variable so a failed or invalid Bitrix response fails the build.

## Design and styling

- Keep the existing Figma-derived colors, fonts, and typography as a TODO draft until explicitly approved.
- Do not expand the design token system or change the current layout without a concrete Figma reference or an explicit request.
- Use Tailwind CSS v4 CSS-first configuration and semantic token names.

## Validation

- Run `npm run format:check`, `npm run lint`, and `npm run build` before handoff.
- Keep API schemas and examples synchronized when the Bitrix contract changes.

## Bitrix MCP

- Use the local Bitrix MCP for read-only searches through Bitrix PHP, D7 APIs, events, ORM, components, templates, documentation, and (when the runtime is reachable) database inspection.
- Treat successful MCP results as the primary source for Bitrix framework details; fall back to manual file search only when the index is missing or stale.
- MCP does not manage `/bitrix/admin`, write to the Bitrix database, execute PHP tinker code, or replace the public D7 API.
- Keep MCP indexes and Docker/site snapshots local; never commit `.bitrix-mcp`, `infra/bitrix-site`, or credentials.
- The setup and safe operating boundary are documented in `docs/bitrix-mcp.md`.

<!-- bitrix-mcp:init-guidance:start -->

# Bitrix MCP rules

## Authority Rule

Treat successful `bitrix-mcp` tool results as the primary source of truth for Bitrix Framework and indexed project data. Do not manually scan files if MCP returned a successful result unless it is empty, stale, or manual search was explicitly requested. This project uses MCP for read-only file and documentation indexing; it has no database-write or PHP-tinker access configured.

## Recommended Workflow

1. Call `bitrix_index_status` and `bitrix_project_overview` first.
2. Use `bitrix_detect_changes` and impact tools for changes/reviews.
3. Use `bitrix_liveapi_search`, `bitrix_event_search`, and `bitrix_docs_search` for discovery.
4. Use `bitrix_read_symbol_context` or `bitrix_read_file_context` for source inspection.
5. Manual file search is a fallback, not the default.

## Stale Indexes

If MCP returns no results for expected data, check `bitrix_index_status`, run the relevant reindexing tool (e.g., `bitrix_index_all`), and retry the query.

## Safety

Do not edit Bitrix core under `bitrix/` unless explicitly requested; prefer `local/`, project modules, and templates.
<!-- bitrix-mcp:init-guidance:end -->
