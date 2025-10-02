import { type LinkProps } from 'next/link'
import * as LucideIcons from 'lucide-react'

type LucideIcon = keyof typeof LucideIcons

type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: LucideIcon
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: LucideIcon
}

type NavLink = BaseNavItem & {
  url: LinkProps['href'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['href'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavCollapsible,
  NavLink,
  LucideIcon
}
