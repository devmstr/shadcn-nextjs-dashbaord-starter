'use client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Uploader from '@/components/uplaoder'

const formSchema = z.lazy(() =>
  z.object({
    file: z
      .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
        message: 'Please upload a file'
      })
      .refine(
        (files) => files && ['text/csv'].includes(files[0]?.type),
        'Please upload csv format.'
      )
  })
)

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TasksImportDialog({
  open,
  onOpenChange
}: TaskImportDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined }
  })

  const fileRef = form.register('file')

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type
      }
      showSubmittedData(fileDetails, 'You have imported the following file:')
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-start">
          <DialogTitle>Import Products</DialogTitle>
          <DialogDescription>
            Import products quickly from a CSV file.
          </DialogDescription>
        </DialogHeader>

        <Uploader />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
