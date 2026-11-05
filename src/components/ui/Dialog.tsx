'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { CloseIcon } from '@/components/icons/CloseIcon'

export function Dialog({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const closingRef = useRef(false)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function finishClose() {
    if (!closingRef.current) return
    closingRef.current = false
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    dialogRef.current?.close()
    onCloseRef.current()
  }

  function close() {
    if (closingRef.current) return
    closingRef.current = true
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reducedMotion) {
      finishClose()
      return
    }
    setIsClosing(true)
    // Keep the native modal open and centred until its fade finishes.
    // The timeout also releases it if the browser skips transitionend.
    closeTimerRef.current = setTimeout(finishClose, 300)
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden overscroll-contain border-0 bg-transparent p-4 opacity-0 [transition:opacity_220ms_ease] motion-reduce:transition-none [&::backdrop]:opacity-0 [&::backdrop]:[background:rgb(0_0_0_/_70%)] [&::backdrop]:[transition:opacity_220ms_ease] motion-reduce:[&::backdrop]:transition-none [&[open]]:grid [&[open]]:place-items-center [&[open]]:opacity-100 starting:[&[open]]:opacity-0 [&[open]_[data-dialog-panel]]:[transform:translateY(0)] starting:[&[open]_[data-dialog-panel]]:[transform:translateY(8px)] [&[open]::backdrop]:opacity-100 starting:[&[open]::backdrop]:opacity-0 [&[open][data-closing]]:opacity-0 [&[open][data-closing]_[data-dialog-panel]]:[transform:translateY(8px)] [&[open][data-closing]::backdrop]:opacity-0"
      data-closing={isClosing || undefined}
      onTransitionEnd={(event) => {
        if (
          event.target === event.currentTarget &&
          event.propertyName === 'opacity'
        ) {
          finishClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        data-dialog-panel
        className="bg-primary text-primary-foreground flex max-h-[calc(100dvh_-_32px)] w-full max-w-[820px] [transform:translateY(8px)] flex-col overflow-hidden overscroll-contain rounded-[28px] p-5 shadow-[0_24px_80px_rgb(0_0_0_/_35%)] outline-none [transition:transform_220ms_cubic-bezier(0.22,_1,_0.36,_1)] motion-reduce:transition-none sm:p-8"
      >
        <header className="mb-6 flex shrink-0 items-start justify-between gap-4">
          <div className="min-w-0">
            {subtitle && (
              <p className="text-background/65 text-sm leading-[1.3]">
                {subtitle}
              </p>
            )}
            <h2
              id={titleId}
              className="mt-2 text-2xl leading-[1.15] font-semibold sm:text-[32px]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Закрыть окно"
            className="text-background/70 hover:text-background focus-visible:outline-background -mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-2"
            onClick={close}
          >
            <CloseIcon aria-hidden="true" className="size-6" />
          </button>
        </header>
        <div
          key={title}
          className="min-h-0 overflow-y-auto overscroll-contain pr-1"
        >
          {children}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
