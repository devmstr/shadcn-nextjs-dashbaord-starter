import { AppSidebar } from '@/components/layout/app-sidebar'
import { useDirection } from '@/components/providers/direction-provider'
import { SearchProvider } from '@/components/providers/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getServerCookie } from '@/lib/cookies/server'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { LanguageSwitch } from '@/components/lanuage-switch'
import { DynamicBreadcrumb } from '@/components/breadcrumb'

interface Props {
  children: React.ReactNode
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true
  }
]

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
          {/* ===== Top Heading ===== */}
          <Header className="w-full flex">
            {/* <TopNav links={topNav} className="flex w-full" /> */}
            <DynamicBreadcrumb className="w-full" />
            <div className="flex w-fit items-center gap-4">
              <Search />
              {/* TODO:fix the direction on sidebar and nav bar  */}
              {/* <LanguageSwitch /> */}
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  )
}

export default Layout
