import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Good Evening, User</h2>
        <div className="flex items-center space-x-2">
          <Button>Add Medication Manually</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Score</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Progress value={92} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">27 / 30 doses taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Dose</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8:00 PM</div>
            <p className="text-xs text-muted-foreground mt-1">Antibiotic (1 capsule)</p>
            <Badge variant="outline" className="mt-2 text-accent border-accent">Upcoming</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed Doses</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Currently taking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today&apos;s Medication</CardTitle>
            <CardDescription>Your scheduled doses for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">8:00 AM - Vitamin D</p>
                  <p className="text-sm text-muted-foreground">Taken on time</p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  <Badge className="bg-green-500 hover:bg-green-600">Taken</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">1:00 PM - Paracetamol</p>
                  <p className="text-sm text-muted-foreground">Due in 20 minutes</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Taken</Button>
                  <Button size="sm" variant="outline">Snooze</Button>
                </div>
              </div>
              <div className="flex items-center opacity-60">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">8:00 PM - Antibiotic</p>
                  <p className="text-sm text-muted-foreground">After food</p>
                </div>
                <div className="ml-auto font-medium text-sm">
                  Upcoming
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Visual overview of your day.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 text-right text-muted-foreground">08:00</div>
                <div className="text-green-500">── ✓</div>
                <div>Vitamin D</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 text-right text-muted-foreground">13:00</div>
                <div className="text-accent">── ●</div>
                <div className="font-semibold text-foreground">Paracetamol</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 text-right text-muted-foreground">20:00</div>
                <div className="text-muted-foreground">── ○</div>
                <div className="text-muted-foreground">Antibiotic</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
