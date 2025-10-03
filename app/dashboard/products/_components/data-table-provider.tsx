'use client'
import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Product } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type ProductDialogsContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Product | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>
}

const ProductDialogsContext =
  React.createContext<ProductDialogsContextType | null>(null)

export function ProductDialogsProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Product | null>(null)

  return (
    <ProductDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProductDialogsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProductDialogs = () => {
  const productDialogsContext = React.useContext(ProductDialogsContext)

  if (!productDialogsContext) {
    throw new Error(
      'userProductDialogs has to be used within <ProductDialogsContext>'
    )
  }

  return productDialogsContext
}
