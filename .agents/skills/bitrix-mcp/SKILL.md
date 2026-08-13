---
name: bitrix-mcp
description: Use when working on this Bitrix Framework project with the local bitrix-mcp server; searching indexed PHP, D7 APIs, events, ORM, components, templates, and official Bitrix documentation.
---

# Bitrix MCP

Bitrix MCP is a local, read-only development tool. It is not the Bitrix admin UI, does not run in the website, and must not mutate the CMS database or execute arbitrary PHP.

## Source authority

- Use MCP for facts that are present in the current indexed project or snapshot: symbols, classes, events, handlers, components, templates, relations, and local project code.
- Use the indexed official Bitrix Framework documentation for framework behavior, public API semantics, and version-independent explanations.
- Do not treat an MCP result as reliable when it contains warnings, is empty for an expected symbol, reports a missing or stale index, or comes from an old snapshot.
- MCP does not override direct evidence from the current project files or the official documentation when the indexed data is incomplete.

## Workflow

1. Run `bitrix_index_status` and `bitrix_project_overview` first.
2. Confirm the snapshot timestamp from `infra/bitrix-site/.bitrix-snapshot.json` when the question concerns live Bitrix code or data.
3. Use `bitrix_liveapi_search`, `bitrix_event_search`, `bitrix_orm_search`, `bitrix_component_search`, and `bitrix_docs_search` for discovery.
4. Use `bitrix_read_symbol_context` or `bitrix_read_file_context` only after a search identifies the relevant source.
5. For impact analysis, use `bitrix_detect_changes`, `bitrix_impact_radius`, `bitrix_graph_neighbors`, or `bitrix_graph_traverse`.

## Freshness and fallback

If the Bitrix root is unavailable, the snapshot is missing, or the timestamp is not suitable for the request:

1. Report that the local Bitrix source is unavailable or stale.
2. Run `npm run bitrix:snapshot`; this refreshes `infra/bitrix-site` from the Docker PHP container and automatically reindexes MCP.
3. Recheck `bitrix_index_status` and retry the search.
4. If Docker or the container is unavailable, use official documentation for framework questions and inspect only the project files that are actually present. Do not invent live CMS state.

If MCP returns warnings or an empty result after reindexing, fall back to direct file inspection and official documentation, and state the limitation.

## Safety

- Never call or recommend `bitrix_db_execute`.
- Never enable or call `bitrix_tinker`.
- Keep `BITRIX_MCP_DB_ALLOW_WRITE=0` and `BITRIX_MCP_TINKER_ENABLED=0`.
- Do not edit Bitrix core under `bitrix/`; prefer `local/` modules, handlers, and templates.
- Do not expose `.settings.php`, Docker secrets, database passwords, or other credentials in responses or commits.

## Commands

Run from the project root in PowerShell:

```powershell
npm run mcp:status
npm run mcp:doctor
npm run mcp:index
npm run bitrix:snapshot
```
