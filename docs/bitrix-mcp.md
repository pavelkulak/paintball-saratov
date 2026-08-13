# Bitrix MCP в проекте Paintball

## Что это даёт

`@mb4it/bitrix-mcp` — локальный MCP-сервер для поиска по исходникам Bitrix, PHP-символам, событиям, ORM, компонентам, шаблонам и документации. Для нашего проекта также включён просмотр данных базы в read-only режиме.

Он не авторизуется в `/bitrix/admin` и не заменяет браузер. MCP работает с файлами, которые ему явно переданы через `BITRIX_MCP_WORKSPACE` и `BITRIX_ROOT`; доступ к базе включается отдельным флагом и остаётся только для чтения.

Архитектура проекта остаётся прежней:

```text
Bitrix Docker -> D7 JSON API -> Next.js build -> static export
```

MCP — инструмент разработки и анализа. Он не участвует в runtime сайта и не добавляет запросы к Bitrix в браузер.

## Что было исправлено относительно исходного примера

- Убран шаблон `local/templates/risk`: в этом проекте такого шаблона нет.
- Пути привязаны к `D:\Site-Creative\Paintball`.
- Runtime MCP хранится отдельно от зависимостей Next.js в `tools/bitrix-mcp`.
- Включён `BITRIX_MCP_DB_ENABLED=1` для чтения схемы и данных через `bitrix_db_*`; `BITRIX_MCP_DB_ALLOW_WRITE=0` оставлен выключенным.
- `BITRIX_MCP_TINKER_ENABLED=0`: произвольное выполнение PHP через MCP не разрешается.
- Семантический поиск выключен: для первого этапа достаточно локального SQLite FTS и официальной документации.
- Секреты Bitrix и пароли Docker не прописываются в MCP-конфигурации.

## Установка runtime

Из корня проекта:

```powershell
npm install --prefix tools/bitrix-mcp
```

Проверка runtime:

```powershell
$env:BITRIX_MCP_WORKSPACE = 'D:\Site-Creative\Paintball'
$env:BITRIX_MCP_DATA_DIR = 'D:\Site-Creative\Paintball\.bitrix-mcp'
$env:BITRIX_MCP_DOCS_DIR = 'D:\Site-Creative\Paintball\docs'
$env:BITRIX_MCP_SEMANTIC_ENABLED = '0'
$env:BITRIX_MCP_OFFICIAL_DOCS_ENABLED = '1'
$env:BITRIX_MCP_DB_ENABLED = '1'
$env:BITRIX_MCP_DB_ALLOW_WRITE = '0'
$env:BITRIX_MCP_TINKER_ENABLED = '0'

npm --prefix tools/bitrix-mcp run config
npm --prefix tools/bitrix-mcp run doctor
```

## Конфигурация Codex

В файл `C:\Users\<ИМЯ_ПОЛЬЗОВАТЕЛЯ>\.codex\config.toml` добавляется проектный MCP-сервер:

```toml
[mcp_servers.bitrix-mcp]
command = 'D:\\Site-Creative\\Paintball\\tools\\bitrix-mcp\\node_modules\\node\\bin\\node.exe'
args = ['--experimental-sqlite', 'D:\\Site-Creative\\Paintball\\tools\\bitrix-mcp\\node_modules\\@mb4it\\bitrix-mcp\\dist\\cli.js', 'serve']
startup_timeout_sec = 120

[mcp_servers.bitrix-mcp.env]
BITRIX_MCP_WORKSPACE = 'D:\\Site-Creative\\Paintball'
BITRIX_MCP_DATA_DIR = 'D:\\Site-Creative\\Paintball\\.bitrix-mcp'
BITRIX_MCP_DOCS_DIR = 'D:\\Site-Creative\\Paintball\\docs'
BITRIX_MCP_SEMANTIC_ENABLED = '0'
BITRIX_MCP_OFFICIAL_DOCS_ENABLED = '1'
BITRIX_MCP_DB_ENABLED = '1'
BITRIX_MCP_DB_ALLOW_WRITE = '0'
BITRIX_MCP_TINKER_ENABLED = '0'
```

`BITRIX_ROOT` добавляется только после появления доступной для Windows копии установленного Bitrix-кода. До этого MCP индексирует проект Next.js и локальную документацию, но не ядро Bitrix. Для `bitrix_db_*` также нужны доступные `bitrix/.settings.php` и сетевой доступ к MySQL.

После изменения `config.toml` нужно перезапустить Codex.

## Индексация проекта

Индекс Next.js и документации:

```powershell
npm --prefix tools/bitrix-mcp run index
```

Проверка индекса:

```powershell
npm --prefix tools/bitrix-mcp run status
```

Индекс `.bitrix-mcp` создаётся локально и не коммитится.

## Индексация Bitrix из Docker

Сейчас официальный Docker Compose хранит `/opt/www` в named volume `dev_www_data`. MCP на Windows не видит этот volume по HTTP: ему нужна файловая копия исходников.

После завершения установки CMS можно получить локальный снимок сайта:

```powershell
docker cp dev_php:/opt/www/. D:\Site-Creative\Paintball\infra\bitrix-site
```

Затем временно добавить в MCP-конфигурацию:

```toml
BITRIX_ROOT = 'D:\\Site-Creative\\Paintball\\infra\\bitrix-site'
```

И выполнить:

```powershell
npm --prefix tools/bitrix-mcp run index
```

`infra/bitrix-site` не является рабочей копией для деплоя и не заменяет Docker volume. Это локальный read-only snapshot для поиска по ядру, модулям и `local/`.

## Как просить Codex использовать MCP

Примеры запросов:

- «Проверь статус Bitrix MCP и найди регистрацию событий для модуля `main`».
- «Через Bitrix MCP найди D7-класс для чтения элементов инфоблока и покажи сигнатуру».
- «Найди все места, где используется этот обработчик, и оцени радиус изменений».
- «Проверь индекс и найди API для `Bitrix\\Main\\Engine\\Controller`».

Сначала используются результаты MCP, затем ручной поиск по файлам — только если индекс пустой или устарел.

## Что MCP не делает

- не входит в админку Bitrix;
- не нажимает кнопки в `/bitrix/admin`;
- не меняет инфоблоки, настройки или пользователей;
- не пишет в MySQL/PostgreSQL: `bitrix_db_execute` не зарегистрирован;
- не заменяет D7 API `/api/v1/home` и `/api/v1/leads`;
- не используется в production runtime.

Изменения контента делаем через админку Bitrix, а получение контента публичным сайтом — через стабильный D7 JSON API и build Next.js.
