'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table'

type FilterableColumn = {
  id: string
  type: 'multi-select' | 'search'
  paramName?: string
}

interface ServerPaginatedTableOptions<TData> {
  columns: ColumnDef<TData, any>[]
  fetchUrl: string
  defaultPageSize?: number
  filterableColumns?: FilterableColumn[] // 👈 new: makes hook reusable
}

interface PaginatedResponse<TData> {
  data: TData[]
  pageCount: number
  rowCount: number
}

export function useServerPaginatedTable<TData>({
  columns,
  fetchUrl,
  defaultPageSize = 25,
  filterableColumns = []
}: ServerPaginatedTableOptions<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // State for table data
  const [data, setData] = useState<TData[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Table state
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Pagination from URL
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: Math.max(0, Number(searchParams.get('page') || 1) - 1),
    pageSize: Number(searchParams.get('pageSize') || defaultPageSize)
  }))

  // Column filters from URL (dynamic)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []

    filterableColumns.forEach(({ id, type, paramName }) => {
      const paramKey = paramName ?? id
      const value = searchParams.get(paramKey)
      if (!value) return

      if (type === 'multi-select') {
        filters.push({ id, value: value.split(',') })
      } else if (type === 'search') {
        filters.push({ id, value })
      }
    })

    return filters
  })

  // Sorting from URL
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')
    if (sortBy) {
      return [{ id: sortBy, desc: sortOrder === 'desc' }]
    }
    return []
  })

  // Sync URL with state
  const updateURL = useCallback(
    (
      newPagination: PaginationState,
      newColumnFilters: ColumnFiltersState,
      newSorting: SortingState
    ) => {
      const params = new URLSearchParams()

      // Pagination
      params.set('page', String(newPagination.pageIndex + 1))
      params.set('pageSize', String(newPagination.pageSize))

      // Filters (generic)
      newColumnFilters.forEach((filter) => {
        const config = filterableColumns.find((c) => c.id === filter.id)
        if (!config || !filter.value) return

        const paramKey = config.paramName ?? config.id

        if (
          config.type === 'multi-select' &&
          Array.isArray(filter.value) &&
          filter.value.length > 0
        ) {
          params.set(paramKey, filter.value.join(','))
        }

        if (config.type === 'search' && !Array.isArray(filter.value)) {
          params.set(paramKey, String(filter.value))
        }
      })

      // Sorting
      if (newSorting.length > 0) {
        params.set('sortBy', newSorting[0].id)
        params.set('sortOrder', newSorting[0].desc ? 'desc' : 'asc')
      }

      // Update URL without reload
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router]
  )

  // Fetch data from server
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('page', String(pagination.pageIndex + 1))
      params.set('pageSize', String(pagination.pageSize))

      // Filters (generic)
      columnFilters.forEach((filter) => {
        const config = filterableColumns.find((c) => c.id === filter.id)
        if (!config || !filter.value) return

        const paramKey = config.paramName ?? config.id

        if (
          config.type === 'multi-select' &&
          Array.isArray(filter.value) &&
          filter.value.length > 0
        ) {
          params.set(paramKey, filter.value.join(','))
        }

        if (config.type === 'search' && !Array.isArray(filter.value)) {
          params.set(paramKey, String(filter.value))
        }
      })

      // Sorting
      if (sorting.length > 0) {
        params.set('sortBy', sorting[0].id)
        params.set('sortOrder', sorting[0].desc ? 'desc' : 'asc')
      }

      const response = await fetch(`${fetchUrl}?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result: PaginatedResponse<TData> = await response.json()
      setData(result.data)
      setPageCount(result.pageCount)
      setRowCount(result.rowCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
      setPageCount(0)
      setRowCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [fetchUrl, pagination, columnFilters, sorting])

  // Refetch when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // React Table instance
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    // Pagination
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater
      setPagination(newPagination)
      updateURL(newPagination, columnFilters, sorting)
    },
    // Sorting
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      updateURL(pagination, columnFilters, newSorting)
    },
    // Filters
    onColumnFiltersChange: (updater) => {
      const newFilters =
        typeof updater === 'function' ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      const newPagination = { ...pagination, pageIndex: 0 }
      setPagination(newPagination)
      updateURL(newPagination, newFilters, sorting)
    },
    // Visibility
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  })

  return {
    table,
    isLoading,
    error,
    rowCount,
    refetch: fetchData
  }
}
