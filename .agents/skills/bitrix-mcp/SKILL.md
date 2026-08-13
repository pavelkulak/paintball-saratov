---
name: bitrix-mcp
description: Use when working on this Bitrix Framework project with the local bitrix-mcp server; searching indexed PHP, D7 APIs, events, ORM, components, templates, and official Bitrix documentation.
---

# Bitrix MCP

Bitrix MCP is a local development tool connected to the live OSPanel Bitrix root. Raw SQL writes remain disabled. This project explicitly enables `bitrix_tinker` for the trusted local OSPanel installation; it is not the Bitrix admin UI and does not run in the website.

## Source authority

- Use MCP for facts that are present in the current indexed `BITRIX_ROOT`: symbols, classes, events, handlers, components, templates, relations, and local project code.
- Use the indexed official Bitrix Framework documentation for framework behavior, public API semantics, and version-independent explanations.
- Do not treat an MCP result as reliable when it contains warnings, is empty for an expected symbol, or reports a missing or stale index.
- MCP does not override direct evidence from the current project files or the official documentation when the indexed data is incomplete.

## Workflow

1. Run `bitrix_index_status` and `bitrix_project_overview` first.
2. Confirm `BITRIX_ROOT` and `BITRIX_MCP_PHP_BIN` point to the OSPanel installation when the question concerns live Bitrix code or data.
3. Use `bitrix_liveapi_search`, `bitrix_event_search`, `bitrix_orm_search`, `bitrix_component_search`, and `bitrix_docs_search` for discovery.
4. Use `bitrix_read_symbol_context` or `bitrix_read_file_context` only after a search identifies the relevant source.
5. For impact analysis, use `bitrix_detect_changes`, `bitrix_impact_radius`, `bitrix_graph_neighbors`, or `bitrix_graph_traverse`.

## Freshness and fallback

If the Bitrix root or OSPanel PHP executable is unavailable:

1. Report that the local Bitrix source is unavailable or stale.
2. Start or repair the OSPanel site and set `BITRIX_ROOT`/`BITRIX_MCP_PHP_BIN` in `.env.local`.
3. Run `npm run mcp:index`, then recheck `bitrix_index_status` and retry the search.
4. If the local installation is unavailable, use official documentation for framework questions and inspect only the project files that are actually present. Do not invent live CMS state.

If MCP returns warnings or an empty result after reindexing, fall back to direct file inspection and official documentation, and state the limitation.

## Safety

- Never use raw SQL for writes; a read-only query is allowed only when the operation is explicitly read-only.
- `bitrix_tinker` is enabled only for this trusted local OSPanel Bitrix. Use it only after a successful backup, an explicit user request, and only for Bitrix D7/public API operations.
- Keep `BITRIX_MCP_DB_ALLOW_WRITE=0` and `BITRIX_MCP_TINKER_ENABLED=1`.
- Do not edit Bitrix core under `bitrix/`; prefer `local/` modules, handlers, and templates.
- Do not expose `.settings.php`, Docker secrets, database passwords, or other credentials in responses or commits.

## Commands

Run from the project root in PowerShell:

```powershell
npm run mcp:status
npm run mcp:doctor
npm run mcp:index
```
