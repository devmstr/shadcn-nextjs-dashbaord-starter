'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getUser = () => ({
  auth: {
    name: 'Test Auth',
    email: 'test@test.com',
    sub: 'uuid',
    role: 'admin',
    reset: () => {}
  }
})

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { auth } = getUser()

  const handleSignOut = () => {
    auth.reset()

    // Preserve current path for redirect after sign-in
    const currentPath = pathname
    const redirectUrl = `/?redirect=${encodeURIComponent(currentPath)}`

    router.replace(redirectUrl)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  )
}
