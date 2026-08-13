# Paintball landing

Одностраничный лендинг на Next.js App Router с TypeScript, Tailwind CSS v4 и static export.

## Команды

```bash
npm run dev
npm run lint
npm run format:check
npm run build
```

Готовый статический сайт после сборки находится в папке `out/`.

## Bitrix

Архитектура headless CMS, build-time загрузчик `GET /api/v1/home`, Zod-контракт и инструкция по размещению находятся в [docs/bitrix-headless.md](docs/bitrix-headless.md). Для подключения CMS скопируйте `.env.example` в `.env.local` и укажите `BITRIX_API_URL`.
