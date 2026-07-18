import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const servicesList = [
    { 
      title: 'Paws & Poses Yoga', 
      desc: 'Deepen your bond with your furry friend through guided, relaxing yoga sessions tailored for both of you. Our experienced instructors ensure a safe and calming environment.', 
      image: '/pet-yoga.png',
      buttonText: 'Book Now',
      link: '/book-yoga'
    },
    { 
      title: 'Furry Companions', 
      desc: 'Find the perfect companion to join your family. We connect you with ethically raised, healthy pets that are ready to bring joy into your home.', 
      image: '/pet-selling.png',
      buttonText: 'Choose Now',
      link: '/adopt-pet'
    }
  ];

  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-lg text-gray-600">
            Experience the joy of bonding with animals through our unique offerings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {servicesList.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
              <img src={service.image} alt={service.title} className="w-full h-64 object-cover" />
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-8 flex-1">{service.desc}</p>
                <Link to={user ? service.link : '/register'} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors w-full flex items-center justify-center gap-2 mt-auto block text-center">
                  {service.buttonText} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
