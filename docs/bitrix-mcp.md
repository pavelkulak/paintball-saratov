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
BITRIX_MCP_TINKER_ENABLED=0
```

MCP используется в read-only режиме. Сырые SQL-записи и произвольное PHP-
выполнение отключены; изменения контента должны проходить через отдельный,
явно запрошенный D7/public API workflow после резервной копии.

В пользовательской конфигурации Codex сервер запускается из корня проекта:

```toml
[mcp_servers.bitrix-mcp]
command = 'npm.cmd'
args = ['run', 'mcp:serve']
startup_timeout_sec = 120
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

Перед командами активируйте зафиксированный Node.js `22.22.3` через терминал
OSPanel:

```text
osp node install 22.22.3
osp node use 22.22.3
node -v
```

После переключения перезапустите терминал/Codex. MCP и Next.js должны работать
на одном Node.js.

Сначала проверьте индекс и root, затем ищите D7 API, события, ORM и компоненты.
Результат с warning, пустым индексом или недоступным root не считается
достоверным. В таком случае используйте прямые файлы и официальную документацию.

Индекс хранится в `.bitrix-mcp/` и не коммитится. После изменения `cms/local/`
или ядра Bitrix нужно повторить `npm run mcp:index`.

## Безопасность

- `BITRIX_MCP_DB_ALLOW_WRITE=0` остаётся выключенным всегда.
- raw SQL для записи не используется; read-only запросы допустимы только при
  явном подтверждении их режима чтения.
- Изменения контента проходят через D7/public API.
- Ядро `cms/bitrix/` не редактируется; проектный код находится в `cms/local/`.
- Не показывайте `.settings.php`, пароль БД и другие секреты.
