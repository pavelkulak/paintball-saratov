# Bitrix headless CMS: запуск и интеграция

## Целевая схема

```text
Bitrix D7 API
  GET /api/v1/home  ->  next build  ->  static export
  POST /api/v1/leads <- browser     <- static site
```

Next.js не подключается к базе Bitrix и не знает внутренние `IBLOCK_ID` или `PROPERTY_*`.
Внешний API должен отдавать только стабильный JSON-контракт.

## Где запускать Bitrix

Для этого проекта оптимально оставить Bitrix на отдельном VPS, а статический Next.js разместить отдельно — на CDN/static hosting. Такой разнос упрощает деплой и не требует Node.js на production-сервере сайта.

Текущий вариант через Oracle Cloud можно оставить, если это Oracle Cloud VM с публичным IPv4, резервными копиями и доступом по SSH. Для BitrixVM используйте поддерживаемую конфигурацию BitrixVM на отдельной VM, а не размещайте CMS на том же хостинге, где лежит static export.

Практический минимум для CMS:

- Ubuntu/RHEL-совместимая VM по требованиям выбранной версии BitrixVM;
- 2 vCPU и 4 GB RAM для небольшого лендинга как стартовая конфигурация;
- SSD-диск от 40 GB;
- домен `cms.example.ru`;
- HTTPS через Let's Encrypt;
- закрытая база данных и SSH только по ключу;
- ежедневные backup VM/файлов и отдельный backup базы.

Фактические системные требования нужно сверить с версией BitrixVM и редакцией продукта перед созданием VM: требования меняются, поэтому не стоит фиксировать их только по этому файлу.

## Самый лёгкий вариант сейчас: Docker для разработки

Для локальной разработки лучше не собирать собственный образ и не использовать старые образы из Docker Hub. Официальная документация Bitrix рекомендует репозиторий `bitrix-tools/env-docker` именно для тестовой и development-среды. Он поднимает совместимое окружение с PHP, Nginx, базой и вспомогательными сервисами.

На Windows нужен запущенный Docker Desktop. Команды:

```bash
mkdir infra
git clone https://github.com/bitrix-tools/env-docker.git infra/bitrix
cd infra/bitrix
```

Перед первым запуском задайте пароли базы в `.env_sql` и секрет Push-сервера в `.env_push`, затем:

```bash
docker compose up -d
docker compose exec --user=bitrix php sh
cd /opt/www/
wget https://www.1c-bitrix.ru/download/scripts/bitrixsetup.php
exit
```

Откройте `http://localhost:8588/bitrixsetup.php` и пройдите мастер установки. Сайт Bitrix и этот Next.js проект остаются двумя отдельными проектами; в Next.js указываем `BITRIX_API_URL=http://localhost:8588` только если контейнер доступен из среды, где выполняется build.

Docker здесь — dev/test-вариант. Для постоянной CMS в production оставляем отдельную Oracle VM/VPS с BitrixEnv или BitrixVM, backup и HTTPS. Не используйте случайные старые Docker-образы: в Docker Hub много неофициальных и давно не обновлявшихся Bitrix-образов.

## API в Bitrix D7

Создайте собственный контроллер на базе `Bitrix\\Main\\Engine\\Controller` и два action-метода:

```text
GET  /api/v1/home
POST /api/v1/leads
```

Контроллер должен преобразовывать данные инфоблоков в публичную DTO-модель. В ответе не должны появляться SQL-структуры, идентификаторы инфоблоков, имена свойств и внутренние исключения.

Важно: стандартный ответ `Bitrix\\Main\\Engine\\Controller` обычно имеет оболочку `status/data/errors`. Для этого проекта нужен плоский ответ с корнями `common` и `modes`, поэтому action должен вернуть прямой JSON-ответ либо нужен небольшой route-adapter, который убирает служебную оболочку. Не меняйте схему Next.js на `status/data/errors` без отдельного решения по публичному контракту.

Сам `Engine\\Controller` обслуживает действия Bitrix через стандартный AJAX endpoint. Путь `/api/v1/home` нужно отдельно сопоставить с action через rewrite/route-adapter на стороне Bitrix. Внешний путь остаётся стабильным, а внутреннее имя action не публикуется.

Рекомендуемый ответ `GET /api/v1/home`:

```json
{
  "common": {
    "seo": {
      "title": "Paintball",
      "description": "..."
    },
    "phone": "+7 ...",
    "address": "...",
    "sections": []
  },
  "modes": {
    "paintball": {
      "slug": "paintball",
      "title": "...",
      "description": "...",
      "sections": []
    },
    "laserTag": {
      "slug": "laserTag",
      "title": "...",
      "description": "...",
      "sections": []
    },
    "kids": {
      "slug": "kids",
      "title": "...",
      "description": "...",
      "sections": []
    }
  }
}
```

На API включите CORS только для домена фронтенда, если он будет обращаться к `/api/v1/leads` из браузера. Для `GET /api/v1/home` CORS не нужен, если запрос выполняется только во время build на CI.

## Настройка Next.js

Скопируйте `.env.example` в `.env.local` и укажите базовый адрес Bitrix:

```env
BITRIX_API_URL=https://cms.example.ru
```

Во время `next build` Next.js вызовет:

```text
https://cms.example.ru/api/v1/home
```

Ответ проходит Zod-валидацию в `lib/bitrix/home.ts`. При неверном JSON сборка падает, чтобы битый контент не попал в static export.

Локально без `BITRIX_API_URL` сборка разрешается только при явном `BITRIX_ALLOW_EMPTY_SNAPSHOT=1`. В CI и production эта переменная не должна быть включена: `BITRIX_API_URL` обязателен.

## Формы

Форма отправляется напрямую в Bitrix:

```text
POST https://cms.example.ru/api/v1/leads
```

Для формы нужно отдельно добавить Zod-схему полей, защиту от спама/rate limit, проверку Origin/CORS и серверную валидацию в Bitrix. Секреты Bitrix нельзя помещать в клиентский код.

## Build/deploy

```text
Изменение в Bitrix
  -> webhook или ручной запуск CI
  -> BITRIX_API_URL
  -> npm ci
  -> npm run build
  -> публикация папки out/
```

Bitrix не должен быть доступен из runtime-файлов статического сайта. После сборки в `out/` остаются HTML/CSS/JS и ассеты.
