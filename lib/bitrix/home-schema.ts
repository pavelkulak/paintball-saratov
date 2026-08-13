import { z } from 'zod'

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
})

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const sectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().optional(),
  text: z.string().optional(),
  image: z.string().url().optional(),
  links: z.array(linkSchema).default([]),
})

const modeSchema = z.object({
  slug: z.enum(['paintball', 'laserTag', 'kids']),
  title: z.string(),
  description: z.string(),
  sections: z.array(sectionSchema).default([]),
})

export const homeResponseSchema = z.object({
  common: z.object({
    seo: seoSchema,
    phone: z.string().optional(),
    address: z.string().optional(),
    sections: z.array(sectionSchema).default([]),
  }),
  modes: z.object({
    paintball: modeSchema,
    laserTag: modeSchema,
    kids: modeSchema,
  }),
})

export type HomeResponse = z.infer<typeof homeResponseSchema>
