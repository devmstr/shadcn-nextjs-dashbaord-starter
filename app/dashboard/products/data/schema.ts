import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  availability: z.string(),
  priceRange: z.string(),
  price: z.number(),
  stock: z.number(),
  imageUrl: z.url()
})

export type Product = z.infer<typeof productSchema>
