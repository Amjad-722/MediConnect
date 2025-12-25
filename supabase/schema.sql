-- MediConnect Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Extends Supabase Auth users with application-specific profile data
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('patient', 'doctor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- DOCTOR PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    specialty TEXT,
    bio TEXT,
    education TEXT,
    experience TEXT,
    languages TEXT[], -- Array of languages
    clinic_address TEXT,
    clinic_map_url TEXT,
    profile_pic TEXT,
    banner_image TEXT,
    about TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE doctor_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view doctor profiles
CREATE POLICY "Anyone can view doctor profiles"
    ON doctor_profiles FOR SELECT
    TO authenticated
    USING (true);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile"
    ON doctor_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Doctors can insert their own profile
CREATE POLICY "Doctors can insert own profile"
    ON doctor_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- DOCTOR AVAILABILITY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS doctor_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    day TEXT NOT NULL CHECK (day IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can view doctor availability
CREATE POLICY "Anyone can view doctor availability"
    ON doctor_availability FOR SELECT
    TO authenticated
    USING (true);

-- Doctors can manage their own availability
CREATE POLICY "Doctors can manage own availability"
    ON doctor_availability FOR ALL
    USING (auth.uid() = doctor_id);

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    day TEXT,
    type TEXT DEFAULT 'In-Person',
    reason TEXT DEFAULT 'General Consultation',
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own appointments
CREATE POLICY "Patients can view own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = patient_id);

-- Doctors can view appointments where they are the doctor
CREATE POLICY "Doctors can view their appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = doctor_id);

-- Patients can create appointments
CREATE POLICY "Patients can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own appointments
CREATE POLICY "Patients can update own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = patient_id);

-- Doctors can update appointments where they are the doctor
CREATE POLICY "Doctors can update their appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = doctor_id);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their appointments
CREATE POLICY "Users can view messages for their appointments"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM appointments
            WHERE appointments.id = messages.appointment_id
            AND (appointments.patient_id = auth.uid() OR appointments.doctor_id = auth.uid())
        )
    );

-- Users can send messages for their appointments
CREATE POLICY "Users can send messages for their appointments"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM appointments
            WHERE appointments.id = appointment_id
            AND (appointments.patient_id = auth.uid() OR appointments.doctor_id = auth.uid())
        )
    );

-- Users can update read status for messages in their appointments
CREATE POLICY "Users can update messages for their appointments"
    ON messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM appointments
            WHERE appointments.id = messages.appointment_id
            AND (appointments.patient_id = auth.uid() OR appointments.doctor_id = auth.uid())
        )
    );

-- ============================================================================
-- PRESCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    medications JSONB NOT NULL, -- Array of {name, dosage, instructions}
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Ordered', 'Completed', 'Expired')),
    notes TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Patients can view their own prescriptions
CREATE POLICY "Patients can view own prescriptions"
    ON prescriptions FOR SELECT
    USING (auth.uid() = patient_id);

-- Doctors can view prescriptions they issued
CREATE POLICY "Doctors can view their prescriptions"
    ON prescriptions FOR SELECT
    USING (auth.uid() = doctor_id);

-- Doctors can issue prescriptions
CREATE POLICY "Doctors can issue prescriptions"
    ON prescriptions FOR INSERT
    WITH CHECK (auth.uid() = doctor_id);

-- Doctors can update prescriptions they issued
CREATE POLICY "Doctors can update their prescriptions"
    ON prescriptions FOR UPDATE
    USING (auth.uid() = doctor_id);

-- Patients can update prescription status (e.g., mark as ordered)
CREATE POLICY "Patients can update prescription status"
    ON prescriptions FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    patient_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    TO authenticated
    USING (true);

-- Patients can create reviews
CREATE POLICY "Patients can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at
    BEFORE UPDATE ON doctor_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_messages_appointment_id ON messages(appointment_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON reviews(doctor_id);
