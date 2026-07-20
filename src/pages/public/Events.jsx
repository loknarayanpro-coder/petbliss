import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -30, scale: 0.95 }}
    whileInView={{ opacity: 1, x: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Events = () => {
  const eventsList = [
    {
      id: 1,
      title: 'Sunrise Pet Yoga',
      date: 'Aug 15, 2026',
      time: '07:00 AM - 08:30 AM',
      location: 'Central Park Meadow',
      price: '$20',
      description: 'Start your morning with a peaceful flow alongside your furry friend. Perfect for all skill levels.',
      image: '/pet-yoga.png',
    },
    {
      id: 2,
      title: 'Doga for Beginners',
      date: 'Aug 22, 2026',
      time: '10:00 AM - 11:30 AM',
      location: 'PawBlissYoga Studio',
      price: '$25',
      description: 'An introductory class focusing on gentle stretches and bonding exercises with your pet.',
      image: '/pet-yoga.png',
    },
    {
      id: 3,
      title: 'Advanced Paws & Poses',
      date: 'Sep 05, 2026',
      time: '5:00 PM - 6:30 PM',
      location: 'Sunset Beach',
      price: '$30',
      description: 'A challenging, dynamic yoga session designed for active dogs and experienced yogis.',
      image: '/pet-yoga.png',
    }
  ];

  const handleRegister = () => {
    toast.success('Successfully registered for the event!');
  };

  return (
    <div className="bg-background py-20 min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">Upcoming <span className="text-primary">Yoga Events</span></h1>
          <p className="text-lg text-gray-600">Join our serene community gatherings and deepen the bond with your pet through yoga.</p>
        </motion.div>

        <div className="space-y-8">
          {eventsList.map((event, index) => (
            <FadeIn key={event.id} delay={index * 0.15}>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all flex flex-col md:flex-row group"
              >
                {/* Image Section - Landscape */}
                <div className="relative w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] }}
                    transition={{ duration: 7 + index * 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" 
                    />
                  </motion.div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                        <Calendar className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm bg-gray-50 p-3 rounded-xl">
                        <Clock className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm bg-gray-50 p-3 rounded-xl sm:col-span-2">
                        <MapPin className="w-5 h-5 mr-3 text-primary" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleRegister}
                      className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-primary/30 transform active:scale-95"
                    >
                      Reserve Your Spot
                    </button>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
