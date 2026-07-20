import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Filter, Calendar, Activity, ChevronRight, X } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import toast from 'react-hot-toast';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const PetAdoption = () => {
  const [filter, setFilter] = useState('All');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', 'Available')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPets(data);
      }
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Dogs', 'Cats'];

  // Basic client-side filtering based on breed/name as a simple heuristic
  const filteredPets = pets.filter(pet => {
    // Text search
    if (searchTerm && !pet.name.toLowerCase().includes(searchTerm.toLowerCase()) && !pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filter === 'All') return true;
    const isDog = pet.breed.toLowerCase().includes('dog') || pet.breed.toLowerCase().includes('retriever') || pet.breed.toLowerCase().includes('bulldog') || pet.breed.toLowerCase().includes('terrier');
    const isCat = pet.breed.toLowerCase().includes('cat') || pet.breed.toLowerCase().includes('shorthair') || pet.breed.toLowerCase().includes('persian') || pet.breed.toLowerCase().includes('siamese');
    
    if (filter === 'Dogs') return isDog;
    if (filter === 'Cats') return isCat;
    return true;
  });

  const handleAdopt = (petName) => {
    toast.success(`Request sent to meet ${petName}! We will contact you shortly.`);
    setSelectedPet(null);
  };

  return (
    <div className="flex flex-col bg-background min-h-screen pt-20 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24 mb-16 rounded-b-[4rem]">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[80px] pointer-events-none mix-blend-multiply"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
            >
              Meet Your <span className="text-primary italic font-serif font-medium tracking-normal">Companion</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Open your heart and home to a furry companion. Every adoption includes a complimentary wellness check.
            </motion.p>
            
            {/* Search and Filter Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col sm:flex-row max-w-2xl mx-auto"
            >
              <div className="flex-1 flex items-center px-6 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-gray-100 relative">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or breed..." 
                  className="w-full focus:outline-none text-gray-700 bg-transparent font-medium"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4">
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <div className="flex items-center px-4 py-2 gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                      filter === cat 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pet Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Available Companions ({filteredPets.length})</h2>
          <button className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
            <Filter className="w-5 h-5" /> More Filters
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-medium">Fetching available pets...</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-500">We couldn't find any pets matching your criteria right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet, index) => (
              <FadeIn key={pet.id} delay={index * 0.1}>
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-gray-100 group hover:-translate-y-2 transition-transform duration-500 flex flex-col h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img 
                      src={pet.image_url} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest shadow-sm">
                      {pet.gender}
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{pet.name}</h3>
                        <p className="text-gray-900 font-bold text-lg mb-2">{pet.price || '₹15,000'}</p>
                        <p className="text-primary font-bold text-sm tracking-wide uppercase">{pet.breed}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" /> {pet.age}
                      </span>
                      {pet.weight && (
                        <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                          <Activity className="w-4 h-4 text-gray-400" /> {pet.weight}
                        </span>
                      )}
                    </div>
                    
                    {pet.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                        {pet.description}
                      </p>
                    )}

                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => setSelectedPet(pet)}
                        className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-4 rounded-2xl font-bold transition-colors mt-auto flex items-center justify-center gap-2"
                      >
                        Choose Companion <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative hide-scrollbar"
          >
            <button 
              onClick={() => setSelectedPet(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={selectedPet.image_url} alt={selectedPet.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-gray-900 uppercase tracking-widest">
                {selectedPet.gender}
              </div>
            </div>
            
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
              <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-1">{selectedPet.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">{selectedPet.price || '₹15,000'}</p>
              <p className="text-primary font-bold text-base tracking-wide uppercase mb-6">{selectedPet.breed}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Age</p>
                  <p className="font-bold text-gray-900">{selectedPet.age}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Weight</p>
                  <p className="font-bold text-gray-900">{selectedPet.weight || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">About {selectedPet.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  {selectedPet.description}
                </p>
              </div>
              
              <button 
                onClick={() => handleAdopt(selectedPet.name)}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold transition-colors mt-auto flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              >
                Confirm Adoption Request <Heart className="w-5 h-5 fill-white" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PetAdoption;
