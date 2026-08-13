# Bitrix MCP в Paintball

Bitrix MCP — локальный read-only инструмент разработки. Он индексирует проект, snapshot установленного Bitrix, PHP/D7-код, события, ORM, компоненты, шаблоны и официальную документацию. MCP не участвует в runtime сайта и не управляет `/bitrix/admin`.

## Установка

Из корня проекта в PowerShell:

```powershell
npm run setup
```

Runtime лежит в `tools/bitrix-mcp`. Во время `npm run setup` точный Node.js `22.22.3` устанавливается в локальный `tools/node-runtime`, не в `node_modules`; MCP запускает CLI через этот runtime без сетевого запроса.

## Codex

Конфигурация MCP хранится в пользовательском `C:\Users\<user>\.codex\config.toml`, но не содержит абсолютного пути проекта:

```toml
[mcp_servers.bitrix-mcp]
command = 'npm.cmd'
args = ['run', 'mcp:serve']
startup_timeout_sec = 120

[mcp_servers.bitrix-mcp.env]
BITRIX_MCP_SEMANTIC_ENABLED = '0'
BITRIX_MCP_OFFICIAL_DOCS_ENABLED = '1'
BITRIX_MCP_DB_ENABLED = '1'
BITRIX_MCP_DB_ALLOW_WRITE = '0'
BITRIX_MCP_TINKER_ENABLED = '0'
```

Codex должен запускать MCP из корня проекта. После изменения конфигурации перезапусти Codex. Project skill находится в `.agents/skills/bitrix-mcp/SKILL.md` и коммитится вместе с проектом.

## Команды

```powershell
npm run mcp:status
npm run mcp:config
npm run mcp:doctor
npm run mcp:index
```

`mcp:doctor` проверяет пути, SQLite, документацию и текущую конфигурацию. Warnings нельзя игнорировать: при предупреждении, пустом индексе или старом snapshot результат поиска не считается надёжным.

## Bitrix snapshot

Официальный Docker Compose хранит `/opt/www` в named volume, поэтому Windows MCP получает локальную копию:

```powershell
npm run bitrix:snapshot
```

Команда:

1. проверяет работающий `dev_php`;
2. копирует `/opt/www` в `infra/bitrix-site`;
3. создаёт `infra/bitrix-site/.bitrix-snapshot.json` с UTC-временем;
4. автоматически запускает переиндексацию.

`tools/bitrix-mcp/run.mjs` автоматически использует `infra/bitrix-site` как `BITRIX_ROOT`, если в нём есть `bitrix/`. Ручной `BITRIX_ROOT` не нужен.

Snapshot не коммитится. Считай его устаревшим, если Bitrix-код или настройки изменились после timestamp в `.bitrix-snapshot.json`; повтори `npm run bitrix:snapshot`.

## Источники истины и fallback

- MCP — для успешных результатов из текущего индексированного проекта и snapshot.
- Официальная Bitrix-документация — для поведения Framework и публичных API.
- Прямые файлы — fallback, если MCP пустой, содержит warnings, индекс устарел или snapshot недоступен.

Если Bitrix root недоступен, сначала сообщи об ограничении и выполни `npm run bitrix:snapshot`. Если Docker недоступен, не делай выводов о live CMS: используй только имеющиеся файлы и официальную документацию.

## Безопасность

- `BITRIX_MCP_DB_ENABLED=1` даёт только чтение схемы и данных.
- `BITRIX_MCP_DB_ALLOW_WRITE=0` всегда оставляется выключенным.
- `BITRIX_MCP_TINKER_ENABLED=0`; произвольный PHP не выполняется.
- Не использовать `bitrix_db_execute` и `bitrix_tinker`.
- Не показывать `.settings.php`, пароли и секреты Docker.
- Не редактировать ядро `bitrix/`; для проекта использовать `local/`.

Локальные индексы находятся в `.bitrix-mcp`, snapshot — в `infra/bitrix-site`. Оба каталога исключены из Git.
