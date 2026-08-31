import { getImageProps } from 'next/image'

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
  const {
    props: { srcSet: desktopPlayersSrcSet, ...desktopPlayersProps },
  } = getImageProps({
    src: '/images/hero-players-full.png',
    alt: '',
    width: 1054,
    height: 1492,
    loading: 'eager',
  })
  const {
    props: { srcSet: mobilePlayersSrcSet, ...mobilePlayersProps },
  } = getImageProps({
    src: '/images/hero-players.png',
    alt: '',
    width: 360,
    height: 452,
    loading: 'eager',
  })

  return (
    <HeroParallaxScene>
      <div className="page-container relative z-30 flex min-h-svh flex-col pt-[115px] pb-[88px] xl:pt-[max(104px,10vh)] xl:pb-5">
        <div className="relative z-20 mx-auto flex w-full flex-col items-center gap-[19px]">
          <h1
            id="hero-title"
            className="w-full max-w-[1180px] text-center text-[48px] leading-[0.98] font-bold tracking-[0.03em] text-balance uppercase xl:text-[clamp(72px,5.6vw,96px)]"
          >
            Активный формат отдыха, где всем интересно
          </h1>

          <Button href="#lead-form" variant="light" className="xl:hidden">
            Оставить заявку
          </Button>
        </div>

        <div className="relative mt-6 min-h-[430px] flex-1 xl:mt-4 xl:grid xl:min-h-[510px] xl:grid-cols-12 xl:gap-x-6">
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[400px] max-w-[112vw] -translate-x-1/2 overflow-visible xl:w-[540px] xl:max-w-none"
            aria-hidden="true"
          >
            <div
              data-hero-players
              className="absolute inset-0 will-change-transform motion-reduce:transform-none"
            >
              <picture>
                <source
                  media="(min-width: 1280px)"
                  srcSet={desktopPlayersSrcSet ?? desktopPlayersProps.src}
                />
                <source
                  media="(max-width: 1279px)"
                  srcSet={mobilePlayersSrcSet ?? mobilePlayersProps.src}
                />
                <img
                  {...mobilePlayersProps}
                  alt=""
                  draggable={false}
                  decoding="async"
                  fetchPriority="high"
                  className="absolute top-0 left-1/2 h-auto w-full max-w-none -translate-x-1/2 xl:w-[540px]"
                />
              </picture>
            </div>
          </div>

          <div className="relative z-20 hidden w-full max-w-[372px] flex-col gap-10 xl:col-span-4 xl:flex xl:self-end">
            <p className="text-body leading-[1.2]">{content.description}</p>
            <Button href="#lead-form" variant="light">
              Оставить заявку
            </Button>
          </div>

          <QuizCard
            quiz={content.quiz}
            className="relative z-20 hidden w-full max-w-none xl:col-span-4 xl:col-start-9 xl:flex xl:self-end"
          />
        </div>

        <AudienceTabs className="absolute inset-x-4 bottom-4 z-20 flex lg:hidden" />
      </div>
    </HeroParallaxScene>
  )
}
