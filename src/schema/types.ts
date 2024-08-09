import * as z from 'zod'

export const CardSchema = z.object({
  category: z.string(),
  global: z.boolean(),
  imgUrl: z.string().optional(),
  name: z.string(),
  ownerId: z.string(),
  voiceUrl: z.string().optional(),
  id: z.string(),
})
