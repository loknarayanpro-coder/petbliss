CREATE TABLE public.offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    discount_code TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Public can view active offers
CREATE POLICY "Allow public select active offers" ON public.offers
    FOR SELECT
    TO public
    USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Allow admin full access to offers" ON public.offers
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Note: Since this is an MVP without proper Supabase Auth roles set up yet,
-- and the admin dashboard relies on custom context, we will also allow all authenticated users
-- for the MVP phase, or you can use the Service Role key to manage these from a backend if preferred.
-- For true simplicity in this Vite app, we'll open management to any authenticated user (you can restrict later).
DROP POLICY IF EXISTS "Allow admin full access to offers" ON public.offers;
CREATE POLICY "Allow authenticated full access" ON public.offers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
