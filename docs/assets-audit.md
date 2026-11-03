# Аудит статических ассетов

Дата: 2026-11-03. Ветка dev, коммит 1da4f731e1efc78dfd672e0c35995d57291e09dd.

Проверены 85 файлов public, все отслеживаемые исходники, конфигурация, CMS-код и скрипты. Проверены динамические URL мобильных социальных иконок и связи компонентов с src/app/page.tsx. Codebase Memory имеет устаревший индекс и недоступные метаданные покрытия, поэтому выводы основаны на прямом чтении актуальных файлов.

## Не используются основным приложением

28 файлов, 2 090 771 байт (1,99 МиБ). Нет ссылок по пути или имени и не найден механизм динамического подключения этих групп. Все файлы public всё равно копируются в статический экспорт, поэтому наличие в out не означает использование страницей.

| Файл                                     |   Байт | Примечание                                                           |
| ---------------------------------------- | -----: | -------------------------------------------------------------------- |
| public/images/earth.jpg                  | 256167 | Ссылок в основном проекте нет                                        |
| public/images/formats/1.svg              |   1429 | Ссылок в основном проекте нет                                        |
| public/images/formats/2.svg              |    853 | Ссылок в основном проекте нет                                        |
| public/images/formats/3.svg              |    730 | Ссылок в основном проекте нет                                        |
| public/images/formats/4.svg              |   1325 | Ссылок в основном проекте нет                                        |
| public/images/formats/5.svg              |   1417 | Ссылок в основном проекте нет                                        |
| public/images/formats/6.svg              |    788 | Ссылок в основном проекте нет                                        |
| public/images/hero-players-full.webp     | 159398 | Используется отдельной копией Демо-сборка, из её собственного public |
| public/images/hero-players.png           | 262251 | Ссылок в основном проекте нет                                        |
| public/images/jupiter.jpg                | 229618 | Ссылок в основном проекте нет                                        |
| public/images/mars.jpg                   |  27134 | Ссылок в основном проекте нет                                        |
| public/images/neptune.jpg                | 202436 | Ссылок в основном проекте нет                                        |
| public/images/process/process-01.webp    |  17304 | Ссылок в основном проекте нет                                        |
| public/images/process/process-02.webp    |  16176 | Ссылок в основном проекте нет                                        |
| public/images/process/process-03.webp    |  15544 | Ссылок в основном проекте нет                                        |
| public/images/process/process-04.webp    |  16886 | Ссылок в основном проекте нет                                        |
| public/images/process/process-05.webp    |  18192 | Ссылок в основном проекте нет                                        |
| public/images/process/process-06.webp    |  21274 | Ссылок в основном проекте нет                                        |
| public/images/safety-players-new.webp    | 140796 | Используется отдельной копией Демо-сборка, из её собственного public |
| public/images/safety-players.webp        | 142390 | Ссылок в основном проекте нет                                        |
| public/images/saturn.jpg                 | 237811 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-01.webp |  20474 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-02.webp |  21124 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-03.webp |  22170 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-04.webp |  12008 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-05.webp |  20474 | Ссылок в основном проекте нет                                        |
| public/images/scenarios/scenario-06.webp |  21124 | Ссылок в основном проекте нет                                        |
| public/images/uranus.jpg                 | 203478 | Ссылок в основном проекте нет                                        |

## Используемые ресурсы, которые нельзя включать в старый список

- Hero.tsx: hero-players-family.webp; HeroParallaxScene.tsx: hero-background.webp.
- SafetyShowcase.tsx: safety-players-family.webp.
- EventProcessOrbit.tsx: process/updated/step-01.webp — step-06.webp.
- EventSupportSection.tsx: все шесть изображений event-support.
- Форматы используют React SVG-компоненты FormatIcons.tsx; старые public/images/formats/1.svg — 6.svg не подключаются. format-camouflage.svg используется.
- Обе mobile-menu SVG подключаются шаблонным URL; шрифт, og.jpg, showcase-scroll.js, видео и постер используются.

## Связь с Демо-сборка

Это самостоятельная локальная копия проекта со своими src, public, tools, package.json, next.config.ts, out и .next. Основное приложение не импортирует файлы этой папки и не копирует из неё ассеты. Скрипты определяют projectRoot относительно собственного tools/scripts/project.mjs.

Упоминания в конфигурации основного проекта только исключают папку: .gitignore, .prettierignore, eslint.config.mjs, tsconfig.json. Папка не отслеживается Git и не входит в обычный деплой GitHub → Vercel.

CONTENT_SOURCE=demo относится к src/lib/bitrix/home-demo.ts. build-sites.mjs собирает основной проект с этими данными в out и dist; папку Демо-сборка он не читает.

В самой демо-копии Hero.tsx использует hero-players-full.webp, а SafetyShowcase.tsx — safety-players-new.webp из собственного public. Это не делает одноимённые файлы основного public используемыми.

## Границы проверки

Аудит отражает ссылки в локальной dev и конфигурации сборки. Внешние ссылки на публичные URL, содержимое удалённой CMS и вручную загруженные деплои не проверялись. Сгенерированные out/dist/.next являются результатами прошлых сборок и не использованы как доказательство актуального использования. После аудита из основного public удалены перечисленные 28 файлов.
