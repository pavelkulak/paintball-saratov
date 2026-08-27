import Image from 'next/image'

import { EmblaCarousel } from '@/components/ui/EmblaCarousel'
import { MOBILE_ONLY_EMBLA_OPTIONS } from '@/components/ui/embla-carousel.options'
import { SectionHeading } from '@/components/ui/SectionHeading'

import { planets, type Planet } from './formats.data'

function PlanetCard({ planet, index }: { planet: Planet; index: number }) {
  return (
    <li className="h-full min-h-0 w-[90vw] max-w-[420px]">
      <article className="text-ink relative flex size-full min-h-0 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] [@media(max-height:700px)]:min-h-[320px]">
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

        <EmblaCarousel
          ariaLabel="Планеты Солнечной системы"
          containerClassName="h-full items-stretch gap-[min(2.051vw,9.2px)]"
          options={MOBILE_ONLY_EMBLA_OPTIONS}
          className="-mx-4 mt-10 min-h-0 w-auto flex-1 px-[5vw] pb-4 md:mt-[45px] [@media(max-height:700px)]:h-[320px] [@media(max-height:700px)]:flex-none [@media(max-height:700px)]:pb-0"
        >
          {planets.map((planet, index) => (
            <PlanetCard key={planet.title} planet={planet} index={index} />
          ))}
        </EmblaCarousel>
      </div>
    </section>
  )
}
