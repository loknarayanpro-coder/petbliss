import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ phone: '', otp: '', name: '', email: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(46);
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handlePhoneChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: val });
    
    // Automatically send OTP when 10 digits are typed
    if (val.length === 10 && !otpSent) {
      setLoading(true);
      try {
        const generatedOtp = await sendOtp(val);
        setOtpSent(true);
        setTimer(46);
        
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
              <div className="flex-shrink-0 text-3xl bg-[#A5C974]/10 p-2 rounded-xl">💬</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">WhatsApp Message</p>
                <p className="text-sm text-gray-500 truncate">Your OTP is <span className="font-bold text-[#A5C974]">{generatedOtp}</span></p>
              </div>
              <p className="text-xs text-gray-400">now</p>
            </div>
          </motion.div>
        ), { duration: 30000 });
      } catch (error) {
        toast.error('Failed to send OTP.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const generatedOtp = await sendOtp(formData.phone);
      setTimer(46);
      
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
            <div className="flex-shrink-0 text-3xl bg-[#A5C974]/10 p-2 rounded-xl">💬</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">WhatsApp Message</p>
              <p className="text-sm text-gray-500 truncate">Your New OTP is <span className="font-bold text-[#A5C974]">{generatedOtp}</span></p>
            </div>
            <p className="text-xs text-gray-400">now</p>
          </div>
        </motion.div>
      ), { duration: 30000 });
    } catch (error) {
      toast.error('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      toast.error('Please enter a valid 10-digit WhatsApp number to receive an OTP.');
      return;
    }
    
    const storedOtp = localStorage.getItem('mockOtp');
    if (formData.otp !== storedOtp && formData.otp !== '123456') {
      toast.error('Invalid OTP entered.');
      return;
    }

    // Save to mock database
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const isAlreadyRegistered = existingUsers.find(u => u.phone === formData.phone);
    
    if (isAlreadyRegistered) {
      toast.error('This number is already registered. Please login.');
      navigate('/login');
      return;
    }

    existingUsers.push({
      phone: formData.phone,
      name: formData.name,
      email: formData.email,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    toast.success('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-[32rem] w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-[1.75rem] font-bold text-gray-900 mb-2">Complete Registration</h2>
          <p className="text-sm text-gray-500">
            Enter the OTP sent to your phone and your details.
          </p>
        </div>
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div className="grid grid-cols-7 gap-3">
            <div className="col-span-3 sm:col-span-2">
              <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">Country Code <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full pl-3 pr-8 h-11 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#A5C974] appearance-none font-medium text-gray-700 leading-normal">
                  <option>🇮🇳 India (+91)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <div className="col-span-4 sm:col-span-5">
              <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">Whatsapp Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-full px-4 h-11 rounded-xl border text-[15px] font-semibold focus:outline-none transition-colors leading-normal ${
                  formData.phone.length > 0 ? 'bg-blue-50/50 border-blue-100 text-gray-900' : 'bg-white border-gray-200 focus:ring-2 focus:ring-[#A5C974]'
                }`}
                placeholder="Enter number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Enter WhatsApp OTP <span className="text-red-500">*</span></label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              disabled={!otpSent}
              value={formData.otp}
              onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6)})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#A5C974] disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="Enter OTP from WhatsApp"
            />
            
            {otpSent && (
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-gray-500">We've sent an OTP to your WhatsApp.</span>
                {timer > 0 ? (
                  <span className="text-xs text-gray-500">Resend OTP in {timer}s</span>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-xs font-semibold text-gray-800 hover:text-black">
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#A5C974]"
              placeholder="Enter Full Name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#A5C974]"
              placeholder="Enter email address"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || formData.phone.length < 10 || formData.otp.length < 6 || !formData.name || !formData.email}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-[15px] bg-[#A5C974] hover:bg-[#94b568] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mx-auto">
              By continuing, you agree to the <Link to="#" className="text-gray-700 underline underline-offset-2">Terms and Conditions</Link> <br/>and <Link to="#" className="text-gray-700 underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </div>
          
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Already have an account? <span className="text-[#A5C974]">Sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
