'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import { FileDropzone } from './dropzone'
import { FileList } from './file-list'

export default function Uploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {}
  )

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((file) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 10
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100)
        }))
      }, 300)
    })
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (filename: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== filename))
    setFileProgresses((prev) => {
      const newProgresses = { ...prev }
      delete newProgresses[filename]
      return newProgresses
    })
  }

  return (
    <div className="flex flex-col items-start justify-center ">
      <FileDropzone
        fileInputRef={fileInputRef}
        handleBoxClick={handleBoxClick}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleFileSelect={handleFileSelect}
      />
      <FileList
        uploadedFiles={uploadedFiles}
        fileProgresses={fileProgresses}
        removeFile={removeFile}
      />
    </div>
  )
}
