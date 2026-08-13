# Bitrix headless CMS

## Целевая схема

```text
OSPanel Bitrix
      ↓
GET /api/v1/home
      ↓
Next.js build + Zod
      ↓
Static Export: out/
```

Next.js не подключается к базе Bitrix и не выполняет запросы в браузере.

## Публичный контракт

```json
{
  "title": "Пейнтбол в Саратове",
  "description": "Тестовый текст из Bitrix",
  "phone": "+7 000 000-00-00",
  "address": "Саратов"
}
```

Endpoint читает активный элемент инфоблока `landing_home` с кодом `home` и
возвращает только четыре публичных поля. Внешний контракт не раскрывает
`IBLOCK_ID`, `PROPERTY_*`, SQL-структуру или внутренние ошибки Bitrix.

## Контент

Ядро устанавливается в `cms/bitrix/` и не редактируется. Проектный PHP-код,
bootstrap-скрипты и endpoint находятся в `cms/local/` и коммитятся.
Изменения в админке выполняются через D7/public API. Raw SQL write запрещён.

## Сборка

```powershell
$env:BITRIX_API_URL = 'http://paintball-bitrix.local/api/v1/home'
npm run build
```

Во время сборки `lib/bitrix/home.ts` загружает JSON и проверяет его схемой Zod.
При отсутствии URL или недоступном Bitrix сборка завершается ошибкой.

Формы и отдельный lead endpoint будут добавлены следующим этапом; в текущий
контракт они не входят.
