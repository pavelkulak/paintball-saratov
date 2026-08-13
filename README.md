# Paintball landing

Одностраничный статический frontend на Next.js App Router, React, TypeScript,
Tailwind CSS v4 и static export. Bitrix работает как headless CMS в OSPanel.

## Схема окружения

```text
OSPanel Bitrix (cms/) -> GET /api/v1/home -> Zod -> next build -> out/
                                  ^
                                  |
                           Bitrix MCP / D7
```

В production Node.js не нужен: Bitrix заполняет данные до сборки, а пользователю
отдаётся папка `out/`.

## Установка

Требования:

- Node.js `22.23.2`;
- OSPanel с PHP CLI и MySQL/MariaDB;
- установленный чистый Bitrix в `cms/`;
- локальный домен `paintball-bitrix.local`, document root — `cms/`.

Node.js устанавливается системно и проверяется командой `node -v`; проект
требует `v22.23.2`.

```powershell
git clone <repository-url>
cd Paintball
npm run setup
```

`npm run setup` ставит frontend-зависимости и пакет MCP по lock-файлам. Отдельный
Node runtime и Docker для работы проекта не используются.

## Bitrix в OSPanel

1. В OSPanel выберите PHP 8.2 или другую версию, совместимую с установленной
   редакцией Bitrix.
2. Создайте домен `paintball-bitrix.local` и направьте его document root на
   `D:\Site-Creative\Paintball\cms`.
3. Установите чистый Bitrix без демо-сайта. Ядро окажется в `cms/bitrix/`, а
   проектный код — в `cms/local/`.
4. Проверьте `http://paintball-bitrix.local/` и `/bitrix/admin`.
5. Проверьте PHP CLI:

```powershell
D:\OSPanel\modules\PHP-8.2\php.exe -v
```

Скопируйте `.env.example` в `.env.local` и проверьте пути. `BITRIX_ROOT` должен
указывать на `cms`, а `BITRIX_MCP_PHP_BIN` — на реальный `php.exe` OSPanel.

## MCP

MCP индексирует живой `BITRIX_ROOT` из OSPanel.

```powershell
npm run mcp:status
npm run mcp:config
npm run mcp:doctor
npm run mcp:index
```

Project skill находится в [.agents/skills/bitrix-mcp/SKILL.md](.agents/skills/bitrix-mcp/SKILL.md).
После изменения MCP-конфигурации перезапустите Codex.

После индексации `mcp:doctor` может показать parser-fallback для отдельных
файлов ядра Bitrix. Такие результаты MCP не считаются полностью надёжными;
для них используйте прямой исходник `cms/bitrix/` и официальную документацию.
Проектный код в `cms/local/` должен индексироваться без таких предупреждений.

MCP используется для поиска текущего PHP/D7-кода, событий, ORM, компонентов и
документации. Raw SQL write запрещён. Для локального OSPanel включён
`bitrix_tinker`; изменения выполняются только через D7/public API после
резервного копирования.

Перед изменениями через MCP сделайте backup базы одной командой; пароль вводится
интерактивно:

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
& 'D:\OSPanel\modules\MySQL-8.0\bin\mysqldump.exe' -h 127.0.1.30 -P 3306 -u paintball -p paintball_bitrix > backups\paintball_bitrix.sql
```

## Тестовый контент и endpoint

После чистой установки можно создать тестовую структуру через MCP/D7 либо
запустить bootstrap-скрипт:

```powershell
D:\OSPanel\modules\PHP-8.2\php.exe cms/local/cli/setup-content.php
```

Публичный endpoint:

```text
GET http://paintball-bitrix.local/api/v1/home
```

Он возвращает только стабильный контракт:

```json
{
  "title": "Пейнтбол в Саратове",
  "description": "Тестовый текст из Bitrix",
  "phone": "+7 000 000-00-00",
  "address": "Саратов"
}
```

В ответ не попадают `IBLOCK_ID`, `PROPERTY_*`, SQL-структура и внутренние
исключения.

## Static build

`BITRIX_API_URL` используется только во время `next build`:

```powershell
$env:BITRIX_API_URL = 'http://paintball-bitrix.local/api/v1/home'
npm run build
npm run preview
```

Ответ проверяется Zod-схемой. Если URL не задан или Bitrix недоступен, сборка
падает.

Основные команды:

```text
npm run setup          установка зависимостей
npm run mcp:index      индексация живого Bitrix root
npm run mcp:doctor     диагностика MCP
npm run check          format:check + lint + build
npm run verify         smoke-check окружения и сборки
npm run preview        preview папки out/
```

## Что не коммитится

- `cms/bitrix/`, `cms/upload/`, кеши и конфигурация БД;
- `.env.local` и другие секреты;
- `.bitrix-mcp/` — локальный индекс;
- `node_modules/`, `.next/`, `out/` и резервные копии.

`cms/local/` и endpoint в нём являются проектным кодом и коммитятся.

## Архитектурные правила

- Next.js — единственный frontend и статический export.
- Bitrix — headless CMS.
- Контент читается только во время build.
- JSON проверяется Zod.
- Next.js не подключается к БД Bitrix.
- Ядро `cms/bitrix/` не редактируется.
- Сырые SQL-записи запрещены.
