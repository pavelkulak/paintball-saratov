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
  "address": "Саратов",
  "quiz": {
    "total": 5,
    "questions": [
      {
        "id": "audience",
        "question": "Для кого подбираем игру?",
        "answers": [
          { "id": "children", "label": "Детский" },
          { "id": "adults", "label": "Взрослый" },
          { "id": "mixed", "label": "Смешанный вариант" }
        ]
      }
    ]
  },
  "reviews": [
    {
      "id": "irina-m",
      "name": "Ирина М.",
      "avatarUrl": null,
      "rating": 5,
      "publishedAt": "2026-03-01",
      "text": "Полный текст отзыва"
    }
  ]
}
```

Endpoint читает контент главной страницы, активные элементы квиза и отзывы. Внешний контракт не раскрывает
`IBLOCK_ID`, `PROPERTY_*`, SQL-структуру или внутренние ошибки Bitrix.

Вопросы хранятся отдельными элементами Bitrix, поэтому их можно менять в CMS;
ответы каждого вопроса хранятся в JSON-поле элемента и преобразуются endpoint-ом
в публичный массив `answers`.

Отзывы хранятся в инфоблоке `landing_reviews`. В элементе используются штатные
поля `NAME` (имя), `PREVIEW_PICTURE` (аватар), `ACTIVE_FROM` (дата) и
`DETAIL_TEXT` (полный отзыв), а рейтинг хранится в обязательном числовом поле
`RATING`. Endpoint принимает только целое значение рейтинга от 1 до 5. Если
аватар не загружен, `avatarUrl` равен `null`, а frontend показывает инициалы.

## Контент

Ядро устанавливается в `cms/bitrix/` и не редактируется. Проектный PHP-код,
endpoint и другие интеграции находятся в `cms/local/` и коммитятся.
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
