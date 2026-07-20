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

      {/* Contact Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn delay={0.1}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-lg">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 hover:-translate-y-1 transition-transform">
              <p className="font-bold text-gray-400 uppercase tracking-wider text-sm mb-2">Email Us</p>
              <p className="text-primary font-bold text-xl hover:text-primary-dark transition-colors cursor-pointer">hello@pawblissyoga.com</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 hover:-translate-y-1 transition-transform">
              <p className="font-bold text-gray-400 uppercase tracking-wider text-sm mb-2">Call Us</p>
              <p className="text-primary font-bold text-xl hover:text-primary-dark transition-colors cursor-pointer">+1 (555) 123-4567</p>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default About;
