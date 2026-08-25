import { z } from 'zod'

const quizAnswerSchema = z.strictObject({
  id: z.string(),
  label: z.string(),
})

const quizQuestionSchema = z.strictObject({
  id: z.string(),
  question: z.string(),
  answers: z.array(quizAnswerSchema).min(1),
})

export const homeResponseSchema = z.strictObject({
  title: z.string(),
  description: z.string(),
  phone: z.string(),
  address: z.string(),
  quiz: z.strictObject({
    total: z.number().int().positive(),
    questions: z.array(quizQuestionSchema).min(1),
  }),
})

export type HomeResponse = z.infer<typeof homeResponseSchema>
