'use client'

import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import type { HomeResponse } from '@/lib/bitrix/home-schema'

type QuizCardProps = {
  quiz: HomeResponse['quiz']
  className?: string
}

export function QuizCard({ quiz, className }: QuizCardProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const question = quiz.questions[currentQuestionIndex]
  const currentQuestionNumber = currentQuestionIndex + 1

  const selectQuestion = (nextIndex: number) => {
    setCurrentQuestionIndex(nextIndex)
    setSelectedOption(null)
  }

  return (
    <section
      aria-labelledby="quiz-card-title"
      className={twMerge(
        'text-ink flex min-h-[460px] w-full max-w-[380px] flex-col rounded-[20px] bg-white p-5',
        className,
      )}
    >
      <div className="flex flex-1 flex-col">
        <h2
          id="quiz-card-title"
          className="min-h-[60px] text-[25px] leading-[1.2] font-semibold"
        >
          {question.question}
        </h2>

        <div
          aria-label={`Прогресс квиза: вопрос ${currentQuestionNumber} из ${quiz.total}`}
          className="bg-ink/40 mt-5 h-1.5 w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={quiz.total}
          aria-valuenow={currentQuestionNumber}
        >
          <div
            className="bg-ink h-full rounded-full transition-[width] duration-300"
            style={{ width: `${(currentQuestionNumber / quiz.total) * 100}%` }}
          />
        </div>

        <div
          className="mt-7 space-y-2"
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
                className="bg-ink focus-visible:outline-primary flex h-[43px] w-full items-center gap-3 rounded-[21px] px-4 text-left text-base font-semibold text-white transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99]"
              >
                <span
                  aria-hidden="true"
                  className={`size-4 shrink-0 rounded-full border border-white transition-colors ${
                    isSelected ? 'bg-white' : 'bg-transparent'
                  }`}
                />
                <span>{answer.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          aria-label="Предыдущий вопрос"
          disabled={currentQuestionIndex === 0}
          onClick={() => selectQuestion(currentQuestionIndex - 1)}
          className="border-ink text-ink hover:bg-ink focus-visible:outline-primary disabled:hover:text-ink inline-flex size-10 items-center justify-center rounded-full border-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
          >
            <path
              d="m14 6-6 6 6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        <span className="text-ink/50 text-base">
          Вопрос {currentQuestionNumber} из {quiz.total}
        </span>

        <button
          type="button"
          aria-label="Следующий вопрос"
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          onClick={() => selectQuestion(currentQuestionIndex + 1)}
          className="bg-ink focus-visible:outline-primary inline-flex size-10 items-center justify-center rounded-full text-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
          >
            <path
              d="m10 6 6 6-6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}
