'use client'

import { useId, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import type { HomeResponse } from '@/lib/bitrix/home-schema'

type QuizCardProps = {
  quiz: HomeResponse['quiz']
  className?: string
}

const navigationButtonClassName =
  'border-background text-background focus-visible:outline-primary enabled:hover:bg-background inline-flex size-10 items-center justify-center rounded-full border-2 bg-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40 lg:border-white lg:text-white lg:enabled:hover:bg-white lg:enabled:hover:text-background'

export function QuizCard({ quiz, className }: QuizCardProps) {
  const titleId = useId()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const question = quiz.questions[currentQuestionIndex]
  const currentQuestionNumber = currentQuestionIndex + 1

  const selectQuestion = (nextIndex: number) => {
    setCurrentQuestionIndex(nextIndex)
    setSelectedOption(null)
  }

  // Figma Glass: light -45° / 80%, refraction 80, depth 20,
  // dispersion 50, frost 4, splay 0. CSS approximates frost and edge lighting;
  // the refraction and dispersion require a separate shader implementation.
  return (
    <section
      aria-labelledby={titleId}
      className={twMerge(
        'text-background lg:bg-background/50 flex min-h-[467px] w-full max-w-[388px] flex-col overflow-hidden rounded-[20px] bg-white px-5 pt-8 pb-[22px] lg:text-white lg:shadow-[inset_1px_1px_1px_rgb(255_255_255_/_80%),inset_-1px_-1px_1px_rgb(255_255_255_/_12%)] lg:backdrop-blur-[4px]',
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        <h2
          id={titleId}
          className="min-h-[60px] max-w-[253px] text-[25px] leading-[1.2] font-semibold"
        >
          {question.question}
        </h2>

        <div
          aria-label={`Прогресс квиза: вопрос ${currentQuestionNumber} из ${quiz.total}`}
          className="relative mt-5 h-1.5 w-full"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={quiz.total}
          aria-valuenow={currentQuestionNumber}
        >
          <div
            aria-hidden="true"
            className="bg-background/40 absolute inset-x-0 top-px h-1 rounded-full lg:bg-white/40"
          />
          <div
            className="bg-background relative h-full rounded-full transition-[width] duration-300 lg:bg-white"
            style={{ width: `${(currentQuestionNumber / quiz.total) * 100}%` }}
          />
        </div>

        <div
          className="mt-[27px] space-y-2"
          role="radiogroup"
          aria-label="Варианты ответа"
        >
          {question.answers.map((answer) => {
            const isSelected = selectedOption === answer.id

            return (
              <button
                key={answer.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedOption(answer.id)}
                className="border-background bg-background focus-visible:outline-primary lg:text-background flex h-[43px] w-full items-center gap-3 rounded-[21px] border px-[15px] text-left text-base leading-[19px] font-semibold text-white transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99] lg:border-white lg:bg-white"
              >
                <span
                  aria-hidden="true"
                  className={`lg:border-background size-4 shrink-0 rounded-full border border-white transition-colors ${
                    isSelected ? 'lg:bg-background bg-white' : 'bg-transparent'
                  }`}
                />
                <span>{answer.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[40px_1fr_40px] items-center">
        <button
          type="button"
          aria-label="Предыдущий вопрос"
          disabled={currentQuestionIndex === 0}
          onClick={() => selectQuestion(currentQuestionIndex - 1)}
          className={navigationButtonClassName}
        >
          <ArrowLeftIcon aria-hidden="true" className="size-6" />
        </button>

        <span className="text-background/50 text-center text-base leading-[19px] lg:text-white/50">
          Вопрос {currentQuestionNumber} из {quiz.total}
        </span>

        <button
          type="button"
          aria-label="Следующий вопрос"
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          onClick={() => selectQuestion(currentQuestionIndex + 1)}
          className={navigationButtonClassName}
        >
          <ArrowRightIcon aria-hidden="true" className="size-6" />
        </button>
      </div>
    </section>
  )
}
