'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SlashIcon } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export function DynamicBreadcrumb(props: Props) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1
          const label =
            segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
              {!isLast && <span className="select-none">{'/'}</span>}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
