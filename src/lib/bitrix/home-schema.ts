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

const reviewSchema = z.strictObject({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  avatarUrl: z.string().url().nullable(),
  rating: z.number().int().min(1).max(5),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  text: z.string().trim().min(1).max(10_000),
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
  reviews: z.array(reviewSchema),
})

export type HomeResponse = z.infer<typeof homeResponseSchema>
export type Review = z.infer<typeof reviewSchema>
