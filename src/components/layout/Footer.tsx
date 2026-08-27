import { FooterIconPlaceholder } from '@/components/icons/FooterIconPlaceholder'
import { Logo } from '@/components/icons/Logo'
import { YandexMap } from '@/components/ui/YandexMap'
import Link from 'next/link'

function FooterSocialLink({
  kind,
  label,
}: {
  kind: 'telegram' | 'vk'
  label: string
}) {
  return (
    <a
      href="#footer"
      aria-label={label}
      className="bg-primary-foreground focus-visible:ring-ink inline-flex size-10 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:outline-none"
    >
      <FooterIconPlaceholder kind={kind} />
    </a>
  )
}

export function Footer() {
  return (
    <footer
      id="footer"
      className="section-anchor page-section-gap bg-primary text-primary-foreground overflow-hidden rounded-t-[28px] pt-14 pb-14 xl:rounded-t-[3rem] xl:pt-12 xl:pb-12"
    >
      <div className="page-container flex flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] xl:gap-12">
        <div className="flex min-w-0 flex-col">
          <Link
            href="/"
            aria-label="Пейнтбол — на главную"
            className="focus-visible:ring-ink w-fit focus-visible:ring-2 focus-visible:outline-none"
          >
            <Logo
              aria-hidden="true"
              className="h-auto w-40"
              color="#12180c"
              height={98}
              width={161}
            />
          </Link>

          <div className="mt-14 flex flex-col gap-10 xl:mt-auto xl:pt-36">
            <div className="flex gap-4">
              <FooterSocialLink kind="vk" label="Пейнтбол во ВКонтакте" />
              <FooterSocialLink kind="telegram" label="Пейнтбол в Telegram" />
            </div>

            <address className="flex flex-col gap-2 text-sm leading-[1.2] font-medium not-italic">
              <a
                href="tel:+74951043686"
                className="focus-visible:ring-ink w-fit focus-visible:ring-2 focus-visible:outline-none"
              >
                +7 (495) 104-36-86
              </a>
              <span>г. Домодедово, Каширское ш-се д. 107-А</span>
            </address>

            <div className="flex flex-col gap-4 xl:flex-row">
              <a
                href="#lead-form"
                className="bg-ink text-surface focus-visible:ring-ink inline-flex min-h-16 w-full items-center justify-center rounded-2xl px-8 py-4 text-base leading-none font-bold transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:outline-none xl:w-fit"
              >
                Оставить заявку
              </a>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="border-ink text-ink focus-visible:ring-ink inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 px-8 py-4 text-base leading-none font-bold opacity-100 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed xl:w-fit"
                title="Документ будет добавлен позже"
              >
                Как проехать
                <FooterIconPlaceholder kind="download" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-14 aspect-[0.55] w-full overflow-hidden rounded-3xl bg-white xl:mt-0 xl:aspect-[1.15]">
          <YandexMap />
        </div>
      </div>
    </footer>
  )
}
