import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import Image from 'next/image'
import { z } from 'zod'

import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { Task } from './data/schema'

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.'
}

export default async function TaskPage() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col gap-8 p-8 md:flex">
        <DataTable columns={columns} />
      </div>
    </>
  )
}
