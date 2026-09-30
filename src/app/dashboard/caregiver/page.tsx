'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Clock, Search, ShieldCheck, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'

export default function CaregiverDashboardPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteCode, setInviteCode] = useState('')
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await api.caregiver.getPatients()
      setPatients(res.patients || [])
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinPatient = async () => {
    if (!inviteCode) return
    setJoining(true)
    try {
      await api.caregiver.acceptInvite(inviteCode)
      setInviteCode('')
      fetchPatients()
    } catch (err: any) {
      alert(err.message || 'Failed to accept invite')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Caregiver Dashboard</h2>
      </div>

      <div className="flex items-center gap-4 mb-6 max-w-md">
        <Input 
          placeholder="Enter Patient Invite Code" 
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleJoinPatient} disabled={joining || !inviteCode}>
          {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
          Add Patient
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-6 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search patients..." className="w-full" />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : patients.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          You are not monitoring any patients yet. Ask a patient to generate an invite code for you.
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {patients.map(patient => (
            <Card key={patient._id} className="border-t-4 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{patient.name}</CardTitle>
                    <CardDescription>{patient.email}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Monitoring Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
