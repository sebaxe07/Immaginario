import { z } from 'zod'

export const sequenceSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
})

export const cardSchema = z.object({
  name: z.string().min(2, { message: 'Name must be 2 characters long' }),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password is too long' }),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const newCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters' })
    .max(50, { message: 'Category name is too long' })
    .refine((name) => name.toLowerCase() !== 'all', { message: 'Illegal category name' }),
})

export const saveDaySchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character' }).max(20, { message: 'Name is too long' }),
})
