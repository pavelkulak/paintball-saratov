import { SectionHeading } from '@/components/ui/SectionHeading'

import { DesktopFormatsGrid } from './formats/DesktopFormatsGrid'
import { MobileFormatsSlider } from './formats/MobileFormatsSlider'

const formats = [
  {
    id: 'laser-tag-kids',
    title: 'Лазертаг',
    palette: 'light',
    tariffs: ['Первое знакомство', 'Детский праздник', 'Семейная игра'],
    activeTariff: 0,
    age: 'От 6 лет',
    activityLabel: 'Темп и активность:',
    activity: 'Высокий — активные пробежки, укрытия, тактика',
    feature:
      'Игра в темноте с эффектами — дети чувствуют себя настоящими героями',
    fitLabel: 'Лучше подходит:',
    fit: 'Активным детям, любителям стратегии и командных игр',
    oldPrice: '1 800 ₽/чел',
    price: '1 490 ₽/чел',
  },
  {
    id: 'orbizball',
    title: 'Орбизбол',
    palette: 'light',
    tariffs: ['Первое знакомство', 'Детский праздник', 'Семейная игра'],
    activeTariff: 1,
    age: 'От 5 лет',
    activityLabel: 'Темп и активность:',
    activity: 'Средний — весёлые перестрелки без боли и стресса',
    feature:
      'Орбизы лопаются при попадании — зрелищно и безопасно для любого возраста',
    fitLabel: 'Лучше подходит:',
    fit: 'Младшим детям, семейным форматам, первому знакомству с игрой',
    oldPrice: '1 500 ₽/чел',
    price: '1 190 ₽/чел',
  },
  {
    id: 'kids-paintball',
    title: 'Детский пейнтбол',
    palette: 'light',
    tariffs: ['Первое знакомство', 'Детский праздник', 'Семейная игра'],
    activeTariff: 2,
    age: 'От 8 лет',
    activityLabel: 'Темп и активность:',
    activity: 'Высокий — динамичные сценарии, командное взаимодействие',
    feature:
      'Настоящее снаряжение, как у взрослых — дети чувствуют себя профессионалами',
    fitLabel: 'Лучше подходит:',
    fit: 'Старшим детям, любителям реалистичных игр и приключений',
    oldPrice: '2 000 ₽/чел',
    price: '1 690 ₽/чел',
  },
  {
    id: 'paintball',
    title: 'Пейнтбол',
    palette: 'dark',
    tariffs: ['Компания друзей', 'Корпоративный формат', 'Праздник с отдыхом'],
    activeTariff: 0,
    age: 'От 14 лет',
    activityLabel: 'Уровень драйва:',
    activity: 'Высокий — тактика, скорость, командная работа',
    feature: 'Реальные ощущения боя без вреда для здоровья',
    fitLabel: 'Когда выбирать:',
    fit: 'Для тех, кто хочет настоящего адреналина',
    oldPrice: '1 800 ₽/чел',
    price: '1 490 ₽/чел',
    backgroundImage: '/images/formats/format-camouflage.svg',
  },
  {
    id: 'laser-tag-adults',
    title: 'Лазертаг',
    palette: 'dark',
    tariffs: ['Компания друзей', 'Корпоративный формат', 'Праздник с отдыхом'],
    activeTariff: 1,
    age: 'От 14 лет',
    activityLabel: 'Уровень драйва:',
    activity: 'Средний — динамичная командная игра',
    feature: 'Можно играть детям и взрослым вместе',
    fitLabel: 'Когда выбирать:',
    fit: 'Идеально для смешанных компаний и праздников',
    oldPrice: '1 500 ₽/чел',
    price: '1 190 ₽/чел',
    backgroundImage: '/images/formats/format-camouflage.svg',
  },
  {
    id: 'mixed-format',
    title: 'Смешанный формат',
    palette: 'dark',
    tariffs: ['Компания друзей', 'Корпоративный формат', 'Праздник с отдыхом'],
    desktopTariffs: [
      'Праздник с отдыхом',
      'Корпоративный формат',
      'Праздник с отдыхом',
    ],
    activeTariff: 2,
    age: 'От 14 лет',
    desktopAge: 'Любой состав — дети и взрослые вместе',
    activityLabel: 'Уровень драйва:',
    activity: 'Регулируемый — под пожелания группы',
    feature: 'Сочетание нескольких форматов в одном мероприятии',
    fitLabel: 'Когда выбирать:',
    fit: 'Когда нужно учесть интересы всех участников',
    oldPrice: '2 000 ₽/чел',
    price: '1 690 ₽/чел',
    backgroundImage: '/images/formats/format-camouflage.svg',
  },
] as const

export function FormatsSection() {
  return (
    <section
      id="formats"
      aria-labelledby="formats-title"
      className="section-anchor page-section-gap bg-background text-foreground w-full overflow-hidden"
    >
      <div className="page-container">
        <SectionHeading
          className="mx-auto max-w-[328px] gap-7 xl:max-w-[554px]"
          contentClassName="gap-4"
          decor="formats"
          descriptionClassName="font-normal"
          title="Выберите формат игры"
          titleId="formats-title"
          description="Форматы можно совмещать. Поможем подобрать лучшее сочетание под ваш праздник"
        />
      </div>

      <MobileFormatsSlider formats={formats} />
      <DesktopFormatsGrid formats={formats} />
    </section>
  )
}
