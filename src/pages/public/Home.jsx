import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Shield, Calendar, ArrowRight, Star, Tag, X } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../context/AuthContext';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  
  // Cute scroll reaction animations for the hero dog
  const dogRotate = useTransform(scrollYProgress, [0, 0.2], [0, 8]);
  const dogScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const dogY = useTransform(scrollYProgress, [0, 0.2], [0, 40]);

  const [activeOffers, setActiveOffers] = React.useState([]);
  const [dismissedOffers, setDismissedOffers] = React.useState([]);

  React.useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('offers')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setActiveOffers(data);
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err);
      }
    };
    fetchOffers();
  }, []);

  const dismissOffer = (id) => {
    setDismissedOffers([...dismissedOffers, id]);
  };

  return (
    <div className="flex flex-col bg-background overflow-hidden">
      
      {/* Dynamic Offers Banner */}
      {activeOffers.filter(offer => !dismissedOffers.includes(offer.id)).map((offer) => (
        <motion.div 
          key={offer.id}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-primary text-white py-3 px-4 relative z-50 flex items-center justify-center text-center shadow-md"
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto pr-8">
            <Tag className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm sm:text-base">
              <span className="font-bold mr-2">{offer.title}</span>
              {offer.description && <span className="opacity-90">{offer.description}</span>}
              {offer.discount_code && (
                <span className="ml-3 inline-block bg-white/20 px-2 py-0.5 rounded text-white font-mono font-bold tracking-wider text-xs">
                  Code: {offer.discount_code}
                </span>
              )}
            </p>
          </div>
          <button 
            onClick={() => dismissOffer(offer.id)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}

      {/* Clean Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center pt-8 md:pt-20 pb-16 md:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Massive Typography Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-7 z-10"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1] sm:leading-[1.1] tracking-tight mb-6 sm:mb-8 mt-2 lg:mt-0 text-center lg:text-left">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-block"
                >
                  <motion.span
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    Breathe Deep.
                  </motion.span>
                </motion.span>
                <br/>
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-primary inline-block origin-bottom-left"
                >
                  <motion.span
                    animate={{ rotate: [0, 4, -2, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1 }}
                    className="inline-block"
                  >
                    Wag More.
                  </motion.span>
                </motion.span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 max-w-xl font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                Experience an organic, premium sanctuary where wellness and furry companions become one.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                {!user && (
                  <Link to="/register" className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-2xl">
                    Join The Pack
                  </Link>
                )}
                <Link to="/services" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 flex items-center gap-2">
                  Explore Wellness <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
            
            {/* Clean Media Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              style={{ rotate: dogRotate, scale: dogScale, y: dogY }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-premium bg-gray-100">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  poster="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  className="w-full h-full object-cover"
                >
                  <source src="https://cdn.pixabay.com/video/2020/05/24/40061-426188266_tiny.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Clean Featured Services */}
      <section className="py-20 md:py-32 bg-gray-50 border-t border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Curated Experiences</h2>
            <p className="text-lg md:text-xl text-gray-600">Immerse yourself in our premium offerings designed to elevate the bond with your furry companions.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 md:px-0 pb-8">

            {[
              { 
                title: 'Paws & Poses Yoga', 
                desc: 'Deepen your bond with your furry friend through guided, relaxing yoga sessions tailored for both of you.', 
                image: '/pet-yoga.png',
                link: '/book-yoga'
              },
              { 
                title: 'Furry Companions', 
                desc: 'Find the perfect companion to join your family. We connect you with ethically raised, healthy pets.', 
                image: '/pet-selling.png',
                link: '/adopt-pet'
              }
            ].map((service, index) => (
              <FadeIn key={index} delay={index * 0.3}>
                <div className="group relative bg-white rounded-[2rem] p-4 shadow-premium border border-gray-100/50 flex flex-col h-full transition-shadow duration-700 hover:shadow-2xl">
                  <Link to={service.link} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100 block cursor-pointer">
                    <motion.div
                      animate={{ scale: [1, 1.03, 1], rotate: [0, 1, -1, 0] }}
                      transition={{ duration: 7 + index * 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
                    </motion.div>
                  </Link>
                  
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-base text-gray-600 mb-6 flex-grow">{service.desc}</p>
                  <Link to={service.link} className="inline-flex items-center gap-2 text-primary font-semibold text-base mt-auto">
                    Discover More <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Testimonials */}
      <section className="py-20 md:py-32 bg-white border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16 px-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">Whispers of Joy</h2>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 md:grid md:grid-cols-3 md:gap-8 px-4 md:px-0 pb-8">
            {[
              { name: 'Sarah J.', role: 'Yoga Enthusiast', quote: 'The most calming experience for me and my golden retriever. Truly magical.', offset: 'md:mt-0' },
              { name: 'Michael T.', role: 'New Pet Parent', quote: 'Found my beautiful kitten through their matchmaking. The community here is incredible.', offset: 'md:mt-16' },
              { name: 'Emma W.', role: 'Studio Regular', quote: 'PawBlissYoga is my sanctuary. The environment and the people are purely wonderful.', offset: 'md:mt-8' }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.2}>
                <div className={`bg-white p-8 md:p-10 rounded-[2rem] shadow-premium border border-gray-100/50 min-w-[85vw] snap-center md:min-w-0 md:w-auto shrink-0 h-full flex flex-col`}>
                  <p className="text-gray-700 text-lg md:text-xl font-serif italic leading-relaxed mb-8 flex-grow">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base">{item.name}</h4>
                      <p className="text-xs font-medium text-gray-500">{item.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
