'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Camera, FileText, Loader2, X, PenLine, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function ScannerPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Manual Form State
  const [isSavingManual, setIsSavingManual] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setErrorMsg('')
    }
  }

  const startCamera = async () => {
    setShowCamera(true)
    setErrorMsg('')
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access camera. Please ensure permissions are granted.")
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "prescription-photo.jpg", { type: "image/jpeg" })
            setFile(capturedFile)
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  const handleScan = async () => {
    if (!file) return
    setIsScanning(true)
    setErrorMsg('')
    
    try {
      const formData = new FormData()
      formData.append('prescription', file)

      const result = await api.prescriptions.scan(formData)
      
      if (result && result.ai_extracted_data) {
        // Pass to verify page. We'll store the prescriptionId too.
        sessionStorage.setItem('medtrack_extraction', JSON.stringify(result.ai_extracted_data.medications || []))
        sessionStorage.setItem('medtrack_prescription_id', result.prescriptionId)
        router.push('/dashboard/scanner/verify')
      } else {
        setErrorMsg('Failed to extract data from image.')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleManualSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSavingManual(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      strength: formData.get('dosage'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      times: [formData.get('time')], // Simple mapping for MVP
      instructions: formData.get('instructions')
    }

    try {
      await api.medications.create(data)
      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message || 'Failed to create medication')
    } finally {
      setIsSavingManual(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Add Medication</h2>
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scan">AI Prescription Scan</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <Card className="border-2 border-dashed">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Upload Prescription</CardTitle>
              <CardDescription>Upload an image or take a photo of your prescription to automatically generate your medication schedule.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
              
              {showCamera ? (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-md aspect-video flex items-center justify-center">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={stopCamera}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={capturePhoto} className="w-full max-w-xs">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                </div>
              ) : !file ? (
                <div className="flex justify-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={startCamera}
                      className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer border-0"
                    >
                      <Camera className="h-10 w-10" />
                    </button>
                    <span className="text-sm font-medium">Take Photo</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                        <Upload className="h-10 w-10" />
                      </div>
                    </Label>
                    <span className="text-sm font-medium">Upload Image</span>
                    <Input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-lg bg-muted text-muted-foreground border">
                    <FileText className="h-12 w-12 mb-2" />
                    <span className="text-xs truncate w-24 text-center">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isScanning}>
                    Remove
                  </Button>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md text-sm mt-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{errorMsg}</p>
                </div>
              )}

            </CardContent>
            <CardFooter className="flex justify-center bg-muted/50 p-6 rounded-b-lg">
              <Button 
                size="lg" 
                className="w-full max-w-sm" 
                onClick={handleScan}
                disabled={!file || isScanning || showCamera}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Extracting with Gemini AI...
                  </>
                ) : (
                  'Scan Prescription'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <form onSubmit={handleManualSave}>
              <CardHeader>
                <CardTitle>Manual Medication Entry</CardTitle>
                <CardDescription>Enter your medication details directly if the prescription is hard to read.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicine-name">Medicine Name</Label>
                  <Input id="medicine-name" placeholder="e.g. Amoxicillin" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage/Strength</Label>
                    <Input id="dosage" placeholder="e.g. 500mg, 1 tablet" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="thrice">3 times daily</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g. 7 days" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Input id="instructions" placeholder="e.g. Take after food" />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex justify-end">
                <Button type="submit" size="lg" disabled={isSavingManual}>
                  {isSavingManual ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <PenLine className="mr-2 h-4 w-4" />
                      Save Medication
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
