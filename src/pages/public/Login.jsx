import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Phone, KeyRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Strict Login Check
    if (phone !== '9999999999') {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const isRegistered = existingUsers.find(u => u.phone === phone);
      if (!isRegistered) {
        toast.error('Phone number not registered. Please create an account first.');
        navigate('/register');
        return;
      }
    }

    setLoading(true);
    try {
      const generatedOtp = await sendOtp(phone);
      // Custom swipeable toast for the OTP
      toast.custom((t) => (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(e, { offset }) => {
            if (offset.x > 80 || offset.x < -80) {
              toast.dismiss(t.id);
            }
          }}
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-gray-100 p-4 cursor-grab active:cursor-grabbing`}
        >
          <div className="flex items-center gap-4 w-full">
            <div className="flex-shrink-0 text-3xl bg-green-50 p-2 rounded-xl">💬</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">Message Received</p>
              <p className="text-sm text-gray-500 truncate">Your OTP is <span className="font-bold text-primary">{generatedOtp}</span></p>
            </div>
            <p className="text-xs text-gray-400">now</p>
          </div>
        </motion.div>
      ), { duration: 30000 });
      
      setStep(2);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const { user } = await verifyOtp(phone, otp);
      toast.success('Logged in successfully!');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-premium border border-gray-100/50">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="PawBlissYoga" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h2 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">
            {step === 1 ? 'Enter your phone number to sign in' : `Enter the 6-digit code sent to +91 ${phone}`}
          </p>
        </div>
        
        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-gray-500 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="pl-[4.5rem] w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg tracking-wide"
                  placeholder="99999 99999"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl shadow-premium text-base font-bold text-white bg-gray-900 hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Code...' : 'Send OTP'} <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
                Register now
              </Link>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">6-Digit Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="pl-12 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-2xl tracking-[0.5em] text-center font-bold"
                  placeholder="••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-premium text-base font-bold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="text-center pt-2">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
