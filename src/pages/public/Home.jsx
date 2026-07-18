import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Shield, Calendar, ArrowRight, Star } from 'lucide-react';

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

const Home = () => {
  return (
    <div className="flex flex-col bg-background overflow-hidden">
      {/* Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-32">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-primary/20 blur-[120px] pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[100px] pointer-events-none mix-blend-multiply"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Massive Typography Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="lg:col-span-7 z-10"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.1] sm:leading-[0.9] tracking-tighter mb-6 sm:mb-8 mt-10 lg:mt-0 text-center lg:text-left">
                BREATHE <br/>
                <span className="text-primary italic font-serif font-medium tracking-normal">deep.</span><br/>
                WAG MORE.
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-10 max-w-xl font-medium leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                Experience an organic, premium sanctuary where wellness and pet companionship become one.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
                <Link to="/register" className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-2xl">
                  Join The Pack
                </Link>
                <Link to="/services" className="bg-white/80 backdrop-blur-md border border-white hover:bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/5">
                  Explore Wellness
                </Link>
              </div>
            </motion.div>
            
            {/* Video Blob Right */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full aspect-square blob-shape-1 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white/50 bg-gray-200 group">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  poster="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                >
                  <source src="https://cdn.pixabay.com/video/2020/05/24/40061-426188266_tiny.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent mix-blend-overlay"></div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-xl p-5 blob-shape-3 shadow-2xl border border-white/60 flex items-center gap-4"
              >
                <div className="bg-secondary text-white p-4 blob-shape-2">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <div className="pr-4">
                  <p className="font-black text-2xl text-gray-900 leading-none">Blissful</p>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Community</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Ticker */}
      <div className="w-full bg-primary py-4 overflow-hidden border-y border-primary-dark/20 flex whitespace-nowrap">
        <div className="animate-marquee flex items-center gap-6 sm:gap-12 text-white font-black text-xl sm:text-2xl md:text-3xl tracking-widest uppercase">
          <span>Paws & Poses</span> <span>•</span>
          <span>Furry Companions</span> <span>•</span>
          <span>Pet Wellness</span> <span>•</span>
          <span>Inner Peace</span> <span>•</span>
          <span>Paws & Poses</span> <span>•</span>
          <span>Furry Companions</span> <span>•</span>
          <span>Pet Wellness</span> <span>•</span>
          <span>Inner Peace</span> <span>•</span>
          <span>Paws & Poses</span> <span>•</span>
          <span>Furry Companions</span> <span>•</span>
          <span>Pet Wellness</span> <span>•</span>
          <span>Inner Peace</span> <span>•</span>
        </div>
      </div>

      {/* Organic Featured Services */}
      <section className="py-32 relative bg-white rounded-t-[4rem] -mt-8 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Curated <span className="text-secondary italic font-serif font-medium tracking-normal">Experiences</span></h2>
            <p className="text-xl text-gray-600">Immerse yourself in our premium offerings designed to elevate the bond with your companion.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto relative">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-background/50 blob-shape-2 -z-10 blur-3xl mix-blend-multiply opacity-50"></div>

            {[
              { 
                title: 'Paws & Poses Yoga', 
                desc: 'Deepen your bond with your furry friend through guided, relaxing yoga sessions tailored for both of you.', 
                image: '/pet-yoga.png',
                shape: 'blob-shape-2'
              },
              { 
                title: 'Furry Companions', 
                desc: 'Find the perfect companion to join your family. We connect you with ethically raised, healthy pets.', 
                image: '/pet-selling.png',
                shape: 'blob-shape-3'
              }
            ].map((service, index) => (
              <FadeIn key={index} delay={index * 0.2}>
                <div className="group relative">
                  {/* Organic Image Container */}
                  <div className={`relative w-full aspect-[4/3] ${service.shape} overflow-hidden shadow-2xl mb-8 bg-gray-100`}>
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed font-medium">{service.desc}</p>
                  <Link to="/services" className="inline-flex items-center gap-2 text-primary font-bold text-lg hover:gap-4 transition-all">
                    Discover More <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Unique Testimonials */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--color-marshmallow)_0%,_transparent_60%)] opacity-50 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Whispers <span className="text-primary italic font-serif font-medium tracking-normal">of Joy</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah J.', role: 'Yoga Enthusiast', quote: 'The most calming experience for me and my golden retriever. Truly magical.', offset: 'md:mt-0' },
              { name: 'Michael T.', role: 'New Pet Parent', quote: 'Found my beautiful kitten through their matchmaking. The community here is incredible.', offset: 'md:mt-16' },
              { name: 'Emma W.', role: 'Studio Regular', quote: 'PawBlissYoga is my sanctuary. The environment and the people are purely wonderful.', offset: 'md:mt-8' }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className={`bg-white p-10 rounded-[2.5rem] rounded-tr-sm shadow-xl border border-white/50 hover:-translate-y-2 transition-transform duration-500 ${item.offset}`}>
                  <div className="flex text-secondary mb-8 gap-1">
                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-6 h-6 fill-current" />)}
                  </div>
                  <p className="text-gray-900 text-xl font-medium leading-relaxed mb-10">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 blob-shape-1 bg-gray-200"></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-sm font-bold text-primary uppercase tracking-wider">{item.role}</p>
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
