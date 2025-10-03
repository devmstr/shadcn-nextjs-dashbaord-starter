'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'

import { categories, availability, priceRanges } from '../data/data.filters'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useProductDialogs } from './data-table-provider'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { setOpen } = useProductDialogs()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categories}
          />
        )}
        {table.getColumn('availability') && (
          <DataTableFacetedFilter
            column={table.getColumn('availability')}
            title="Stock"
            options={availability}
          />
        )}
        {table.getColumn('priceRange') && (
          <DataTableFacetedFilter
            column={table.getColumn('priceRange')}
            title="Type"
            options={priceRanges}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button
          variant={'outline'}
          onClick={(e) => setOpen('import')}
          size="sm"
        >
          Import
        </Button>
        <Button onClick={(e) => setOpen('create')} size="sm">
          Add Product
        </Button>
      </div>
    </div>
  )
}
