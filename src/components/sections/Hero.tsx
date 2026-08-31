import Image from 'next/image'

import type { HomeResponse } from '@/lib/bitrix/home-schema'

import { QuizCard } from '../ui/QuizCard'
import { Button } from '../ui/Button'
import { AudienceTabs } from '../navigation/AudienceTabs'
import { HeroParallaxScene } from './hero/HeroParallaxScene'

export function Hero({
  content,
}: {
  content: Pick<HomeResponse, 'description' | 'quiz'>
}) {
  return (
    <HeroParallaxScene>
      <div className="page-container relative z-30 flex h-full min-h-0 flex-col overflow-hidden pt-[115px] pb-[88px] lg:h-auto lg:min-h-svh lg:overflow-visible lg:pt-[max(104px,10vh)] lg:pb-5">
        <div className="relative z-20 mx-auto flex w-full flex-col items-center gap-[19px]">
          <h1
            id="hero-title"
            className="w-full max-w-[1180px] text-center text-[clamp(42px,12.3vw,48px)] leading-[0.98] font-bold tracking-[0.03em] text-balance uppercase md:text-[clamp(56px,7vw,72px)] lg:text-[clamp(64px,5.6vw,96px)]"
          >
            Активный формат отдыха, где всем интересно
          </h1>

          <Button href="#lead-form" variant="light" className="lg:hidden">
            Оставить заявку
          </Button>
        </div>

        <div className="relative mt-6 min-h-0 flex-1 lg:mt-4 lg:grid lg:min-h-[510px] lg:grid-cols-12 lg:gap-x-6">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[min(108vw,430px)] -translate-x-1/2 overflow-visible md:w-[480px] lg:w-[clamp(480px,44vw,540px)]"
            aria-hidden="true"
          >
            <div
              data-hero-players
              className="absolute inset-0 will-change-transform motion-reduce:transform-none"
            >
              <Image
                src="/images/hero-players-full.png"
                alt=""
                width={1054}
                height={1492}
                priority
                sizes="(min-width: 1024px) 44vw, (min-width: 768px) 480px, min(108vw, 430px)"
                draggable={false}
                className="absolute top-0 left-1/2 h-auto w-full max-w-none -translate-x-1/2"
              />
            </div>
          </div>

          <div className="relative z-20 hidden w-full max-w-[372px] flex-col gap-10 lg:col-span-4 lg:flex lg:self-end">
            <p className="text-body leading-[1.2]">{content.description}</p>
            <Button href="#lead-form" variant="light">
              Оставить заявку
            </Button>
          </div>

          <QuizCard
            quiz={content.quiz}
            className="relative z-20 hidden w-full max-w-none lg:col-span-4 lg:col-start-9 lg:flex lg:self-end"
          />
        </div>
      </div>
      <AudienceTabs className="absolute inset-x-2 bottom-4 z-40 flex lg:hidden" />
    </HeroParallaxScene>
  )
}
