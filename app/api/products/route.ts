import { type NextRequest, NextResponse } from 'next/server'
import type { Product } from '@/app/dashboard/products/data/schema'

async function getProducts() {
  const products = await import('@/app/dashboard/products/data/data.json')
  return products.default as Product[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse pagination params
    const page = Number.parseInt(searchParams.get('page') || '1')
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '25')

    // Parse filter params
    const availibilityFilter =
      searchParams.get('availability')?.split(',').filter(Boolean) || []
    const priceRangeFilter =
      searchParams.get('price')?.split(',').filter(Boolean) || []
    const categoryFilter =
      searchParams.get('category')?.split(',').filter(Boolean) || []
    const nameFilter =
      searchParams.get('name')?.split(',').filter(Boolean) || []
    const searchQuery = searchParams.get('search') || ''

    // Parse sorting params
    const sortBy = searchParams.get('sortBy') || ''
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let products = await getProducts()

    // Apply filters
    if (availibilityFilter.length > 0) {
      products = products.filter((product) =>
        availibilityFilter.includes(product.availability)
      )
    }

    if (priceRangeFilter.length > 0) {
      products = products.filter((product) =>
        priceRangeFilter.includes(product.priceRange)
      )
    }
    if (categoryFilter.length > 0) {
      products = products.filter((product) =>
        categoryFilter.includes(product.category)
      )
    }

    if (nameFilter.length > 0) {
      products = products.filter((product) => nameFilter.includes(product.name))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.id.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy) {
      products.sort((a, b) => {
        const aValue = a[sortBy as keyof Product]
        const bValue = b[sortBy as keyof Product]

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    // Calculate pagination
    const totalRows = products.length
    const totalPages = Math.ceil(totalRows / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // Get paginated data
    const paginatedTasks = products.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedTasks,
      pageCount: totalPages,
      rowCount: totalRows
    })
  } catch (error) {
    console.error('[v0] Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
