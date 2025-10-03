// components/data-table/data-table-toolbar.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'
import { FilterItem, LucideIcon } from '../layout/types'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  debounceMs?: number
  filters?: {
    columnId: string
    title: string
    options: FilterItem[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  debounceMs = 300,
  filters = []
}: DataTableToolbarProps<TData>) {
  // external value stored in table state (may be controlled by URL/hook)
  const externalValue = searchKey
    ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
    : (table.getState().globalFilter as string) ?? ''

  // local input state for instant UI feedback
  const [localSearch, setLocalSearch] = useState<string>(String(externalValue))

  // keep local in sync when external changes (e.g., URL updates) but avoid stomping while typing
  useEffect(() => {
    if (externalValue !== localSearch) {
      setLocalSearch(String(externalValue ?? ''))
    }
    // we intentionally do NOT include localSearch in deps to avoid resetting while typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalValue])

  // "apply" function — either set column filter or global filter on the table
  const applyFilter = (value: string) => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value)
    } else {
      table.setGlobalFilter(value)
    }
  }

  // debounced caller (memoized); canceled on unmount
  const debouncedApply = useMemo(() => {
    const fn = (v: string) => applyFilter(v)
    return debounce(fn, debounceMs)
    // applyFilter and debounceMs are stable enough; if you make applyFilter non-stable,
    // wrap in useCallback and include here. Keep deps minimal to avoid re-creating debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceMs, searchKey, table])

  useEffect(() => {
    return () => {
      debouncedApply.cancel()
    }
  }, [debouncedApply])

  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={localSearch}
          onChange={(event) => {
            const v = event.target.value
            setLocalSearch(v) // instant UI feedback
            debouncedApply(v) // debounced apply to table (and downstream hook/url)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <div className="flex gap-x-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              // cancel pending debounced apply
              debouncedApply.cancel()
              // reset table filters immediately
              table.resetColumnFilters()
              table.setGlobalFilter('')
              // reset local input immediately
              setLocalSearch('')
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
