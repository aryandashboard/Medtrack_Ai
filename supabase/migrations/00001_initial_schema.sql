-- Drop existing tables to ensure clean slate if running multiple times
DROP TABLE IF EXISTS public.prescriptions CASCADE;
DROP TABLE IF EXISTS public.dose_logs CASCADE;
DROP TABLE IF EXISTS public.dose_schedules CASCADE;
DROP TABLE IF EXISTS public.caregiver_relationships CASCADE;
DROP TABLE IF EXISTS public.medications CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create Tables

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT CHECK (role IN ('patient', 'caregiver', 'both')) DEFAULT 'patient',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Medications Table
CREATE TABLE public.medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strength TEXT,
  dosage TEXT,
  frequency TEXT,
  instructions TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Dose Schedules Table
CREATE TABLE public.dose_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TIME NOT NULL,
  frequency TEXT
);

-- Dose Logs Table
CREATE TABLE public.dose_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'taken', 'skipped', 'missed')) DEFAULT 'pending',
  taken_at TIMESTAMP WITH TIME ZONE
);

-- Caregiver Relationships Table
CREATE TABLE public.caregiver_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'active', 'revoked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(patient_id, caregiver_id)
);

-- Prescriptions Table
CREATE TABLE public.prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  ai_extracted_data JSONB,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dose_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Security Policies

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Medications
CREATE POLICY "Patients can view own medications" ON public.medications FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert own medications" ON public.medications FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own medications" ON public.medications FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Caregivers can view assigned patients medications" ON public.medications FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_relationships 
    WHERE caregiver_id = auth.uid() AND patient_id = public.medications.patient_id AND status = 'active'
  )
);

-- Dose Schedules
CREATE POLICY "Patients can view dose schedules" ON public.dose_schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.medications WHERE id = public.dose_schedules.medication_id AND patient_id = auth.uid())
);
CREATE POLICY "Patients can insert dose schedules" ON public.dose_schedules FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.medications WHERE id = public.dose_schedules.medication_id AND patient_id = auth.uid())
);
CREATE POLICY "Patients can update dose schedules" ON public.dose_schedules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.medications WHERE id = public.dose_schedules.medication_id AND patient_id = auth.uid())
);
CREATE POLICY "Caregivers can view dose schedules" ON public.dose_schedules FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.medications m
    JOIN public.caregiver_relationships cr ON cr.patient_id = m.patient_id
    WHERE m.id = public.dose_schedules.medication_id AND cr.caregiver_id = auth.uid() AND cr.status = 'active'
  )
);

-- Dose Logs
CREATE POLICY "Patients can view own dose logs" ON public.dose_logs FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert own dose logs" ON public.dose_logs FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own dose logs" ON public.dose_logs FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Caregivers can view assigned patients dose logs" ON public.dose_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_relationships 
    WHERE caregiver_id = auth.uid() AND patient_id = public.dose_logs.patient_id AND status = 'active'
  )
);

-- Prescriptions
CREATE POLICY "Patients can view own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert own prescriptions" ON public.prescriptions FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update own prescriptions" ON public.prescriptions FOR UPDATE USING (auth.uid() = patient_id);

-- Caregiver Relationships
CREATE POLICY "Users can view their caregiver relationships" ON public.caregiver_relationships FOR SELECT USING (
  auth.uid() = patient_id OR auth.uid() = caregiver_id
);
CREATE POLICY "Patients can insert relationships" ON public.caregiver_relationships FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients can update relationships" ON public.caregiver_relationships FOR UPDATE USING (auth.uid() = patient_id);

-- Optional: If the realtime publication step fails, you can enable Realtime for dose_logs manually in the Supabase Dashboard under Database -> Replication.
-- DO NOT FAIL if the publication command errors:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'dose_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.dose_logs;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Ignore errors (publication might not exist yet)
END $$;
