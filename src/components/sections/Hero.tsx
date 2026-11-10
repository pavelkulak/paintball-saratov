import Image from 'next/image'

import type { AudienceId } from '@/lib/audience'
import type { HomeResponse } from '@/lib/bitrix/home-schema'

import { QuizCard } from '../ui/QuizCard'
import { AudienceArtwork } from '../ui/AudienceArtwork'
import { Button } from '../ui/Button'
import { HeroParallaxScene } from './hero/HeroParallaxScene'

const heroPlayers: Record<
  AudienceId,
  { mobileSrc: string; desktopSrc: string }
> = {
  all: {
    mobileSrc: '/images/hero-players-family-mobile.png',
    desktopSrc: '/images/hero-players-family.webp',
  },
  children: {
    mobileSrc: '/images/hero-players-children-mobile.webp',
    desktopSrc: '/images/hero-players-children.webp',
  },
  adults: {
    mobileSrc: '/images/hero-players-adults-mobile.webp',
    desktopSrc: '/images/hero-players-adults.webp',
  },
}

export function Hero({
  audience,
  content,
}: {
  audience: AudienceId
  content: Pick<HomeResponse, 'description' | 'quiz'>
}) {
  return (
    <>
      <HeroParallaxScene>
        <div className="page-container relative z-30 flex h-full min-h-0 flex-col pt-[115px] xl:pt-[max(96px,12svh)] xl:pb-4">
          <div className="relative z-20 mx-auto flex w-full flex-col items-center gap-[19px]">
            <h1
              id="hero-title"
              className="w-full max-w-[1180px] text-center text-[clamp(42px,12.3vw,48px)] leading-[0.98] font-bold tracking-[0.03em] text-balance uppercase md:text-[clamp(56px,7vw,72px)] xl:text-[clamp(64px,5.6vw,96px)]"
            >
              Активный формат отдыха, где всем интересно
            </h1>

            <Button href="#lead-form" variant="light" className="xl:hidden">
              Оставить заявку
            </Button>
          </div>

          <div className="[container-type:size] relative mt-6 min-h-0 flex-1 xl:mt-2 xl:grid xl:grid-cols-12 xl:grid-rows-[minmax(0,1fr)] xl:gap-x-6">
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 z-10 aspect-[1207_/_1303] w-[min(calc(100cqh_*_1207_/_1303),_100vw)] [translate:-60%_0] xl:bottom-[-16px] xl:aspect-[871_/_706] xl:w-[min(calc((100cqh_+_16px)_*_871_/_706),_calc(100vw_-_64px))] xl:[translate:-63%_0]"
              aria-hidden="true"
            >
              <div
                data-hero-players
                className="absolute inset-0 will-change-transform motion-reduce:transform-none"
              >
                <AudienceArtwork
                  audience={audience}
                  variants={Object.entries(heroPlayers).map(
                    ([id, { mobileSrc, desktopSrc }]) => ({
                      id: id as AudienceId,
                      content: (
                        <picture
                          className={
                            id === 'children'
                              ? 'absolute inset-0 max-xl:translate-x-[9%]'
                              : 'absolute inset-0'
                          }
                        >
                          <source
                            media="(min-width: 1280px)"
                            srcSet={desktopSrc}
                          />
                          <Image
                            src={mobileSrc}
                            alt=""
                            width={1207}
                            height={1303}
                            loading="eager"
                            fetchPriority={id === audience ? 'high' : 'low'}
                            sizes="(min-width: 1280px) min(100vw - 64px, 124svh), 100vw"
                            draggable={false}
                            className="block h-full w-full object-contain object-bottom"
                          />
                        </picture>
                      ),
                    }),
                  )}
                />
              </div>
            </div>

            <div className="relative z-20 hidden w-full max-w-[372px] flex-col gap-10 xl:col-span-4 xl:flex xl:self-end">
              <p className="text-body leading-[1.2]">{content.description}</p>
            </div>

            <QuizCard
              quiz={content.quiz}
              variant="hero"
              className="relative z-20 hidden w-full max-w-none xl:col-span-4 xl:col-start-9 xl:flex xl:self-end"
            />
          </div>
        </div>
      </HeroParallaxScene>
      <div className="page-container mt-4 flex flex-col items-center gap-5 xl:hidden">
        <QuizCard quiz={content.quiz} />
      </div>
    </>
  )
}
