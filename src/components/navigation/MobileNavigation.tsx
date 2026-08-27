'use client'

import { useEffect, useRef, useState } from 'react'

import { FooterIconPlaceholder } from '@/components/icons/FooterIconPlaceholder'
import { Logo } from '@/components/icons/Logo'
import { siteContact, siteSocialLinks } from '@/lib/site-contact'

const navigationItems = [
  { href: '#event-additions', label: 'Форматы игры' },
  { href: '#event-support', label: 'Организация' },
  { href: '#event-safety', label: 'Безопасность' },
  { href: '#event-process', label: 'Как всё проходит' },
  { href: '#facilities', label: 'Площадка' },
  { href: '#media-gallery', label: 'Фото и видео' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#faq', label: 'Вопросы' },
] as const

export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (!isOpen) {
      return
    }

    dialog.showModal()

    return () => {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1024px)')
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false)
      }
    }

    desktopViewport.addEventListener('change', closeAtDesktop)

    return () => {
      desktopViewport.removeEventListener('change', closeAtDesktop)
    }
  }, [])

  const closeMenu = () => {
    const dialog = dialogRef.current

    if (dialog?.open) {
      dialog.close()
    }

    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="bg-primary text-primary-foreground border-line focus-visible:outline-primary inline-flex size-12 items-center justify-center self-center rounded-full border transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 lg:hidden"
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label="Открыть меню"
        onClick={() => setIsOpen(true)}
      >
        <span aria-hidden="true" className="flex flex-col gap-1.5">
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
          <span className="h-0.5 w-5 bg-current" />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-navigation-dialog bg-primary text-primary-foreground fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden p-0 lg:hidden"
        aria-labelledby="mobile-navigation-title"
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
      >
        <div className="mobile-navigation-content relative flex h-full min-h-0 flex-col overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-10 right-10 size-[125vmax] translate-x-1/2 -translate-y-1/2"
          >
            {[0, 1, 2, 3, 4].map((ring) => (
              <span
                key={ring}
                className="border-ink/10 absolute rounded-full border motion-safe:animate-[safety-ring-wave_4.8s_cubic-bezier(0.4,0,0.2,1)_infinite] motion-reduce:animate-none"
                style={{
                  inset: `${ring * 11}%`,
                  animationDelay: `${-4800 + ring * 180}ms`,
                }}
              />
            ))}
          </div>

          <div className="page-container relative z-10 flex shrink-0 items-center justify-between py-[14px]">
            <a
              href="#hero"
              aria-label="К началу страницы"
              className="focus-visible:outline-ink w-fit focus-visible:outline-2 focus-visible:outline-offset-4"
              onClick={closeMenu}
            >
              <Logo
                aria-hidden="true"
                className="h-auto w-[107px]"
                color="#12180c"
              />
            </a>

            <button
              type="button"
              autoFocus
              className="bg-ink text-surface focus-visible:outline-surface relative inline-flex size-12 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 hover:rotate-6 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95"
              aria-label="Закрыть меню"
              onClick={closeMenu}
            >
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-5 rotate-45 bg-current"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-5 -rotate-45 bg-current"
              />
            </button>
          </div>

          <h2 id="mobile-navigation-title" className="sr-only">
            Навигация по сайту
          </h2>

          <div className="page-container relative z-10 flex min-h-0 flex-1 flex-col pb-5 sm:pb-7">
            <div className="border-ink/15 mb-4 flex shrink-0 items-end justify-between border-b pb-3 sm:mb-5">
              <p className="text-ink/55 text-[11px] font-bold tracking-[0.16em] uppercase">
                Разделы страницы
              </p>
              <p className="text-ink/45 hidden max-w-52 text-right text-xs leading-snug sm:block">
                Всё для яркой игры и комфортного отдыха
              </p>
            </div>

            <nav
              aria-label="Навигация по разделам страницы"
              className="min-h-0 flex-1 overflow-y-auto"
            >
              <ol className="grid sm:grid-cols-2 sm:gap-x-10 lg:gap-x-14">
                {navigationItems.map((item) => (
                  <li key={item.href} className="border-ink/15 border-b">
                    <a
                      href={item.href}
                      className="group focus-visible:outline-ink flex min-h-12 items-center py-2.5 focus-visible:outline-2 focus-visible:-outline-offset-2 sm:min-h-16 sm:py-3"
                      onClick={closeMenu}
                    >
                      <span className="min-w-0 flex-1 text-[17px] leading-tight font-bold transition-transform duration-200 group-hover:translate-x-1 sm:text-xl">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="border-ink/15 mt-5 flex shrink-0 flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center justify-between gap-5 sm:justify-start">
                <div className="min-w-0">
                  <p className="text-ink/45 mb-1 text-[9px] font-bold tracking-[0.14em] uppercase">
                    Телефон для связи
                  </p>
                  <a
                    href={siteContact.phone.href}
                    className="focus-visible:outline-ink block w-fit text-sm font-bold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {siteContact.phone.label}
                  </a>
                </div>

                <div
                  className="flex shrink-0 gap-2"
                  aria-label="Социальные сети"
                >
                  {siteSocialLinks.map((social) => (
                    <a
                      key={social.kind}
                      href={social.href}
                      aria-label={social.label}
                      className="bg-ink focus-visible:outline-ink inline-flex size-9 items-center justify-center rounded-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
                      onClick={closeMenu}
                    >
                      <FooterIconPlaceholder kind={social.kind} />
                    </a>
                  ))}
                </div>

                <address className="text-ink/55 hidden max-w-48 text-xs leading-snug not-italic md:block">
                  {siteContact.address}
                </address>
              </div>

              <a
                href="#lead-form"
                className="bg-ink text-surface focus-visible:outline-ink inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-7 py-3 text-sm font-bold transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
                onClick={closeMenu}
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
