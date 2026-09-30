import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl text-primary">MedTrack AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 md:py-32 lg:py-40 bg-gradient-to-b from-white to-muted/50 dark:from-background dark:to-muted">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-primary">
            Never miss a dose.<br />
            <span className="text-accent">Never lose track of care.</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            AI-powered medicine adherence and caregiver monitoring platform. Simply upload your prescription, and we handle the schedule, reminders, and tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto font-semibold px-8 text-md bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold px-8 text-md border-primary text-primary hover:bg-primary/10">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">© 2026 MedTrack AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
