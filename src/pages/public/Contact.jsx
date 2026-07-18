import React from 'react';

const Contact = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Have questions or need to schedule an appointment? Get in touch with us!
        </p>
        <form className="max-w-md mx-auto text-left space-y-4">
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Name" />
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="Email" />
          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary h-32" placeholder="Message"></textarea>
          <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg transition-colors">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
