import Image from 'next/image'

import { Button } from '@/components/ui/Button'

export type ScenarioField = {
  label: string
  value: string
}

export type ScenarioCardData = {
  title: string
  image: string
  fields: readonly ScenarioField[]
  tags: readonly string[]
}

type ScenarioCardProps = {
  scenario: ScenarioCardData
  variant?: 'mobile' | 'desktop'
}

const SCENARIO_IMAGE_SIZES =
  '(min-width: 1280px) 365px, (min-width: 768px) 420px, 328px'

export function ScenarioCard({
  scenario,
  variant = 'mobile',
}: ScenarioCardProps) {
  const isDesktop = variant === 'desktop'

  return (
    <article className="flex min-h-0 w-full flex-col gap-1 self-stretch">
      <div className="relative flex min-h-0 flex-auto flex-col overflow-hidden rounded-[24px] bg-white">
        <div
          className={
            isDesktop
              ? 'relative m-3 aspect-[365/213] shrink-0 overflow-hidden rounded-[12px]'
              : 'relative m-1 aspect-[320/152] shrink-0 overflow-hidden rounded-[20px]'
          }
        >
          <Image
            src={scenario.image}
            alt={scenario.title}
            fill
            sizes={SCENARIO_IMAGE_SIZES}
            className="object-cover"
          />
        </div>

        <div
          className={
            isDesktop
              ? 'text-ink flex min-h-0 flex-auto flex-col px-6 pt-3 pb-6'
              : 'text-ink flex min-h-0 flex-auto flex-col px-4 pt-5 pb-6'
          }
        >
          <h3
            className={
              isDesktop
                ? 'text-[24px] leading-[1.2] font-semibold'
                : 'text-xl leading-[1.2] font-semibold'
            }
          >
            {scenario.title}
          </h3>

          <dl
            className={
              isDesktop
                ? 'mt-7 flex flex-col gap-6'
                : 'mt-6 flex flex-col gap-6'
            }
          >
            {scenario.fields.map((field) => (
              <div className="flex flex-col gap-2" key={field.label}>
                <dt
                  className={
                    isDesktop
                      ? 'text-muted text-sm leading-[1.2]'
                      : 'text-muted text-xs leading-[1.25]'
                  }
                >
                  {field.label}
                </dt>
                <dd
                  className={
                    isDesktop
                      ? 'text-base leading-[1.2]'
                      : 'text-sm leading-[1.2]'
                  }
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul
            className="mt-auto flex flex-wrap gap-1 pt-8"
            aria-label="Особенности"
          >
            {scenario.tags.map((tag) => (
              <li
                className="bg-surface-muted rounded-full px-4 py-2 text-xs leading-[1.25]"
                key={tag}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        className="h-[68px] w-full max-w-none shrink-0 rounded-[24px] px-8 text-base leading-[1.2] font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:outline-none"
      >
        Смотреть вариант
      </Button>
    </article>
  )
}
