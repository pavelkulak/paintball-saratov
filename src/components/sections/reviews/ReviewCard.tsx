'use client'

import { useState } from 'react'

import type { Review } from '@/lib/bitrix/home-schema'

import { formatReviewDate } from './review.utils'
import { ReviewAvatar } from './ReviewAvatar'
import { ReviewDetailsModal } from './ReviewDetailsModal'
import { ReviewRating } from './ReviewRating'

export function ReviewCard({ review }: { review: Review }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const formattedDate = formatReviewDate(review.publishedAt)

  return (
    <li className="w-[min(328px,calc(100vw-32px))] md:w-[clamp(420px,40vw,592px)] xl:w-[592px]">
      <article className="text-ink flex h-[276px] flex-col rounded-[24px] bg-white p-5 md:h-[248px] md:p-6">
        <header className="flex items-start gap-4">
          <ReviewAvatar
            name={review.name}
            avatarUrl={review.avatarUrl}
            sizes="80px"
            className="size-20 text-xl"
          />

          <div className="min-w-0 pt-1">
            <h3 className="truncate text-base leading-[1.1] font-semibold">
              {review.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-xs leading-none">
              <ReviewRating rating={review.rating} />
              <time className="text-muted" dateTime={review.publishedAt}>
                {formattedDate}
              </time>
            </div>
          </div>
        </header>

        <p className="mt-6 line-clamp-6 text-sm leading-[1.2] [overflow-wrap:anywhere] break-words md:mt-4 md:line-clamp-4 md:text-base">
          «{review.text}»
        </p>

        <button
          type="button"
          className="text-muted hover:text-ink focus-visible:ring-primary mt-auto w-fit cursor-pointer rounded-sm text-sm leading-none transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            setIsDetailsOpen(true)
          }}
        >
          Ещё …
        </button>
      </article>

      {isDetailsOpen ? (
        <ReviewDetailsModal
          review={review}
          onClose={() => {
            setIsDetailsOpen(false)
          }}
        />
      ) : null}
    </li>
  )
}
