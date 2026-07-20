CREATE TABLE public.pets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    gender TEXT NOT NULL,
    weight TEXT,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'Available' NOT NULL, -- 'Available', 'Pending', 'Adopted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Public can view available pets
CREATE POLICY "Allow public select pets" ON public.pets
    FOR SELECT
    TO public
    USING (true);

-- Authenticated admins can manage pets (using the simple authenticated policy for MVP)
CREATE POLICY "Allow authenticated full access to pets" ON public.pets
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert some dummy data so the public page isn't empty immediately
INSERT INTO public.pets (name, breed, age, gender, weight, description, image_url, status)
VALUES 
('Luna', 'Golden Retriever Mix', '2 Years', 'Female', '45 lbs', 'Sweet, energetic, and loves yoga mats! Great with kids and other dogs.', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80', 'Available'),
('Milo', 'Domestic Shorthair', '6 Months', 'Male', '6 lbs', 'Playful kitten who purrs loudly during meditation sessions.', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80', 'Available'),
('Bella', 'French Bulldog', '3 Years', 'Female', '22 lbs', 'A total couch potato who just wants to cuddle and occasionally stretch.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80', 'Available');
