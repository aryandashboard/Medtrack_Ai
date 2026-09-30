'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Medication = {
  id?: number | string
  name: string
  strength: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export default function VerifyExtractionPage() {
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([])
  
  useEffect(() => {
    // Load extracted data from sessionStorage
    const storedData = sessionStorage.getItem('medtrack_extraction')
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        // Add pseudo IDs for the UI mapping
        const withIds = parsed.map((item: Omit<Medication, 'id'>, idx: number) => ({
          ...item,
          id: idx + 1
        }))
        queueMicrotask(() => setMedications(withIds))
      } catch (err) {
        console.error("Failed to parse stored extraction", err)
      }
    } else {
      // Fallback or redirect if accessed directly without scanning
      // We will show a placeholder if no data is found to prevent crashing
      queueMicrotask(() => setMedications([]))
    }
  }, [])

  const handleConfirm = () => {
    setIsConfirming(true)
    // Simulate API call to save and create schedules in Supabase
    setTimeout(() => {
      setIsConfirming(false)
      sessionStorage.removeItem('medtrack_extraction')
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Verify Prescription</h2>
      </div>
      
      <Alert variant="default" className="border-accent bg-accent/10">
        <AlertCircle className="h-4 w-4 text-accent" />
        <AlertTitle className="text-accent font-semibold">Verification Required</AlertTitle>
        <AlertDescription>
          AI has extracted the following medications. Please review and correct any errors before activating your schedule. MedTrack AI does not provide medical advice.
        </AlertDescription>
      </Alert>

      {medications.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          No medication data found. Please go back and scan a prescription.
        </Card>
      ) : (
        <div className="space-y-6">
          {medications.map((med, index) => (
            <Card key={med.id} className="border-t-4 border-t-secondary">
              <CardHeader className="pb-4">
                <CardTitle>Medication {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`name-${med.id}`}>Medicine Name</Label>
                  <Input id={`name-${med.id}`} defaultValue={med.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`strength-${med.id}`}>Strength</Label>
                  <Input id={`strength-${med.id}`} defaultValue={med.strength} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dosage-${med.id}`}>Dosage</Label>
                  <Input id={`dosage-${med.id}`} defaultValue={med.dosage} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`frequency-${med.id}`}>Frequency</Label>
                  <Input id={`frequency-${med.id}`} defaultValue={med.frequency} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`duration-${med.id}`}>Duration</Label>
                  <Input id={`duration-${med.id}`} defaultValue={med.duration} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`instructions-${med.id}`}>Instructions</Label>
                  <Input id={`instructions-${med.id}`} defaultValue={med.instructions} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12">
        <Button variant="outline" size="lg" onClick={() => router.push('/dashboard/scanner')}>
          Cancel
        </Button>
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirm} disabled={isConfirming || medications.length === 0}>
          <CheckCircle2 className="mr-2 h-5 w-5" />
          {isConfirming ? 'Saving Schedule...' : 'Confirm & Create Schedule'}
        </Button>
      </div>
    </div>
  )
}
