'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export default function HistoryPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Medication History</h2>
      </div>

      <div className="flex gap-4 items-center flex-wrap mb-6">
        <div className="w-48">
          <Select defaultValue="this-week">
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Filter by Medicine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Medicines</SelectItem>
              <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
              <SelectItem value="pantoprazole">Pantoprazole</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dose Logs</CardTitle>
          <CardDescription>A complete history of your medication interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* September 27 */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">September 27, 2026</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Amoxicillin 500mg</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 08:00 AM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Taken at 08:05 AM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Pantoprazole 40mg</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 02:00 PM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Taken at 02:15 PM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Amoxicillin 500mg</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 08:00 PM</p>
                    </div>
                  </div>
                  <Badge variant="destructive">Missed</Badge>
                </div>
              </div>
            </div>

            {/* September 26 */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">September 26, 2026</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Amoxicillin 500mg</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 08:00 AM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">Taken at 07:55 AM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium">Vitamin D</p>
                      <p className="text-xs text-muted-foreground">Scheduled: 10:00 AM</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-accent border-accent">Skipped</Badge>
                </div>
              </div>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
