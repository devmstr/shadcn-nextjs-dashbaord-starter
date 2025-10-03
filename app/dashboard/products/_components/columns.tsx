'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { categories, availability, priceRanges } from '../data/data.filters'
import { Product } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { DynamicIcon } from '@/lib/lucide-icons.resolver'
import Image from 'next/image'
import { ImageWithFallback } from '@/lib/image-with-fullback'

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    cell: ({ row }) => <div className="">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <ImageWithFallback
        src={row.getValue('imageUrl')}
        alt={row.original.name}
        className="h-10 w-10 rounded-md object-cover"
        width={80}
        height={80}
      />
    ),
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[300px] truncate font-medium">
        {row.getValue('name')}
      </span>
    )
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (c) => c.value === row.getValue('category')
      )
      if (!category) return null

      return (
        <div className="flex items-center gap-2">
          {category.icon && (
            <DynamicIcon
              name={category.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <span>{category.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'availability',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Availability" />
    ),
    cell: ({ row }) => {
      const avail = availability.find(
        (a) => a.value === row.getValue('availability')
      )
      if (!avail) return null

      return (
        <div className="flex items-center gap-2">
          {avail.icon && (
            <DynamicIcon
              name={avail.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <span>{avail.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'priceRange',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price Range" />
    ),
    cell: ({ row }) => {
      const range = priceRanges.find(
        (r) => r.value === row.getValue('priceRange')
      )
      if (!range) return null

      return (
        <div className="flex items-center gap-2">
          {range.icon && (
            <DynamicIcon
              name={range.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <span>{range.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">${row.getValue('price')}</span>
    )
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => (
      <span
        className={
          row.getValue<number>('stock') > 0
            ? 'text-green-600 font-medium'
            : 'text-red-600 font-medium'
        }
      >
        {row.getValue('stock')}
      </span>
    )
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
