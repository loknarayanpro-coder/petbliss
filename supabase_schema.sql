-- SQL Script to create the `bookings` table for PawBlissYoga
-- Run this script in the SQL Editor of your Supabase Dashboard

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    pet_name TEXT NOT NULL,
    pet_breed TEXT,
    pet_age INTEGER,
    yoga_service TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TEXT NOT NULL,
    additional_notes TEXT,
    payment_status TEXT DEFAULT 'pending'::text NOT NULL,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert bookings
CREATE POLICY "Allow public insert" ON public.bookings
    FOR INSERT
    TO public
    WITH CHECK (true);

-- (Optional) Only allow authenticated admins to view/update bookings
CREATE POLICY "Allow admins to view all" ON public.bookings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admins to update" ON public.bookings
    FOR UPDATE
    TO authenticated
    USING (true);
