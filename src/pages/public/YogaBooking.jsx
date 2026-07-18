import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const YogaBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const navigate = useNavigate();

  const dates = [
    { day: 'Mon', date: '14', full: '2026-08-14' },
    { day: 'Tue', date: '15', full: '2026-08-15' },
    { day: 'Wed', date: '16', full: '2026-08-16' },
    { day: 'Thu', date: '17', full: '2026-08-17' },
    { day: 'Fri', date: '18', full: '2026-08-18' },
  ];

  const timeSlots = [
    '07:00 AM', '09:00 AM', '11:00 AM', '03:00 PM', '05:30 PM', '07:00 PM'
  ];

  const classes = [
    { id: 'beginner', name: 'Doga for Beginners', desc: 'Gentle stretching and basic bonding exercises.', price: '₹1,500' },
    { id: 'flow', name: 'Vinyasa Flow with Paws', desc: 'Continuous movement for active dogs and owners.', price: '₹2,000' },
    { id: 'zen', name: 'Deep Zen Meditation', desc: 'Relaxing ambient sound healing and slow stretches.', price: '₹1,800' },
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedClass) {
      toast.error('Please select a class, date, and time to proceed.');
      return;
    }
    setIsBooked(true);
    toast.success('Your session is reserved!');
  };

  if (isBooked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border border-gray-100"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">You're All Set!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your Paws & Poses session is confirmed. We can't wait to see you and your furry friend on the mat!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 mb-4"
          >
            Reserve Your <span className="text-primary italic font-serif">Mat</span>
          </motion.h1>
          <p className="text-xl text-gray-600">Choose your perfect session for you and your companion.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Selection Options */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Step 1: Choose Class */}
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
                <h3 className="text-2xl font-bold text-gray-900">Select Session Type</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedClass(c.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedClass === c.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 bg-white hover:border-primary/30'}`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{c.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{c.desc}</p>
                    <p className="font-black text-primary">{c.price}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Step 2: Choose Date */}
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
                <h3 className="text-2xl font-bold text-gray-900">Select Date</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {dates.map((d) => (
                  <div 
                    key={d.full}
                    onClick={() => setSelectedDate(d.full)}
                    className={`flex flex-col items-center justify-center w-20 h-24 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedDate === d.full ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-200 bg-white text-gray-900 hover:border-primary/30'}`}
                  >
                    <span className="text-sm font-medium opacity-80">{d.day}</span>
                    <span className="text-2xl font-black">{d.date}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Step 3: Choose Time */}
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
                <h3 className="text-2xl font-bold text-gray-900">Available Times</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {timeSlots.map((time) => (
                  <div 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-xl text-center font-medium border-2 cursor-pointer transition-all ${selectedTime === time ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30'}`}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </motion.section>

          </div>

          {/* Right Column: Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 sticky top-32">
              <h3 className="text-2xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Booking Summary</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Session</p>
                    <p className="font-bold text-gray-900">
                      {selectedClass ? classes.find(c => c.id === selectedClass).name : 'Not selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="font-bold text-gray-900">{selectedDate || 'Not selected'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Time</p>
                    <p className="font-bold text-gray-900">{selectedTime || 'Not selected'}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-3xl font-black text-gray-900">
                    {selectedClass ? classes.find(c => c.id === selectedClass).price : '₹0'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-right">Taxes included</p>
              </div>

              <button 
                onClick={handleBooking}
                className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-full font-bold text-lg transition-transform active:scale-95 shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                Confirm Booking <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default YogaBooking;
