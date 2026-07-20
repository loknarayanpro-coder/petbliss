UPDATE public.pets 
SET image_url = '/premium-dog.png' 
WHERE breed IN ('Beagle', 'German Shepherd');

UPDATE public.pets 
SET image_url = '/adopt-dog.png' 
WHERE breed IN ('Poodle', 'Corgi', 'Husky Mix');

UPDATE public.pets 
SET image_url = '/premium-cat.png' 
WHERE breed IN ('Maine Coon', 'Persian Cat', 'Siamese');

UPDATE public.pets 
SET image_url = '/adopt-cat.png' 
WHERE breed IN ('Bengal', 'British Shorthair');
