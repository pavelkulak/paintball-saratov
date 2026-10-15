'use client'

import { useId, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import type { HomeResponse } from '@/lib/bitrix/home-schema'

import { Button } from './Button'
import styles from './QuizCard.module.css'

type QuizCardProps = {
  quiz: HomeResponse['quiz']
  className?: string
  variant?: 'standalone' | 'hero'
}

export function QuizCard({
  quiz,
  className,
  variant = 'standalone',
}: QuizCardProps) {
  const titleId = useId()
  const previewTitleId = useId()
  const contentId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isGlass = variant === 'hero'
  const [expanded, setExpanded] = useState(!isGlass)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const question = quiz.questions[questionIndex]
  const total = quiz.questions.length
  const navigationClassName = twMerge(
    'focus-visible:outline-primary inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40',
    isGlass
      ? 'border-white text-white enabled:hover:bg-white enabled:hover:text-background'
      : 'border-background text-background enabled:hover:bg-background enabled:hover:text-white',
  )

  return (
    <section
      aria-labelledby={expanded ? titleId : previewTitleId}
      data-expanded={expanded}
      className={twMerge(
        'relative flex w-full max-w-[388px] flex-col overflow-hidden rounded-[20px] px-5 pt-6 pb-5',
        isGlass
          ? `${styles.hero} bg-background/50 text-white shadow-[inset_1px_1px_1px_rgb(255_255_255_/_80%),inset_-1px_-1px_1px_rgb(255_255_255_/_12%)] backdrop-blur-[4px]`
          : 'text-background min-h-[467px] bg-white',
        className,
      )}
    >
      {isGlass && (
        <div
          inert={expanded}
          aria-hidden={expanded}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center transition-opacity duration-200 motion-reduce:transition-none ${expanded ? 'invisible opacity-0' : 'visible opacity-100'}`}
        >
          <h2
            id={previewTitleId}
            className="max-w-[280px] text-[25px] leading-[1.15] font-semibold"
          >
            Индивидуальный подбор игры
          </h2>
          <Button
            type="button"
            variant="primary"
            aria-expanded={expanded}
            aria-controls={contentId}
            className="max-w-[180px] rounded-full"
            onClick={() => {
              setExpanded(true)
              requestAnimationFrame(() =>
                headingRef.current?.focus({ preventScroll: true }),
              )
            }}
          >
            Подобрать
          </Button>
        </div>
      )}
      <div
        id={contentId}
        inert={!expanded}
        aria-hidden={!expanded}
        className={`flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none ${expanded ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <h2
            ref={headingRef}
            tabIndex={-1}
            id={titleId}
            className="min-h-[52px] text-[23px] leading-[1.2] font-semibold outline-none"
          >
            {question.question}
          </h2>
          <div
            role="progressbar"
            aria-label={`Прогресс квиза: вопрос ${questionIndex + 1} из ${total}`}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={questionIndex + 1}
            className={`relative mt-4 h-1.5 rounded-full ${isGlass ? 'bg-white/40' : 'bg-background/40'}`}
          >
            <div
              aria-hidden="true"
              style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
              className={`h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${isGlass ? 'bg-white' : 'bg-background'}`}
            />
          </div>
          <fieldset className="mt-5 space-y-2">
            <legend className="sr-only">Варианты ответа</legend>
            {question.answers.map((answer) => (
              <label
                key={answer.id}
                className={`relative flex min-h-10 items-center gap-3 rounded-[21px] border px-[15px] py-2 text-base leading-[19px] font-semibold transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] motion-reduce:transform-none ${isGlass ? 'text-background border-white bg-white' : 'border-background bg-background text-white'}`}
              >
                <input
                  type="radio"
                  name={`${contentId}-${question.id}`}
                  value={answer.id}
                  checked={answers[question.id] === answer.id}
                  onChange={() =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: answer.id,
                    }))
                  }
                  className={`size-4 shrink-0 ${isGlass ? 'accent-background' : 'accent-white'}`}
                />
                <span>{answer.label}</span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="mt-5 grid shrink-0 grid-cols-[40px_1fr_40px] items-center">
          <button
            type="button"
            aria-label="Предыдущий вопрос"
            disabled={questionIndex === 0}
            className={navigationClassName}
            onClick={() => setQuestionIndex((index) => index - 1)}
          >
            <ArrowLeftIcon aria-hidden="true" className="size-6" />
          </button>
          <span
            aria-live="polite"
            className={`text-center text-sm leading-[19px] ${isGlass ? 'text-white/70' : 'text-background/60'}`}
          >
            Вопрос {questionIndex + 1} из {total}
          </span>
          <button
            type="button"
            aria-label="Следующий вопрос"
            disabled={questionIndex === total - 1}
            className={navigationClassName}
            onClick={() => setQuestionIndex((index) => index + 1)}
          >
            <ArrowRightIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
