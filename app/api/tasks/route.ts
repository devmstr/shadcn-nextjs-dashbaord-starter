import { type NextRequest, NextResponse } from 'next/server'
import type { Task } from '@/app/dashboard/tasks/data/schema'

async function getTasks() {
  const tasks = await import('@/app/dashboard/tasks/data/tasks.json')
  return tasks.default as Task[]
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse pagination params
    const page = Number.parseInt(searchParams.get('page') || '1')
    const pageSize = Number.parseInt(searchParams.get('pageSize') || '25')

    // Parse filter params
    const statusFilter =
      searchParams.get('status')?.split(',').filter(Boolean) || []
    const priorityFilter =
      searchParams.get('priority')?.split(',').filter(Boolean) || []
    const labelFilter =
      searchParams.get('label')?.split(',').filter(Boolean) || []
    const searchQuery = searchParams.get('search') || ''

    // Parse sorting params
    const sortBy = searchParams.get('sortBy') || ''
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    let tasks = await getTasks()

    // Apply filters
    if (statusFilter.length > 0) {
      tasks = tasks.filter((task) => statusFilter.includes(task.status))
    }

    if (priorityFilter.length > 0) {
      tasks = tasks.filter((task) => priorityFilter.includes(task.priority))
    }

    if (labelFilter.length > 0) {
      tasks = tasks.filter((task) => labelFilter.includes(task.label))
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.id.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortBy) {
      tasks.sort((a, b) => {
        const aValue = a[sortBy as keyof Task]
        const bValue = b[sortBy as keyof Task]

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    // Calculate pagination
    const totalRows = tasks.length
    const totalPages = Math.ceil(totalRows / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // Get paginated data
    const paginatedTasks = tasks.slice(startIndex, endIndex)

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
