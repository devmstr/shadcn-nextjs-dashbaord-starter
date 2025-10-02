'use client'

import {
  QueryClient,
  QueryClientProvider,
  QueryCache
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'

// Example server error handler
function handleServerError(error: unknown) {
  console.error(error)
}

interface Props {
  children: ReactNode
}

export function ReactQueryProvider({ children }: Props) {
  const router = useRouter()

  // ✅ Create QueryClient once per provider instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (process.env.NODE_ENV === 'development') {
                console.log({ failureCount, error })
              }

              if (failureCount >= 0 && process.env.NODE_ENV === 'development')
                return false
              if (failureCount > 3 && process.env.NODE_ENV === 'production')
                return false

              return !(
                error instanceof AxiosError &&
                [401, 403].includes(error.response?.status ?? 0)
              )
            },
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            staleTime: 10 * 1000 // 10s
          },
          mutations: {
            onError: (error) => {
              handleServerError(error)

              if (error instanceof AxiosError) {
                if (error.response?.status === 304) {
                  toast.error('Content not modified!')
                }
              }
            }
          }
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof AxiosError) {
              if (error.response?.status === 401) {
                toast.error('Session expired!')
                // Reset your auth state here if using Zustand/Context
                const redirect = window.location.href
                router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`)
              }
              if (error.response?.status === 500) {
                toast.error('Internal Server Error!')
                router.push('/500')
              }
              if (error.response?.status === 403) {
                router.push('/forbidden')
              }
            }
          }
        })
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
