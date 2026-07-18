import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users } from 'lucide-react';

const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const About = () => {
  return (
    <div className="flex flex-col bg-background min-h-full">
      {/* Hero Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6"
          >
            About <span className="text-primary">PawBlissYoga</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We believe that the bond between humans and animals is sacred. Our mission is to create a harmonious space where wellness, companionship, and joy come together for you and your furry family members.
          </motion.p>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1518288774672-b94e808873ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Happy dog resting" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-8">
                <p className="text-white font-medium text-lg italic">"A community built on love, paws, and inner peace."</p>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <div className="space-y-6 text-gray-600 text-lg">
              <p>
                PawBlissYoga started with a simple idea: what if the wellness routines that bring us so much peace could be shared with our most loyal companions? 
              </p>
              <p>
                From our first experimental pet yoga class to becoming a premier destination for holistic pet wellness and ethical matchmaking, our journey has been guided by a deep love for animals. We saw firsthand how shared activities reduce stress in both pets and owners.
              </p>
              <p>
                Today, we offer a sanctuary where you can stretch, breathe, and bond. Whether you're finding a new furry soulmate or deepening your connection with your current pet through our unique Paws & Poses classes, you belong here.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do at PawBlissYoga.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Heart, title: 'Compassion First', desc: 'Every animal deserves to be treated with absolute kindness and respect. Love is at the center of our practice.' },
              { icon: Shield, title: 'Ethical Practices', desc: 'From our matchmaking partners to our studio environment, we maintain the highest standards of safety and ethics.' },
              { icon: Users, title: 'Community', desc: 'We are more than a service; we are a family of animal lovers supporting each other on our wellness journeys.' }
            ].map((value, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="bg-background rounded-2xl p-8 text-center h-full border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-primary">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
