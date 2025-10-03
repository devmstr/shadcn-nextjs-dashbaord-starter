'use client'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './data-table-import-dialog'
import { ProductsMutateDrawer } from './tasks-mutate-drawer'
import { useProductDialogs } from './data-table-provider'

export function ProductsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductDialogs()

  console.log({ open })

  return (
    <>
      <ProductsMutateDrawer
        key="task-create"
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key="tasks-import"
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <ProductsMutateDrawer
            key={`task-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key="task-delete"
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            className="max-w-md"
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText="Delete"
          />
        </>
      )}
    </>
  )
}
