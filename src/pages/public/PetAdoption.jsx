import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const PetAdoption = () => {
  const pets = [
    { id: 1, name: 'Luna', species: 'Cat', breed: 'Persian', age: '2 Months', price: '₹12,000', image: '/adopt-cat.png' },
    { id: 2, name: 'Max', species: 'Dog', breed: 'Golden Retriever', age: '3 Months', price: '₹25,000', image: '/adopt-dog.png' },
    { id: 3, name: 'Bella', species: 'Dog', breed: 'Labrador', age: '4 Months', price: '₹18,000', image: '/adopt-dog.png' },
    { id: 4, name: 'Oreo', species: 'Cat', breed: 'Scottish Fold', age: '1.5 Months', price: '₹22,000', image: '/adopt-cat.png' },
    { id: 5, name: 'Thumper', species: 'Bunny', breed: 'Holland Lop', age: '2 Months', price: '₹4,500', image: '/adopt-bunny.png' },
    { id: 6, name: 'Charlie', species: 'Dog', breed: 'Beagle', age: '5 Months', price: '₹20,000', image: '/adopt-dog.png' },
    { id: 7, name: 'Simba', species: 'Cat', breed: 'Maine Coon', age: '3 Months', price: '₹30,000', image: '/adopt-cat.png' },
    { id: 8, name: 'Daisy', species: 'Dog', breed: 'Shih Tzu', age: '2.5 Months', price: '₹28,000', image: '/adopt-dog.png' },
    { id: 9, name: 'Snowball', species: 'Bunny', breed: 'Lionhead', age: '1 Month', price: '₹3,500', image: '/adopt-bunny.png' },
    { id: 10, name: 'Rocky', species: 'Dog', breed: 'German Shepherd', age: '4 Months', price: '₹24,000', image: '/adopt-dog.png' },
    { id: 11, name: 'Kiwi', species: 'Bird', breed: 'Parakeet', age: '6 Months', price: '₹1,500', image: '/adopt-bird.png' },
    { id: 12, name: 'Peanut', species: 'Hamster', breed: 'Syrian Hamster', age: '1.5 Months', price: '₹800', image: '/adopt-hamster.png' },
    { id: 13, name: 'Mango', species: 'Bird', breed: 'Cockatiel', age: '1 Year', price: '₹3,200', image: '/adopt-bird.png' },
    { id: 14, name: 'Nibbles', species: 'Hamster', breed: 'Dwarf Hamster', age: '2 Months', price: '₹600', image: '/adopt-hamster.png' }
  ];

  const handleAdopt = (petName) => {
    toast.success(`Request sent to meet ${petName}! We will contact you shortly.`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-12 rounded-b-[4rem] shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-black text-gray-900 mb-6"
            >
              Meet Your <span className="text-primary italic font-serif">Soulmate</span>
            </motion.h1>
            <p className="text-xl text-gray-600 mb-10">
              Ethically raised, healthy, and full of love. Discover our current furry friends waiting for their forever homes.
            </p>
            
            {/* Search/Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by breed or species..." 
                  className="w-full bg-background border-2 border-transparent focus:border-primary rounded-full py-4 pl-12 pr-6 outline-none transition-all font-medium"
                />
              </div>
              <button className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-transform active:scale-95 whitespace-nowrap">
                <Filter className="w-5 h-5" /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pet Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {pets.map((pet, index) => (
            <FadeIn key={pet.id} delay={(index % 4) * 0.1}>
              <div className="bg-white rounded-[2rem] p-4 shadow-md hover:shadow-2xl border border-gray-100 transition-all group h-full flex flex-col">
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-6 bg-gray-100">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors text-gray-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold">
                    {pet.species}
                  </div>
                </div>
                
                <div className="px-2 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{pet.name}</h3>
                    <span className="text-xl font-black text-secondary">{pet.price}</span>
                  </div>
                  <p className="text-gray-500 font-medium mb-1">{pet.breed}</p>
                  <p className="text-sm text-gray-400 mb-6 flex-1">{pet.age} old</p>
                  
                  <button 
                    onClick={() => handleAdopt(pet.name)}
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-3.5 rounded-xl font-bold transition-colors mt-auto"
                  >
                    Choose {pet.name}
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetAdoption;
