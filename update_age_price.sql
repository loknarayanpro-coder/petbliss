-- Add price column to the pets table if it doesn't exist
ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS price TEXT DEFAULT '₹15,000';

-- Update all existing pets to be exactly 4 months old
UPDATE public.pets 
SET age = '4 Months';

-- Optionally, you can give some pets different prices just for variety
UPDATE public.pets SET price = '₹20,000' WHERE breed IN ('Maine Coon', 'German Shepherd');
UPDATE public.pets SET price = '₹25,000' WHERE breed IN ('Bengal', 'Husky Mix');
UPDATE public.pets SET price = '₹12,000' WHERE breed IN ('Domestic Shorthair', 'Beagle');
