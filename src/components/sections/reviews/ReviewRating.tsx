import { Star } from 'lucide-react'

export function ReviewRating({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <span
      role="img"
      aria-label={`${safeRating} из 5 звёзд`}
      className="text-accent inline-flex items-center gap-0.5"
    >
      {Array.from({ length: safeRating }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className="size-3.5"
          fill="currentColor"
          strokeWidth={1.75}
        />
      ))}
    </span>
  )
}
