'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api.auth.logout()
      router.push('/login')
    } catch (err) {
      console.error('Logout failed:', err)
      // Even if API fails, clear any local state and redirect to login just to be safe
      router.push('/login')
    }
  }

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      onClick={handleLogout}
    >
      <LogOut className="mr-3 h-4 w-4" />
      Log out
    </Button>
  )
}
