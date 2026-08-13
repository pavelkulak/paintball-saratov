import { z } from 'zod'

export const homeResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  phone: z.string(),
  address: z.string(),
})

export type HomeResponse = z.infer<typeof homeResponseSchema>
