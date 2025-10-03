import fs from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'

import { categories, availability, priceRanges } from './data.filters'

interface Product {
  id: string
  name: string
  description: string
  category: string
  availability: string
  priceRange: string
  price: number
  stock: number
  imageUrl: string
}

const createProduct = (): Product => ({
  id: `613${faker.string.numeric(9)}`,
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  category: faker.helpers.arrayElement(categories).value,
  availability: faker.helpers.arrayElement(availability).value,
  priceRange: faker.helpers.arrayElement(priceRanges).value,
  price: Number(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
  stock: faker.number.int({ min: 0, max: 200 }),
  imageUrl: faker.image.urlLoremFlickr({ category: 'product' })
})

const products: Product[] = Array.from({ length: 100 }, createProduct)

fs.writeFileSync(
  path.resolve(__dirname, 'data.json'),
  JSON.stringify(products, null, 2)
)

console.log(`✅ Products data generated successfuly`)

export default products
