# Bitrix MCP

Bitrix MCP — локальный инструмент разработки. Он индексирует живую установку
Bitrix в OSPanel, но не является админкой и не участвует в runtime сайта.

## Конфигурация

Переменные хранятся в `.env.local` и не коммитятся:

```env
BITRIX_MCP_WORKSPACE=D:\\Site-Creative\\Paintball
BITRIX_ROOT=D:\\Site-Creative\\Paintball\\cms
BITRIX_MCP_DATA_DIR=D:\\Site-Creative\\Paintball\\.bitrix-mcp
BITRIX_MCP_PHP_BIN=D:\\OSPanel\\modules\\PHP-8.2\\php.exe
BITRIX_MCP_DB_ENABLED=1
BITRIX_MCP_DB_ALLOW_WRITE=0
BITRIX_MCP_TINKER_ENABLED=1
```

Raw SQL write остаётся выключенным. Для доверенного локального OSPanel включён
`bitrix_tinker`: произвольный PHP выполняется только по явному запросу, а
изменения контента проходят через D7/public API после резервной копии. Не
используйте tinker на production или общей базе.

В пользовательской конфигурации Codex сервер запускается из корня проекта:

```toml
[mcp_servers.bitrix-mcp]
command = 'npm.cmd'
args = ['run', 'mcp:serve']
cwd = 'D:\\Site-Creative\\Paintball'
startup_timeout_sec = 120
env = { BITRIX_MCP_TINKER_ENABLED = '1', BITRIX_MCP_DB_ALLOW_WRITE = '0' }
```

После изменения конфигурации перезапустите Codex. Project skill коммитится в
`.agents/skills/bitrix-mcp/SKILL.md`.

## Рабочий процесс

```powershell
npm run mcp:status
npm run mcp:config
npm run mcp:doctor
npm run mcp:index
```

Системный Node.js должен быть версии `22.23.2`; проверьте это командой
`node -v`.

Сначала проверьте индекс и root, затем ищите D7 API, события, ORM и компоненты.
Результат с warning, пустым индексом или недоступным root не считается
достоверным. В таком случае используйте прямые файлы и официальную документацию.

Индекс хранится в `.bitrix-mcp/` и не коммитится. После изменения `cms/local/`
или ядра Bitrix нужно повторить `npm run mcp:index`.

## Безопасность

- `BITRIX_MCP_DB_ALLOW_WRITE=0` остаётся выключенным всегда.
- `BITRIX_MCP_TINKER_ENABLED=1` разрешён только для этого доверенного локального OSPanel.
- raw SQL для записи не используется; read-only запросы допустимы только при
  явном подтверждении их режима чтения.
- Изменения контента через tinker проходят через D7/public API после резервной копии.
- Ядро `cms/bitrix/` не редактируется; проектный код находится в `cms/local/`.
- Не показывайте `.settings.php`, пароль БД и другие секреты.
