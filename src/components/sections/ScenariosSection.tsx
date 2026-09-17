import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopScenariosGrid } from './scenarios/DesktopScenariosGrid'
import { MobileScenariosSlider } from './scenarios/MobileScenariosSlider'

const scenarios = [
  {
    title: 'Компания друзей',
    image: '/images/scenarios/scenario-01.jpg',
    fields: [
      { label: 'Кому подходит:', value: 'Группы от 6 до 30 человек' },
      {
        label: 'Главное в сценарии:',
        value: 'Командные сценарии, сюрпризы, фото-зона и торжественный финал',
      },
      {
        label: 'Атмосфера:',
        value: 'Расслабленная, но драйвовая атмосфера',
      },
    ],
    tags: ['Персональный сценарий', 'Фото и видео', 'Памятный момент'],
  },
  {
    title: 'День рождения / праздник',
    image: '/images/scenarios/scenario-02.jpg',
    fields: [
      { label: 'Кому подходит:', value: 'Группы от 8 до 140 человек' },
      {
        label: 'Главное в сценарии:',
        value: 'Командные сценарии, сюрпризы, фото-зона и торжественный финал',
      },
      {
        label: 'Атмосфера:',
        value: 'Праздничная, яркая, запоминающаяся',
      },
    ],
    tags: ['Командные форматы', 'Разделение на отряды', 'Гибкий тайминг'],
  },
  {
    title: 'Корпоратив / тимбилдинг',
    image: '/images/scenarios/scenario-03.jpg',
    fields: [
      { label: 'Кому подходит:', value: 'Группы от 15 до 100 человек' },
      {
        label: 'Главное в сценарии:',
        value:
          'Командообразование через игру: стратегия, коммуникация, единый результат',
      },
      {
        label: 'Атмосфера:',
        value: 'Деловая с отрывом — баланс игры и сплочения',
      },
    ],
    tags: ['Персональный сценарий', 'Фото и видео', 'Памятный момент'],
  },
  {
    title: 'День рождения',
    image: '/images/scenarios/scenario-04.jpg',
    fields: [
      { label: 'Кому подходит:', value: 'Имениннику и его друзьям' },
      {
        label: 'Для какого состава:',
        value: 'Группы детей от 5 до 20 человек',
      },
      {
        label: 'Главное в сценарии:',
        value:
          'Именинник в центре события: особая роль, свой сценарий, памятный момент',
      },
    ],
    tags: ['Персональный сценарий', 'Фото и видео', 'Памятный момент'],
  },
  {
    title: 'Праздник для класса или компании',
    image: '/images/scenarios/scenario-05.jpg',
    fields: [
      {
        label: 'Кому подходит:',
        value: 'Одноклассникам, друзьям из секции, детским коллективам',
      },
      {
        label: 'Для какого состава:',
        value: 'Группы детей от 10 до 40 человек',
      },
      {
        label: 'Главное в сценарии:',
        value:
          'Командная игра, где каждый нашёл себе место — без скучающих и без конфликтов',
      },
    ],
    tags: ['Командные форматы', 'Разделение на отряды', 'Гибкий тайминг'],
  },
  {
    title: 'Семейный формат: дети + родители',
    image: '/images/scenarios/scenario-06.jpg',
    fields: [
      { label: 'Кому подходит:', value: 'Семьям с детьми' },
      {
        label: 'Для какого состава:',
        value: 'Смешанная компания: дети и взрослые вместе',
      },
      {
        label: 'Главное в сценарии:',
        value:
          'Родители играют наравне с детьми — или наблюдают из зоны отдыха',
      },
    ],
    tags: ['Командные форматы', 'Разделение на отряды', 'Гибкий тайминг'],
  },
] as const

export function ScenariosSection() {
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-title"
      className="section-anchor page-section-gap bg-background text-foreground w-full overflow-hidden"
    >
      <div className="page-container">
        <SectionHeading
          className="mx-auto max-w-[327px] xl:max-w-[633px] xl:gap-7"
          contentClassName="gap-4"
          decor="scenarios"
          descriptionClassName="font-normal"
          title="Быстрый выбор под ваш повод"
          titleId="scenarios-title"
          description="Три готовых формата праздника — выберите подходящий и узнайте, что входит"
        />
      </div>

      <MobileScenariosSlider scenarios={scenarios} />
      <DesktopScenariosGrid scenarios={scenarios} />
    </section>
  )
}
