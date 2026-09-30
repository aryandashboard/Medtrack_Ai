'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.medications.getDashboard()
      setData(res)
    } catch (err: any) {
      if (err.message.includes('token') || err.message.includes('401')) {
        router.push('/login')
      } else {
        setError(err.message || 'Failed to load dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDoseAction = async (doseId: string, status: string) => {
    try {
      await api.medications.updateDoseStatus(doseId, status)
      fetchDashboard()
    } catch (err: any) {
      alert(err.message || 'Failed to update dose')
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
        <Button onClick={fetchDashboard} className="mt-4" variant="outline">Retry</Button>
      </div>
    )
  }

  const doses = data?.todayDoses || []
  const activeMedications = data?.activeMedications || []
  
  // Basic calculations for UI
  const missedDoses = doses.filter((d: any) => d.status === 'missed').length
  const takenDoses = doses.filter((d: any) => d.status === 'taken').length
  const pendingDoses = doses.filter((d: any) => d.status === 'pending')

  let nextDose = null
  if (pendingDoses.length > 0) {
    // Sort pending doses by time
    nextDose = pendingDoses.sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Your Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push('/dashboard/medications/new')}>Add Medication Manually</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Score</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.adherencePercentage}%</div>
            <Progress value={data?.adherencePercentage} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">Past 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Dose</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextDose ? formatTime(nextDose.scheduled_at) : 'None'}
            </div>
            {nextDose && (
              <>
                <p className="text-xs text-muted-foreground mt-1">{nextDose.medication_id?.name} ({nextDose.medication_id?.dosage})</p>
                <Badge variant="outline" className="mt-2 text-accent border-accent">Upcoming</Badge>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed Doses</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missedDoses}</div>
            <p className="text-xs text-muted-foreground mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <span className="text-2xl">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMedications.length}</div>
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
            {doses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No medications scheduled for today.</p>
            ) : (
              <div className="space-y-8">
                {doses.sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()).map((dose: any) => (
                  <div key={dose._id} className={`flex items-center ${dose.status === 'pending' ? '' : 'opacity-80'}`}>
                    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      dose.status === 'taken' ? 'bg-green-100 dark:bg-green-900/20' : 
                      dose.status === 'pending' ? 'bg-accent/20' : 'bg-muted'
                    }`}>
                      {dose.status === 'taken' ? <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" /> : 
                       dose.status === 'pending' ? <Clock className="h-6 w-6 text-accent" /> :
                       <div className="h-3 w-3 rounded-full bg-muted-foreground" />}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{formatTime(dose.scheduled_at)} - {dose.medication_id?.name}</p>
                      <p className="text-sm text-muted-foreground">{dose.medication_id?.instructions || 'No specific instructions'}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      {dose.status === 'pending' ? (
                        <>
                          <Button size="sm" onClick={() => handleDoseAction(dose._id, 'taken')} className="bg-green-600 hover:bg-green-700 text-white">Taken</Button>
                          <Button size="sm" onClick={() => handleDoseAction(dose._id, 'skipped')} variant="outline">Skip</Button>
                        </>
                      ) : (
                        <Badge variant="outline" className={dose.status === 'taken' ? 'bg-green-500 text-white hover:bg-green-600' : ''}>
                          {dose.status.charAt(0).toUpperCase() + dose.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Visual overview of your day.</CardDescription>
          </CardHeader>
          <CardContent>
            {doses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No timeline available.</p>
            ) : (
              <div className="space-y-4 font-mono text-sm">
                {doses.sort((a: any, b: any) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()).map((dose: any) => (
                  <div key={`timeline-${dose._id}`} className="flex items-center gap-4">
                    <div className="w-12 text-right text-muted-foreground">
                      {new Date(dose.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                    <div className={dose.status === 'taken' ? 'text-green-500' : dose.status === 'pending' ? 'text-accent' : 'text-muted-foreground'}>
                      ── {dose.status === 'taken' ? '✓' : dose.status === 'pending' ? '●' : '○'}
                    </div>
                    <div className={dose.status === 'pending' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
                      {dose.medication_id?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
