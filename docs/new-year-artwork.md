# Новогодние изображения

Исходные файлы: `NY_hero_all.png`, `NY_hero_childs.png`, `NY_hero_adults.png`,
`NY_security_all.png`, `NY_security_childs.png`.
Готовые ассеты находятся в `public/images/new-year/` и выбираются через `src/lib/site-artwork.ts`.

- Desktop hero: 871×706, прозрачный WebP. У исходников 1440×998 удалены избыточные прозрачные поля; фигуры вписаны целиком и выровнены по низу. Для «Для всех» используется область x=107, y=251, 874×747: кадрирование по фигурам и шапке, без отдельных следов тени справа. Автоматическая обрезка по всему alpha-каналу учитывала эти следы и ошибочно уменьшала людей.
- Mobile hero: 1207×1303, как существующие мобильные изображения. Нижняя часть фигур продолжена до бёдер встроенным ImageGen; головы и новогодние аксессуары сохранены. Это отдельные мобильные варианты, а не растянутые desktop-файлы.
- Безопасность: 1440×1053. Исходник 1198×1053 дополнен прозрачными полями по 121 px слева и справа. Оба предоставленных файла побайтно одинаковы и используют один `safety-group.webp`.
- Мобильные «Для всех» и «Для взрослых» дополнительно равномерно масштабированы внутри того же холста по ширине обычных вариантов: ×1.1178 и ×1.0511 соответственно. Верхняя часть сохранена; обрезана только нижняя дорисованная часть. Общая CSS-позиция hero не менялась.
- Экспорт: Sharp WebP quality 82–85, alphaQuality 100, effort 6. Прозрачность сохранена.
- Оригинальные обычные ассеты не заменены; мобильная семейная PNG остаётся в прежнем виде.

## Промпт мобильных вариантов

Режим: встроенный ImageGen, edit, transparent background. По одному вызову с соответствующим `NY_hero_*.png` как edit target для каждой аудитории.

```text
Edit target: attached transparent Christmas paintball hero cutout. Create its MOBILE portrait variant, approximately 1207:1303 aspect ratio. Preserve the exact same people, exact faces, exact Christmas hats/scarves/garlands/holly, black and fluorescent yellow paintball clothes, props, relative arrangement, lighting and photorealistic rendering. Remove excess empty transparent canvas above and around the group, frame group closely to full width. Extend ONLY the lower edge of the existing cutout downwards: continue torsos, arms where needed, paintball vests and matching trousers naturally down to upper thighs. This lower body extension is critical: the faces including the child in front must sit well above the lower 25% of canvas, which will be overlaid by a mobile navigation bar. All existing heads and Christmas ornaments must remain fully in frame. Do not invent extra people or alter any faces, expressions, poses or costumes. Keep group top at approximately 2% of portrait canvas and people filling canvas vertically to lower edge. Genuine transparent background, no black rectangle, no backdrop, no text, no new decorations. Deliver a single portrait cutout, not a collage.
```

## Декоративные кляксы

Исходные силуэты — прозрачные WebP, не векторные SVG paths.
`SectionSplatters` размещает их в SVG alpha masks, сохраняя исходную фактуру, размеры и позиции.
Цвет передаётся через `color`; по умолчанию у детей используется `--color-primary`, у остальных — `--color-olive`.
Декор остаётся на прежнем breakpoint от 1280 px. Его обёртка не перехватывает нажатия.

## Зимний фон и декор из Figma

Источник: зимний фрейм `1028:1992` в «Пейнтбол (Copy)». `SiteThemeProvider` передаёт тему всем секциям, включая сцены с GSAP pinReparent. При `new-year` обычные кляксы заменяются зимними изображениями; в обычной теме остаются прежние маски и цвета.

- Hero: `1028:2002`, `hero-background.webp`, 1440×994, quality 86. В экспорт уже включено затемнение, поэтому повторный radial overlay отключён. Нижний участок исходного узла с остатками старой подложки не экспортируется.
- Сценарии: бордюры `1030:3108`, `1030:3109`; снежные шлейфы `1031:3116`, `1031:3117`. Повороты уже включены в экспорт.
- Дополнения: снежное поле `1031:3115`.
- Инфраструктура: морозный фон `1031:3125` и звёзды `1030:3113`, `1030:3111`, `1030:3112`, `1031:3120`.
- Форма: `1031:3121`, `lead-frost.webp`, 1440×857. Та же морозная текстура с отдельным градиентом затухания, как в макете.

Прозрачный декор экспортирован в WebP quality 85, alphaQuality 100, effort 6. Он включается от 1280 px, как существующий декор; зимний фон hero работает на всех ширинах.

Экспорт отдельных узлов Figma тоже учитывает обрезание родительским фреймом. Декор восстановлен из SVG-экспортов с исходными встроенными изображениями: для полей и звёзд `viewBox` расширен до полных границ повёрнутых слоёв, затем результат конвертирован в WebP. Большая звезда имеет полную ширину 251 px вместо видимых в макете 136 px.

У бордюров обнаружены дополнительные диагональные маски в самих слоях Figma. Они удалены: из исходной текстуры выделен верхний угол с плавной прозрачностью в пустой диагональной области; левый угол получен отражением правого. Снежные шлейфы также подготовлены из полного исходного изображения, с плавным затуханием краёв до поворота. Итоговый размер — 1364×1354. Генерация, дорисовка и склейка частей не применялись.

Шлейфы и звёзды привязаны к центру композиции шириной 1440 px: на широком экране становятся видны их внешние части. По одному шлейфу с каждой стороны проходит непрерывно через границу сценариев и форматов, без повторных копий и обрезания по горизонтальной границе секции. Фоновые снежные поля покрывают всю ширину секции. Верхние бордюры прилегают к границе hero; отступ перед заголовком сценариев перенесён внутрь секции только для зимней темы.
