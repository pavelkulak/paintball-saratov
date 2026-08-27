'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import type { Review } from '@/lib/bitrix/home-schema'

import { formatReviewDate } from './review.utils'
import { ReviewAvatar } from './ReviewAvatar'
import { ReviewRating } from './ReviewRating'

export function ReviewDetailsModal({
  review,
  onClose,
}: {
  review: Review
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const canUseDom = typeof document !== 'undefined'
  const formattedDate = formatReviewDate(review.publishedAt)

  useEffect(() => {
    if (!canUseDom) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [canUseDom, onClose])

  if (!canUseDom) {
    return null
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex cursor-default items-center justify-center overscroll-contain bg-black/65 p-4"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`review-dialog-title-${review.id}`}
        tabIndex={-1}
        className="bg-surface text-ink relative w-full max-w-[560px] rounded-[24px] p-5 outline-none md:p-6"
        onMouseDown={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <ReviewAvatar
              name={review.name}
              avatarUrl={review.avatarUrl}
              sizes="64px"
              className="size-16 text-base"
            />

            <div className="min-w-0">
              <h2
                id={`review-dialog-title-${review.id}`}
                className="truncate text-xl leading-none font-semibold"
              >
                {review.name}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-none">
                <ReviewRating rating={review.rating} />
                <time className="text-muted" dateTime={review.publishedAt}>
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Закрыть отзыв"
            onClick={onClose}
            className="text-ink/60 hover:text-ink focus-visible:ring-primary shrink-0 cursor-pointer rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="mt-5 max-h-[min(65svh,520px)] overflow-y-auto pr-2">
          <p className="text-base leading-[1.35] [overflow-wrap:anywhere] break-words">
            «{review.text}»
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
