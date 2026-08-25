export const facilitiesSectionContent = {
  title: 'Зона отдыха и удобства',
  description: 'Всё, что нужно для комфортного праздника — на одной площадке',
} as const

export const facilities = [
  {
    title: 'Места отдыха',
    image: '/images/facilities/rest-area.png',
    description:
      'Зона для взрослых с удобными сиденьями и столами — наблюдайте за игрой в комфорте',
  },
  {
    title: 'Парковка',
    image: '/images/facilities/parking.png',
    description:
      'Бесплатная парковка рядом с площадкой — без проблем с машиной',
  },
  {
    title: 'Раздевалки',
    image: '/images/facilities/changing-rooms.png',
    description: 'Просторные раздевалки для переодевания до и после игры',
  },
  {
    title: 'Санузлы',
    image: '/images/facilities/restrooms.png',
    description: 'Чистые и доступные санузлы на площадке для всех участников',
  },
  {
    title: 'Удобство для сопровождающих',
    image: '/images/facilities/companions.png',
    description: 'Вам не нужно ходить за детьми — всё в одном месте, всё рядом',
  },
  {
    title: 'Инфраструктура для компании',
    image: '/images/facilities/group-infrastructure.png',
    description:
      'Площадка рассчитана на большие группы: от 5 до 60+ человек без тесноты',
  },
] as const

export type Facility = (typeof facilities)[number]
