'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Clock, Search, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

export default function CaregiverDashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Caregiver Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search patients..." className="w-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mock Patient 1 */}
        <Card className="border-t-4 border-t-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Rajveer Singh</CardTitle>
                <CardDescription>Father • 4 Active Medications</CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Good Adherence
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Adherence</span>
                <span className="text-sm font-bold text-green-700">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Today&apos;s Schedule</h4>
              <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Morning (8:00 AM)</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Taken</Badge>
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Afternoon (1:00 PM)</span>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Taken</Badge>
              </div>
              <div className="flex justify-between items-center bg-accent/10 border border-accent/20 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Evening (8:00 PM)</span>
                </div>
                <span className="text-xs font-semibold text-accent">Pending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mock Patient 2 */}
        <Card className="border-t-4 border-t-destructive shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Anita Kumar</CardTitle>
                <CardDescription>Aunt • 2 Active Medications</CardDescription>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Action Needed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Adherence</span>
                <span className="text-sm font-bold text-destructive">65%</span>
              </div>
              <Progress value={65} className="h-2 bg-muted [&>div]:bg-destructive" />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Today&apos;s Schedule</h4>
              <div className="flex justify-between items-center bg-red-50 border border-red-100 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Morning (9:00 AM)</span>
                </div>
                <Badge variant="destructive">Not Confirmed</Badge>
              </div>
              <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Evening (9:00 PM)</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Upcoming</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
