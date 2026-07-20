import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local
const envFile = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const pets = [
  {
    name: 'Bailey',
    breed: 'Beagle',
    age: '2 Years',
    gender: 'Male',
    weight: '25 lbs',
    description: 'A curious and gentle beagle who loves sniffing around the yard and cuddling on the sofa.',
    image_url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Oliver',
    breed: 'Maine Coon',
    age: '3 Years',
    gender: 'Male',
    weight: '15 lbs',
    description: 'A majestic fluffball who enjoys napping in sunbeams and watching birds from the window.',
    image_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Daisy',
    breed: 'Poodle',
    age: '1 Year',
    gender: 'Female',
    weight: '12 lbs',
    description: 'Smart, energetic, and highly trainable. Daisy loves performing tricks for treats.',
    image_url: 'https://images.unsplash.com/photo-1589952283406-b53a7d1347e8?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Leo',
    breed: 'Bengal',
    age: '4 Years',
    gender: 'Male',
    weight: '10 lbs',
    description: 'An exotic-looking cat with endless energy. Leo loves climbing and interactive toys.',
    image_url: 'https://images.unsplash.com/photo-1606214174585-fd312384f59c?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Max',
    breed: 'German Shepherd',
    age: '5 Years',
    gender: 'Male',
    weight: '75 lbs',
    description: 'Loyal, protective, and a big softie at heart. Max is the ultimate family companion.',
    image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ce11ff?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Chloe',
    breed: 'Persian Cat',
    age: '2 Years',
    gender: 'Female',
    weight: '9 lbs',
    description: 'Quiet, affectionate, and perfectly happy spending her days lounging in laps.',
    image_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Charlie',
    breed: 'Corgi',
    age: '1.5 Years',
    gender: 'Male',
    weight: '28 lbs',
    description: 'A spunky little guy with a huge personality and an adorable waddle.',
    image_url: 'https://images.unsplash.com/photo-1615056700511-b541315e13d9?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Nala',
    breed: 'Siamese',
    age: '6 Months',
    gender: 'Female',
    weight: '5 lbs',
    description: 'Vocal, playful, and very bonded to her humans. Nala loves to have "conversations".',
    image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Rocky',
    breed: 'Husky Mix',
    age: '3 Years',
    gender: 'Male',
    weight: '55 lbs',
    description: 'Ready for adventure! Rocky needs an active family who loves hiking and the outdoors.',
    image_url: 'https://images.unsplash.com/photo-1605568420125-4596b6534960?auto=format&fit=crop&q=80',
    status: 'Available'
  },
  {
    name: 'Zoe',
    breed: 'British Shorthair',
    age: '2 Years',
    gender: 'Female',
    weight: '11 lbs',
    description: 'A distinguished, calm lady who enjoys being near you but isn\'t overly demanding.',
    image_url: 'https://images.unsplash.com/photo-1501820488136-72669149e0d4?auto=format&fit=crop&q=80',
    status: 'Available'
  }
];

async function run() {
  const { data, error } = await supabase.from('pets').insert(pets).select();
  if (error) {
    console.error('Error inserting pets:', error);
  } else {
    console.log(`Successfully inserted ${data.length} pets.`);
  }
}

run();
