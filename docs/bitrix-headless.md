# Bitrix headless CMS

## Runtime architecture

```text
Browser -> Next.js SSR (Node.js) -> GET /api/v1/home -> Bitrix PHP -> Bitrix DB
                         <- validated JSON (Zod) <-
```

Next.js fetches public content in a server-only module while rendering a page
request. The response uses `cache: 'no-store'`, so an edit in Bitrix appears on
the next request without rebuilding or redeploying Next.js. The browser receives
rendered HTML and does not request public content from Bitrix.

`BITRIX_API_URL` is a server-side runtime environment variable. It is not
required by `next build` and must not use the `NEXT_PUBLIC_` prefix. A missing or
unavailable endpoint causes the page request to fail; it does not prevent the
application image from being built.

The Next.js application runs in a Node.js container. Bitrix and its database run
as a separate PHP application and database service on the host. The same HTTP
contract is used on the home server and on Beget; only the runtime endpoint URL
changes.

## Public contract

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

The endpoint maps Bitrix fields to this stable public shape. It does not expose
`IBLOCK_ID`, `PROPERTY_*`, SQL details, or internal exceptions. The Next.js
boundary validates the response with Zod before rendering it.

## Current Bitrix content model

- The `landing_home` information block has the `home` item. Its name and preview
  text provide the title and description; `PHONE` and `ADDRESS` provide contact
  details.
- Each active item in `landing_quiz` is one question. `STEP` controls order and
  `ANSWERS_JSON` stores its answer array.
- Reviews are active items in `landing_reviews`. The name, preview image,
  activity date, detail text, and numeric `RATING` property are mapped to the
  public review object.

These are CMS records, not separately configured API routes. The PHP endpoint
builds arrays by reading all active records of a supported type. Once a
repeatable collection and its public fields are defined, adding another record
does not require a Next.js code change. Adding a new content type or a new visual
block requires implementing its mapping, Zod schema, and frontend renderer once.

Tariffs and formats are still stored in frontend data files and are not part of
the current Bitrix contract. Their CMS model and fields should be added as part
of the next content migration.

## Source layout and deployment

- `cms/local/api/home.php` is project-owned PHP integration code. Deploy this
  extension into the `local/` directory of the separately installed Bitrix
  instance.
- `cms/bitrix/`, `cms/upload/`, the Bitrix admin site, runtime configuration,
  and database are not part of the repository.
- The rewrite in `cms/.htaccess` maps `GET /api/v1/home` to the PHP endpoint.
- `Dockerfile` and `docker-compose.yml` run Next.js only. Configure
  `BITRIX_API_URL` in the deployment environment or local `.env` file.

If the content changes infrequently and request volume requires it, a bounded
server-side revalidation interval can be considered later. The current contract
prioritizes showing the latest CMS data on the next page request.
