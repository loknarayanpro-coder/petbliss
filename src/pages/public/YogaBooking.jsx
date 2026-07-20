import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, ArrowRight, CheckCircle2, Loader2, User, PawPrint, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { bookingService } from '../../services/booking.service';

// Form validation schema using Zod
const bookingSchema = z.object({
  yogaService: z.string().min(1, 'Please select a session type'),
  bookingDate: z.string().min(1, 'Please select a date'),
  bookingTime: z.string().min(1, 'Please select a time'),
  ownerName: z.string().min(2, 'Owner name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  petName: z.string().min(2, 'Pet name must be at least 2 characters'),
  petBreed: z.string().optional(),
  petAge: z.string().min(1, 'Pet age is required'),
  additionalNotes: z.string().optional(),
});

const YogaBooking = () => {
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMockPayment, setShowMockPayment] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      yogaService: '',
      bookingDate: '',
      bookingTime: '',
      ownerName: '',
      email: '',
      phone: '',
      petName: '',
      petBreed: '',
      petAge: '',
      additionalNotes: '',
    }
  });

  const selectedClass = watch('yogaService');
  const selectedDate = watch('bookingDate');
  const selectedTime = watch('bookingTime');

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
    { id: 'beginner', name: 'Doga for Beginners', desc: 'Gentle stretching and basic bonding exercises.', price: '₹1,500', numericPrice: 1500 },
    { id: 'flow', name: 'Vinyasa Flow with Paws', desc: 'Continuous movement for active dogs and owners.', price: '₹2,000', numericPrice: 2000 },
    { id: 'zen', name: 'Deep Zen Meditation', desc: 'Relaxing ambient sound healing and slow stretches.', price: '₹1,800', numericPrice: 1800 },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // 1. Save pending booking to Supabase
    const bookingResponse = await bookingService.createBooking(data);
    
    if (!bookingResponse.success) {
      toast.error(bookingResponse.error?.message || 'Failed to save booking. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const bookingId = bookingResponse.data.id;
    const selectedClassObj = classes.find(c => c.id === data.yogaService);
    const amount = selectedClassObj.numericPrice;

    // 2. Initiate Razorpay Order
    const orderResponse = await bookingService.initiatePayment(bookingId, amount);
    
    if (!orderResponse.success) {
      toast.error('Failed to initiate payment. Please try again later.');
      setIsSubmitting(false);
      return;
    }

    const orderData = orderResponse.data;

    // 3. Open Razorpay Checkout Modal
    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key';

    if (rzpKey === 'dummy_razorpay_key_here' || rzpKey === 'dummy_key') {
      setMockOrderDetails({
        orderId: orderData.orderId,
        bookingId: bookingId,
        amount: orderData.amount / 100,
        className: selectedClassObj.name
      });
      setShowMockPayment(true);
      return;
    }

    const options = {
      key: rzpKey,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'PawBlissYoga',
      description: `Payment for ${selectedClassObj.name}`,
      order_id: orderData.orderId,
      handler: async function (response) {
        // 4. Verify Payment Signature
        toast.loading('Verifying payment...', { id: 'payment-verify' });
        
        const verifyResponse = await bookingService.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }, bookingId);

        if (verifyResponse.success) {
          toast.success('Payment successful!', { id: 'payment-verify' });
          setIsBooked(true);
        } else {
          toast.error('Payment verification failed.', { id: 'payment-verify' });
        }
        setIsSubmitting(false);
      },
      prefill: {
        name: data.ownerName,
        email: data.email,
        contact: data.phone
      },
      theme: {
        color: '#6366f1' // Using primary color hex
      },
      modal: {
        ondismiss: function() {
          setIsSubmitting(false);
          toast.error('Payment cancelled');
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response){
      toast.error(response.error.description);
      setIsSubmitting(false);
    });
    rzp1.open();
  };

  // Helper to show field errors
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <p className="text-red-500 text-sm mt-1">{error.message}</p>;
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                    onClick={() => setValue('yogaService', c.id, { shouldValidate: true })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedClass === c.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 bg-white hover:border-primary/30'}`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{c.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{c.desc}</p>
                    <p className="font-black text-primary">{c.price}</p>
                  </div>
                ))}
              </div>
              <ErrorMessage error={errors.yogaService} />
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
                    onClick={() => setValue('bookingDate', d.full, { shouldValidate: true })}
                    className={`flex flex-col items-center justify-center w-20 h-24 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedDate === d.full ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-200 bg-white text-gray-900 hover:border-primary/30'}`}
                  >
                    <span className="text-sm font-medium opacity-80">{d.day}</span>
                    <span className="text-2xl font-black">{d.date}</span>
                  </div>
                ))}
              </div>
              <ErrorMessage error={errors.bookingDate} />
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
                    onClick={() => setValue('bookingTime', time, { shouldValidate: true })}
                    className={`py-3 px-4 rounded-xl text-center font-medium border-2 cursor-pointer transition-all ${selectedTime === time ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 bg-white text-gray-700 hover:border-primary/30'}`}
                  >
                    {time}
                  </div>
                ))}
              </div>
              <ErrorMessage error={errors.bookingTime} />
            </motion.section>

            {/* Step 4: Your Details */}
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
                <h3 className="text-2xl font-bold text-gray-900">Your Details</h3>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                
                {/* Owner Section */}
                <div>
                  <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    <User className="w-5 h-5 text-primary" /> Human Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        {...register('ownerName')}
                        className={`w-full p-3 rounded-xl border ${errors.ownerName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                        placeholder="John Doe"
                      />
                      <ErrorMessage error={errors.ownerName} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        {...register('phone')}
                        className={`w-full p-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                        placeholder="9876543210"
                      />
                      <ErrorMessage error={errors.phone} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        {...register('email')}
                        className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                        placeholder="john@example.com"
                      />
                      <ErrorMessage error={errors.email} />
                    </div>
                  </div>
                </div>

                {/* Pet Section */}
                <div className="pt-4">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                    <PawPrint className="w-5 h-5 text-primary" /> Pet Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name *</label>
                      <input 
                        type="text" 
                        {...register('petName')}
                        className={`w-full p-3 rounded-xl border ${errors.petName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                        placeholder="Max"
                      />
                      <ErrorMessage error={errors.petName} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pet Breed</label>
                      <input 
                        type="text" 
                        {...register('petBreed')}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="Golden Retriever"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age (Years) *</label>
                      <input 
                        type="number" 
                        {...register('petAge')}
                        className={`w-full p-3 rounded-xl border ${errors.petAge ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary`}
                        placeholder="2"
                        min="0"
                      />
                      <ErrorMessage error={errors.petAge} />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea 
                    {...register('additionalNotes')}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none"
                    placeholder="Any special requirements, allergies, or behavioral traits we should know about?"
                  />
                </div>

              </div>
            </motion.section>

          </div>

          {/* Right Column: Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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
                      {selectedClass ? classes.find(c => c.id === selectedClass)?.name : 'Not selected'}
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
                    {selectedClass ? classes.find(c => c.id === selectedClass)?.price : '₹0'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-right">Taxes included</p>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold text-lg transition-transform active:scale-95 shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </div>

      {/* Custom Mock Payment Modal */}
      {showMockPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
          >
            <div className="bg-gray-900 text-white p-6 relative">
              <button 
                onClick={() => {
                  setShowMockPayment(false);
                  setIsSubmitting(false);
                  toast.error('Payment cancelled');
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/10 p-2 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Secure Checkout</h3>
              </div>
              <p className="text-gray-400 text-sm">{mockOrderDetails?.className}</p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Total Amount</span>
                <span className="text-3xl font-black text-gray-900">₹{mockOrderDetails?.amount}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Number</label>
                  <input type="text" defaultValue="6527 6589 0000 1005" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry</label>
                    <input type="text" defaultValue="12/28" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV</label>
                    <input type="password" defaultValue="123" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              <button 
                onClick={async () => {
                  setShowMockPayment(false);
                  toast.loading('Processing payment...', { id: 'payment-verify' });
                  
                  const verifyResponse = await bookingService.verifyPayment({
                    razorpay_order_id: mockOrderDetails.orderId,
                    razorpay_payment_id: 'pay_mock_' + Date.now(),
                    razorpay_signature: 'mock_signature'
                  }, mockOrderDetails.bookingId);
          
                  if (verifyResponse.success) {
                    toast.success('Payment successful!', { id: 'payment-verify' });
                    setIsBooked(true);
                  } else {
                    toast.error('Payment verification failed.', { id: 'payment-verify' });
                  }
                  setIsSubmitting(false);
                }}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-blue-600/30"
              >
                Pay ₹{mockOrderDetails?.amount}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default YogaBooking;
