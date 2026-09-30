'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Loader2, Copy } from 'lucide-react'

export default function SettingsPage() {
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerateInvite = async () => {
    setLoading(true)
    try {
      const res = await api.caregiver.generateInvite()
      setInviteCode(res.inviteCode)
    } catch (err: any) {
      alert(err.message || 'Failed to generate invite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Caregiver Access</CardTitle>
          <CardDescription>Generate an invite code to allow a family member or caregiver to monitor your medication adherence.</CardDescription>
        </CardHeader>
        <CardContent>
          {inviteCode ? (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-md border">
              <span className="font-mono text-xl tracking-widest font-bold">{inviteCode}</span>
              <Button size="icon" variant="outline" onClick={() => navigator.clipboard.writeText(inviteCode)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active invite code.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateInvite} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Invite Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
