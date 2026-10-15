import Image from 'next/image'

import type { HomeResponse } from '@/lib/bitrix/home-schema'

import { QuizCard } from '../ui/QuizCard'
import { Button } from '../ui/Button'
import { AudienceTabs } from '../navigation/AudienceTabs'
import { HeroParallaxScene } from './hero/HeroParallaxScene'
import styles from './hero/Hero.module.css'

export function Hero({
  content,
}: {
  content: Pick<HomeResponse, 'description' | 'quiz'>
}) {
  return (
    <>
      <HeroParallaxScene>
        <div className="page-container relative z-30 flex h-full min-h-0 flex-col pt-[115px] lg:pt-[max(96px,12svh)] lg:pb-4">
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

          <div
            className={`${styles.stage} relative mt-6 min-h-0 flex-1 lg:mt-2 lg:grid lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] lg:gap-x-6`}
          >
            <div
              className={`${styles.artwork} pointer-events-none absolute left-1/2 z-10`}
              aria-hidden="true"
            >
              <div
                data-hero-players
                className="absolute inset-0 will-change-transform motion-reduce:transform-none"
              >
                <Image
                  src="/images/hero-players-family.webp"
                  alt=""
                  width={871}
                  height={706}
                  preload
                  sizes="(min-width: 1024px) min(100vw - 64px, 124svh), 100vw"
                  draggable={false}
                  className="block h-full w-full object-contain object-bottom"
                />
              </div>
            </div>

            <div className="relative z-20 hidden w-full max-w-[372px] flex-col gap-10 lg:col-span-4 lg:flex lg:self-end">
              <p className="text-body leading-[1.2]">{content.description}</p>
            </div>

            <QuizCard
              quiz={content.quiz}
              variant="hero"
              className="relative z-20 hidden w-full max-w-none lg:col-span-4 lg:col-start-9 lg:flex lg:self-end"
            />
          </div>
        </div>
      </HeroParallaxScene>
      <div className="page-container mt-4 flex flex-col items-center gap-5 lg:hidden">
        <AudienceTabs className="w-full max-w-[480px]" />
        <QuizCard quiz={content.quiz} />
      </div>
    </>
  )
}
