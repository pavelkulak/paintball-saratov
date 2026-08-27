import Image from 'next/image'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const SECTION_DECORS = {
  safety: { src: '/images/headers/Безопасность.png', width: 182 },
  additions: { src: '/images/headers/Дополнения.png', width: 134 },
  infrastructure: { src: '/images/headers/Инфраструктура.png', width: 174 },
  process: { src: '/images/headers/Как_это_работает.png', width: 198 },
  comfort: { src: '/images/headers/Комфорт_для_всех.png', width: 228 },
  media: { src: '/images/headers/Фото_видео.png', width: 134 },
  reviews: { src: '/images/headers/Отзывы.png', width: 134 },
  faq: { src: '/images/headers/Вопросы_Ответы.png', width: 364 },
} as const

type SectionDecor = keyof typeof SECTION_DECORS

type SectionHeadingProps = {
  align?: 'center' | 'start'
  className?: string
  decor?: SectionDecor
  title: ReactNode
  titleId?: string
  description?: ReactNode
}

export function SectionHeading({
  align = 'center',
  className,
  decor,
  title,
  titleId,
  description,
}: SectionHeadingProps) {
  const decorAsset = decor ? SECTION_DECORS[decor] : null

  return (
    <header
      className={twMerge(
        'mx-auto flex w-full flex-col gap-4',
        align === 'start'
          ? 'items-start text-left'
          : 'items-center text-center',
        className,
      )}
    >
      {decorAsset ? (
        <Image
          src={decorAsset.src}
          alt=""
          width={decorAsset.width}
          height={26}
          className="h-[26px] w-auto shrink-0 object-contain"
        />
      ) : null}
      <h2
        id={titleId}
        className="font-display max-w-full text-[40px] leading-[0.98] font-bold tracking-[0.03em] text-current uppercase"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-full text-[14px] leading-[1.2] font-medium text-current opacity-60 md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  )
}
