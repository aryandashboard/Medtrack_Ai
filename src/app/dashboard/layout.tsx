import Link from 'next/link'
import { Pill, LayoutDashboard, History, Settings, FileText, Users } from 'lucide-react'
import { LogoutButton } from '@/components/LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-sidebar md:min-h-screen flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b shrink-0">
          <Link className="flex items-center gap-2 font-bold text-xl text-sidebar-primary" href="/">
            <Pill className="h-6 w-6" />
            <span>MedTrack AI</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/scanner" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <FileText className="h-4 w-4" />
            Scan Prescription
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <History className="h-4 w-4" />
            History
          </Link>
          <Link href="/dashboard/caregiver" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Users className="h-4 w-4" />
            Caregiver Access
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t shrink-0">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-0 bg-background/50">
        {children}
      </main>
    </div>
  )
}
