import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table/bulk-actions'
import { categories, availability, priceRanges } from '../data/data.filters'
import { type Product } from '../data/schema'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'
import { DynamicIcon } from '@/lib/lucide-icons.resolver'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: string) => {
    const selectedProducts = selectedRows.map((row) => row.original as Product)
    toast.promise(sleep(2000), {
      loading: 'Updating status...',
      success: () => {
        table.resetRowSelection()
        return `Status updated to "${status}" for ${
          selectedProducts.length
        } Product${selectedProducts.length > 1 ? 's' : ''}.`
      },
      error: 'Error'
    })
    table.resetRowSelection()
  }

  const handleBulkPriorityChange = (priority: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Product)
    toast.promise(sleep(2000), {
      loading: 'Updating priority...',
      success: () => {
        table.resetRowSelection()
        return `Priority updated to "${priority}" for ${
          selectedTasks.length
        } task${selectedTasks.length > 1 ? 's' : ''}.`
      },
      error: 'Error'
    })
    table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map((row) => row.original as Product)
    toast.promise(sleep(2000), {
      loading: 'Exporting tasks...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedTasks.length} task${
          selectedTasks.length > 1 ? 's' : ''
        } to CSV.`
      },
      error: 'Error'
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="task">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Update status"
                  title="Update status"
                >
                  <CircleArrowUp />
                  <span className="sr-only">Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Category</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {categories.map((category) => (
              <DropdownMenuItem
                key={category.value}
                defaultValue={category.value}
                onClick={() => handleBulkStatusChange(category.value)}
              >
                {category.icon && (
                  <DynamicIcon
                    name={category.icon}
                    className="text-muted-foreground size-4"
                  />
                )}
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Update priority"
                  title="Update priority"
                >
                  <ArrowUpDown />
                  <span className="sr-only">Update stock</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Stock</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {availability.map((availability) => (
              <DropdownMenuItem
                key={availability.value}
                defaultValue={availability.value}
                onClick={() => handleBulkPriorityChange(availability.value)}
              >
                {availability.icon && (
                  <DynamicIcon
                    className="text-muted-foreground size-4"
                    name={availability.icon}
                  />
                )}
                {availability.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBulkExport()}
              className="size-8"
              aria-label="Export tasks"
              title="Export tasks"
            >
              <Download />
              <span className="sr-only">Export tasks</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export tasks</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected tasks"
              title="Delete selected tasks"
            >
              <Trash2 />
              <span className="sr-only">Delete selected tasks</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected tasks</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
