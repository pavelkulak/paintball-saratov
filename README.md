# Paintball landing

Одностраничный лендинг на Next.js App Router, React, TypeScript, Tailwind CSS v4 и static export.

## Быстрый старт Windows

Требования:

- Node.js `22.22.3` и npm `10+`;
- Docker Desktop 4.30+ с Docker Compose v2.24+;
- свободные локальные порты `80`, `8588` и `8589`.

Версия Node закреплена в `.node-version`, `.nvmrc` и `package.json`. Для стандартного Windows PowerShell установите Node.js 22.22.3, затем из корня проекта:

```powershell
git clone <repository-url>
cd Paintball
npm run setup
```

`npm run setup` выполняет чистую установку frontend-зависимостей и локального Bitrix MCP runtime через lock-файлы.

Если политика PowerShell блокирует `npm.ps1`, используй эквивалентные команды с `npm.cmd`, например `npm.cmd run setup`.

## Bitrix Docker

Официальное development-окружение Bitrix уже находится в `infra/bitrix` и зафиксировано коммитом в `infra/bitrix.env-docker.commit`. Локальные `.env_sql` и `.env_push` содержат секреты и не коммитятся.

Запуск и проверка:

```powershell
npm run bitrix:up
npm run bitrix:status
```

Откройте [http://localhost:8588](http://localhost:8588). После завершения мастера установки Bitrix контейнер `dev_php` должен содержать `/opt/www/bitrix`.

Получение локального snapshot и автоматическая индексация:

```powershell
npm run bitrix:snapshot
```

Команда копирует `/opt/www` из контейнера `dev_php` в `infra/bitrix-site`, создаёт `infra/bitrix-site/.bitrix-snapshot.json` с UTC-временем и запускает `npm run mcp:index`. Snapshot нужен только MCP и не является production-копией CMS.

Остановка:

```powershell
npm run bitrix:down
```

## MCP и Codex

MCP runtime находится в `tools/bitrix-mcp`, а project skill — в [.agents/skills/bitrix-mcp/SKILL.md](.agents/skills/bitrix-mcp/SKILL.md). Конфигурация Codex использует `npm run mcp:serve`, поэтому в репозитории и командах нет абсолютного пути конкретного пользователя.

После перезапуска Codex доступны MCP-инструменты для индексированного PHP/Bitrix-кода, D7 API, событий, ORM, компонентов, шаблонов и официальной документации. База подключается только read-only; запись SQL и PHP Tinker запрещены.

Проверки:

```powershell
npm run mcp:status
npm run mcp:config
npm run mcp:doctor
npm run mcp:index
```

Если Bitrix root недоступен, MCP может искать только по проекту и документации. После запуска Docker повторите `npm run bitrix:snapshot`; snapshot обновится и индекс автоматически перестроится.

## Build и static preview

Для локальной разработки без API в `.env.local` явно установлен `BITRIX_ALLOW_EMPTY_SNAPSHOT=1`. Без этого флага `next build` требует `BITRIX_API_URL` и завершается ошибкой.

Для настоящей сборки:

```powershell
$env:BITRIX_API_URL = 'http://localhost:8588'
npm run build
```

Production/CI обязаны передавать `BITRIX_API_URL` и не должны включать `BITRIX_ALLOW_EMPTY_SNAPSHOT`.

Сборка создаёт `out/`. Preview static export:

```powershell
npm run preview
```

`npm run start` является алиасом static preview; `next start` не используется с `output: 'export'`.

## Команды проекта

```text
npm run setup           чистая установка frontend + MCP зависимостей
npm run bitrix:status   состояние Docker-контейнеров Bitrix
npm run bitrix:snapshot snapshot CMS и переиндексация MCP
npm run mcp:index       переиндексация проекта, snapshot и документации
npm run mcp:doctor      диагностика MCP
npm run check           format:check + lint + build
npm run verify          smoke-check всего окружения
```

`npm run verify` проверяет Node.js, зависимости, Docker, `localhost:8588`, snapshot с timestamp, непустой Bitrix index, MCP doctor, project skill и `npm run check`.

## Локальные данные и секреты

- `node_modules/` и `tools/bitrix-mcp/node_modules/` — зависимости;
- `tools/node-runtime/` — локальный Node.js `22.22.3`, созданный `npm run setup`;
- `.bitrix-mcp/` — SQLite-индексы и скачанная документация MCP;
- `infra/bitrix-site/` — локальный snapshot Bitrix;
- `infra/bitrix/.env_sql` — пароли MySQL/PostgreSQL;
- `infra/bitrix/.env_push` — ключ Push-сервера;
- `.env.local` — локальные переменные Next.js.

Эти каталоги и файлы исключены из Git. Не публикуйте `.settings.php`, database credentials или содержимое Docker env-файлов.

## Архитектура Bitrix

Bitrix используется как headless CMS. Next.js получает `GET /api/v1/home` только во время `next build`, а формы отправляются в отдельный `POST /api/v1/leads`. Production frontend остаётся статическим и не подключается к базе Bitrix. Подробный контракт и правила находятся в [docs/bitrix-headless.md](docs/bitrix-headless.md), workflow MCP — в [docs/bitrix-mcp.md](docs/bitrix-mcp.md).
