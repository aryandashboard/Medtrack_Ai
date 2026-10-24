'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function HistoryPage() {
  const router = useRouter()
  const [doseLogs, setDoseLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [medicineFilter, setMedicineFilter] = useState('all')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.medications.getHistory()
      setDoseLogs(res.doseLogs || [])
    } catch (err: any) {
      if (err.message.includes('token') || err.message.includes('401')) {
        router.push('/login')
      } else {
        setError(err.message || 'Failed to load history')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-8 text-center text-destructive">
        <p>{error}</p>
      </div>
    )
  }

  // Filter logs locally
  let filteredLogs = doseLogs
  if (medicineFilter !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.medication_id?._id === medicineFilter)
  }

  // Group by date
  const groupedLogs: Record<string, any[]> = {}
  filteredLogs.forEach(log => {
    const dateStr = new Date(log.scheduled_at).toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    if (!groupedLogs[dateStr]) groupedLogs[dateStr] = []
    groupedLogs[dateStr].push(log)
  })

  // Extract unique medicines for filter dropdown
  const uniqueMedicines = Array.from(new Set(doseLogs.map(log => log.medication_id?._id)))
    .map(id => doseLogs.find(log => log.medication_id?._id === id)?.medication_id)
    .filter(Boolean)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Medication History</h2>
      </div>

      <div className="flex gap-4 items-center flex-wrap mb-6">
        <div className="w-48">
          <Select value={medicineFilter} onValueChange={(val) => setMedicineFilter(val || 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Medicine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Medicines</SelectItem>
              {uniqueMedicines.map((med: any) => (
                <SelectItem key={med._id} value={med._id}>{med.name}</SelectItem>
              ))}
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
            {Object.keys(groupedLogs).length === 0 ? (
              <p className="text-sm text-muted-foreground">No medication history found.</p>
            ) : (
              Object.keys(groupedLogs).map(dateStr => (
                <div key={dateStr}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">{dateStr}</h3>
                  <div className="space-y-4">
                    {groupedLogs[dateStr].map(log => (
                      <div key={log._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {log.status === 'taken' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
                           log.status === 'skipped' ? <AlertCircle className="h-5 w-5 text-accent" /> :
                           log.status === 'missed' ? <XCircle className="h-5 w-5 text-destructive" /> :
                           <div className="h-3 w-3 rounded-full bg-muted-foreground ml-1" />
                          }
                          <div>
                            <p className="text-sm font-medium">{log.medication_id?.name || 'Unknown'} {log.medication_id?.strength || ''}</p>
                            <p className="text-xs text-muted-foreground">
                              Scheduled: {new Date(log.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {log.status === 'taken' ? (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white">Taken {log.taken_at ? `at ${new Date(log.taken_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</Badge>
                        ) : log.status === 'skipped' ? (
                          <Badge variant="outline" className="text-accent border-accent">Skipped</Badge>
                        ) : log.status === 'missed' ? (
                          <Badge variant="destructive">Missed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
