import { AppSidebar } from '@/components/layout/app-sidebar'
import { useDirection } from '@/components/providers/direction-provider'
import { SearchProvider } from '@/components/providers/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getServerCookie } from '@/lib/cookies/server'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
}

const Layout: React.FC<Props> = async ({ children }: Props) => {
  const defaultOpen =
    Boolean(await getServerCookie<'true' | 'false'>('sidebar_state')) ?? false
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            '@container/content',

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            'has-[[data-layout=fixed]]:h-svh',

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}

export default Layout
