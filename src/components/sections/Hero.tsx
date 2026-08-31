import Image, { getImageProps } from 'next/image'

import type { HomeResponse } from '@/lib/bitrix/home-schema'

import { QuizCard } from '../ui/QuizCard'
import { Button } from '../ui/Button'
import { AudienceTabs } from '../navigation/AudienceTabs'

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
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="section-anchor relative isolate min-h-dvh min-h-svh overflow-hidden"
    >
      <div className="bg-olive absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/hero-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgb(0 0 0 / 50%) 39%, rgb(0 0 0 / 50%) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="page-container relative z-30 min-h-dvh min-h-svh pt-[115px] pb-4 xl:grid xl:grid-cols-12 xl:grid-rows-[auto_1fr] xl:gap-x-6 xl:pt-[max(104px,10vh)]">
        <div className="relative z-20 mx-auto flex w-full max-w-[345px] flex-col items-center gap-[19px] xl:col-span-12 xl:col-start-1 xl:row-start-1 xl:mx-0 xl:block xl:max-w-none">
          <h1
            id="hero-title"
            className="w-full max-w-[345px] text-center text-[48px] leading-[0.98] font-bold tracking-[0.03em] uppercase xl:max-w-none xl:text-[clamp(72px,5.6vw,96px)] xl:whitespace-nowrap"
          >
            <span className="xl:hidden">
              Активный формат отдыха, где всем интересно
            </span>
            <span className="hidden xl:grid xl:grid-cols-12 xl:gap-x-6">
              <span className="col-span-12 text-center">
                Активный формат отдыха,
              </span>
              <span className="col-span-4 row-start-2 text-left">где всем</span>
              <span className="col-span-4 col-start-9 row-start-2 text-right">
                интересно
              </span>
            </span>
          </h1>

          <Button href="#lead-form" variant="light" className="xl:hidden">
            Оставить заявку
          </Button>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-visible xl:relative xl:inset-auto xl:col-span-4 xl:col-start-5 xl:row-span-2 xl:row-start-1"
          aria-hidden="true"
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
              className="absolute bottom-[min(0px,calc(100dvh-53.75rem))] left-1/2 h-auto w-[427px] max-w-none -translate-x-1/2 max-[340px]:bottom-[min(0px,calc(100dvh-56.75rem))] xl:bottom-[clamp(-18rem,calc(100dvh-67.5rem),0rem)] xl:w-[540px]"
            />
          </picture>
        </div>

        <div className="relative z-20 hidden w-full max-w-[372px] flex-col gap-10 xl:col-span-4 xl:row-start-2 xl:flex xl:self-end">
          <p className="text-body leading-[1.2]">{content.description}</p>
          <Button href="#lead-form" variant="light">
            Оставить заявку
          </Button>
        </div>

        <QuizCard
          quiz={content.quiz}
          className="relative z-20 hidden w-full max-w-none xl:col-span-4 xl:col-start-9 xl:row-start-2 xl:flex xl:self-end"
        />

        <AudienceTabs className="absolute inset-x-4 bottom-4 z-20 flex lg:hidden" />
      </div>
    </section>
  )
}
