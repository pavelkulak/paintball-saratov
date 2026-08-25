import Image from 'next/image'

import { SectionHeading } from '@/components/ui/SectionHeading'

import { planets, type Planet } from './formats.data'

function PlanetCard({ planet, index }: { planet: Planet; index: number }) {
  return (
    <li className="h-full min-h-0 w-[90vw] max-w-[420px] flex-none snap-center sm:h-full [@media(max-height:700px)]:min-h-[320px]">
      <article className="text-ink relative flex size-full min-h-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
        <div className="bg-olive relative min-h-0 flex-1 overflow-hidden">
          <Image
            src={planet.image}
            alt={planet.title}
            fill
            sizes="90vw"
            className="object-cover"
          />
          <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-full px-4 py-3 text-base leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex min-h-[86px] flex-none flex-col justify-center px-5 py-3">
          <h3 className="text-xl leading-[1.1] font-medium">{planet.title}</h3>
          <p className="text-ink/60 mt-2 line-clamp-2 text-sm leading-[1.35]">
            {planet.description}
          </p>
        </div>
      </article>
    </li>
  )
}

export function MobilePlanetSlider() {
  return (
    <section className="bg-background text-white xl:hidden">
      <div className="max-w-content mx-auto flex h-svh min-h-0 w-full flex-col px-4 pt-[143px] pb-[50px] md:px-8 md:pt-[148px] md:pb-[55px] [@media(max-height:700px)]:h-auto [@media(max-height:700px)]:min-h-svh">
        <SectionHeading
          title="Что можно добавить к празднику"
          description="Дополните игровую программу, чтобы праздник запомнился надолго"
          decor="additions"
        />

        <ul
          aria-label="Планеты Солнечной системы"
          tabIndex={0}
          className="focus-visible:outline-primary -mx-4 mt-10 flex min-h-0 flex-1 snap-x snap-mandatory [scrollbar-width:none] items-stretch gap-[min(2.051vw,9.2px)] overflow-x-auto px-[5vw] pb-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] md:mt-[45px] [&::-webkit-scrollbar]:hidden [@media(max-height:700px)]:min-h-[320px] [@media(max-height:700px)]:flex-none [@media(max-height:700px)]:pb-0"
        >
          {planets.map((planet, index) => (
            <PlanetCard key={planet.title} planet={planet} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
