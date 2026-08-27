import type { HTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type MediaCardFrameProps = {
  children: ReactNode
  className?: string
}

export function MediaCardFrame({ children, className }: MediaCardFrameProps) {
  return (
    <div
      className={twMerge(
        'relative overflow-hidden rounded-[24px] bg-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MediaCardCaption({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'text-ink absolute right-2 bottom-2 left-2 z-10 overflow-hidden rounded-[16px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]',
        className,
      )}
      {...props}
    />
  )
}
