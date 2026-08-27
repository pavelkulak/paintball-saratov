'use client'

import { useState } from 'react'

import { AccordionIcon } from '@/components/icons/AccordionIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'

const faqItems = [
  {
    question: 'С какого возраста подходит формат?',
    answer:
      'Подберём формат по возрасту и опыту участников, чтобы всем было комфортно и интересно.',
    compact: false,
  },
  {
    question: 'Можно ли организовать день рождения?',
    answer:
      'Да, поможем собрать программу под повод, количество гостей и пожелания по празднику.',
    compact: false,
  },
  {
    question: 'Какой формат выбрать ребёнку?',
    answer:
      'Расскажем о доступных форматах и предложим вариант с учётом возраста, состава группы и целей мероприятия.',
    compact: false,
  },
  {
    question: 'Что делать, если дети играют впервые?',
    answer:
      'Перед игрой инструктор объяснит правила, проведёт инструктаж и будет сопровождать участников весь праздник.',
    compact: false,
  },
  {
    question: 'Что входит в комплект?',
    answer:
      'Перед началом выдаём необходимое игровое снаряжение и объясняем, как им пользоваться.',
    compact: false,
  },
  {
    question: 'Можно ли добавить питание и отдых?',
    answer:
      'Обсудим дополнительные опции для отдыха и питания, чтобы программа подходила именно вашей компании.',
    compact: false,
  },
  {
    question: 'Что взять с собой?',
    answer:
      'Подойдут удобная одежда и обувь по погоде. Остальные детали заранее подскажет менеджер.',
    compact: true,
  },
  {
    question: 'Как забронировать?',
    answer:
      'Оставьте заявку на сайте или свяжитесь с нами удобным способом — уточним детали и зафиксируем дату.',
    compact: true,
  },
] as const

const faqColumns = [
  faqItems.filter((_, index) => index % 2 === 0),
  faqItems.filter((_, index) => index % 2 === 1),
] as const

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: (typeof faqItems)[number]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const answerId = `faq-answer-${index}`

  return (
    <li className="bg-surface text-ink overflow-hidden rounded-3xl">
      <button
        type="button"
        aria-controls={answerId}
        aria-expanded={isOpen}
        className={`focus-visible:ring-primary grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-left focus-visible:ring-2 focus-visible:outline-none ${
          item.compact ? 'py-2' : 'py-5 md:py-2'
        } px-5`}
        onClick={onToggle}
      >
        <span className="min-w-0 text-[20px] leading-[1.2] font-semibold">
          {item.question}
        </span>
        <span className="bg-primary flex size-12 shrink-0 items-center justify-center rounded-[14px]">
          <AccordionIcon isOpen={isOpen} />
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div id={answerId} className="min-h-0 overflow-hidden">
          <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 pb-5">
            <p className="text-ink/70 min-w-0 text-sm leading-[1.3]">
              {item.answer}
            </p>
            <span aria-hidden="true" className="size-12" />
          </div>
        </div>
      </div>
    </li>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      aria-labelledby="faq-title"
      className="bg-background text-foreground w-full overflow-hidden"
    >
      <div className="max-w-content mx-auto w-full px-4 md:px-8 xl:px-0">
        <SectionHeading
          className="gap-7"
          decor="faq"
          title={
            <>
              <span className="md:hidden">
                Часто
                <br />
                спрашивают
              </span>
              <span className="hidden md:inline">Часто спрашивают</span>
            </>
          }
          titleId="faq-title"
        />

        <div className="mt-10 w-full pb-0 md:mt-12">
          <ul className="flex flex-col gap-4 md:hidden">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                index={index}
                isOpen={openIndex === index}
                item={item}
                onToggle={() => {
                  setOpenIndex((currentIndex) =>
                    currentIndex === index ? null : index,
                  )
                }}
              />
            ))}
          </ul>

          <div className="hidden grid-cols-2 gap-4 md:grid">
            {faqColumns.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex min-w-0 flex-col gap-4">
                {column.map((item) => {
                  const index = faqItems.indexOf(item)

                  return (
                    <FAQItem
                      key={item.question}
                      index={index}
                      isOpen={openIndex === index}
                      item={item}
                      onToggle={() => {
                        setOpenIndex((currentIndex) =>
                          currentIndex === index ? null : index,
                        )
                      }}
                    />
                  )
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
