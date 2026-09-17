import type { FormatCardIcon } from '@/components/icons/FormatIcons'
import { FormatInfoIcon } from '@/components/icons/FormatInfoIcon'
import { Button } from '@/components/ui/Button'

export type FormatCardPalette = 'light' | 'dark'

export type FormatCardData = {
  id: string
  title: string
  palette: FormatCardPalette
  tariffs: readonly string[]
  desktopTariffs?: readonly string[]
  activeTariff: number
  age: string
  desktopAge?: string
  activityLabel: string
  activity: string
  feature: string
  fitLabel: string
  fit: string
  oldPrice: string
  price: string
  backgroundImage?: string
}

type FormatCardProps = {
  format: FormatCardData
  icon: FormatCardIcon
  variant?: 'mobile' | 'desktop'
}

export function FormatCard({
  format,
  icon: FormatIcon,
  variant = 'mobile',
}: FormatCardProps) {
  const isDark = format.palette === 'dark'
  const isDesktop = variant === 'desktop'
  const bodyTextClass = isDark ? 'text-foreground' : 'text-ink'
  const mutedTextClass = 'text-muted'
  const tariffs =
    isDesktop && format.desktopTariffs ? format.desktopTariffs : format.tariffs
  const age = isDesktop && format.desktopAge ? format.desktopAge : format.age
  const cardOutlineClass = isDark ? 'ring-2 ring-inset ring-primary' : ''

  return (
    <article
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-[24px] ${isDark ? 'bg-background' : 'bg-primary'} ${cardOutlineClass}`}
    >
      <header
        className={`absolute z-10 flex h-12 items-center justify-between ${isDesktop ? 'inset-x-6 top-7 gap-5' : 'inset-x-4 top-4 gap-3'}`}
      >
        <div
          className={`flex min-w-0 items-center ${isDesktop ? 'gap-5' : 'gap-3'}`}
        >
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] ${isDark ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
          >
            <FormatIcon aria-hidden="true" />
          </span>
          <h3
            className={`min-w-0 leading-[1.2] font-semibold ${isDesktop ? 'text-2xl' : 'text-xl'} ${isDark ? 'text-primary' : 'text-ink'}`}
          >
            {format.title}
          </h3>
        </div>

        <Button
          type="button"
          variant="light"
          aria-label={`Подробнее о формате «${format.title}»`}
          className="text-ink focus-visible:ring-primary h-8 w-8 max-w-none shrink-0 rounded-full p-0 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          <FormatInfoIcon aria-hidden="true" />
        </Button>
      </header>

      <div
        className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] ${isDesktop ? 'mt-[104px] px-6 pt-7 pb-6' : 'mt-20 px-4 pt-7 pb-4'} ${isDark ? 'bg-background ring-primary ring-2 ring-inset' : 'bg-white'}`}
      >
        {format.backgroundImage ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${format.backgroundImage}")` }}
          />
        ) : null}

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <dl className={`flex flex-col gap-6 ${bodyTextClass}`}>
            <div className="flex flex-col gap-2">
              <p
                className={`${isDesktop ? 'text-sm leading-[1.2]' : 'text-xs leading-[1.25]'} ${mutedTextClass}`}
              >
                Тариф:
              </p>
              <ul className="flex flex-wrap gap-1" aria-label="Тарифы">
                {tariffs.map((tariff, index) => {
                  const isActive = index === format.activeTariff
                  const tariffClass = isDark
                    ? isActive
                      ? 'bg-white text-ink'
                      : 'bg-background text-foreground ring-1 ring-inset ring-white'
                    : isActive
                      ? 'bg-background text-foreground'
                      : 'bg-white text-ink ring-1 ring-inset ring-background'

                  return (
                    <li
                      className={`rounded-full px-4 py-3 ${isDesktop ? 'text-base leading-[1.2]' : 'text-sm leading-[1.2]'} ${tariffClass}`}
                      key={`${tariff}-${index}`}
                    >
                      {tariff}
                    </li>
                  )
                })}
              </ul>
            </div>

            <FormatDetail desktop={isDesktop} label="Возраст:" value={age} />
            <FormatDetail
              desktop={isDesktop}
              label={format.activityLabel}
              value={format.activity}
            />
            <FormatDetail
              desktop={isDesktop}
              label="Особенность:"
              value={format.feature}
            />
            <FormatDetail
              desktop={isDesktop}
              label={format.fitLabel}
              value={format.fit}
            />
          </dl>

          <div
            className={
              isDesktop
                ? 'mt-auto flex items-center justify-between gap-4 pt-8'
                : 'mt-auto pt-8'
            }
          >
            <div className="flex flex-col">
              <span
                className={`text-muted leading-[1.25] font-semibold line-through ${isDesktop ? 'text-sm' : 'text-xs'}`}
              >
                {format.oldPrice}
              </span>
              <strong
                className={`text-5xl leading-none font-extrabold ${bodyTextClass}`}
              >
                {format.price}
              </strong>
            </div>

            <Button
              type="button"
              variant="primary"
              className={`h-[68px] rounded-[24px] px-8 text-base leading-[1.2] font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:outline-none ${isDesktop ? 'w-[200px] max-w-none shrink-0' : 'mt-4 w-full max-w-none'}`}
            >
              Оставить заявку
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

function FormatDetail({
  desktop,
  label,
  value,
}: {
  desktop: boolean
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <dt
        className={`text-muted ${desktop ? 'text-sm leading-[1.2]' : 'text-xs leading-[1.25]'}`}
      >
        {label}
      </dt>
      <dd
        className={
          desktop ? 'text-base leading-[1.2]' : 'text-sm leading-[1.2]'
        }
      >
        {value}
      </dd>
    </div>
  )
}
