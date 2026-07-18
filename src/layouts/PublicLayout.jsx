import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Interactive Cursor Component
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e) => {
      if (['A', 'BUTTON', 'IMG'].includes(e.target.tagName) || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? '#F6CA3D' : '#FC9008'
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    />
  );
};

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-white">
      <CustomCursor />
      
      {/* Floating Pill Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-primary/5 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl transition-all">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
              <img src="/logo.png" alt="PawBlissYoga" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">PawBlissYoga</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-gray-900 hover:bg-white/50 px-4 py-2 rounded-full font-semibold transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            {user ? (
              <>
                <Link
                  to={role === 'admin' ? '/admin' : '/dashboard'}
                  className="text-gray-700 hover:bg-white/50 px-4 py-2 rounded-full font-semibold transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:bg-white/50 px-4 py-2 rounded-full font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-primary/30"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 bg-white/50 p-2 rounded-full hover:bg-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-4 right-4 z-40 bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 md:hidden"
          >
            <div className="flex flex-col space-y-4 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-4" />
              {user ? (
                <>
                  <Link
                    to={role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="bg-gray-900 text-white py-3 rounded-2xl font-bold text-lg mt-4"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-bold text-gray-800 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary text-white py-3 rounded-2xl font-bold text-lg mt-4"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] relative z-10">
        <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="PawBlissYoga" className="w-12 h-12 object-contain" />
                <span className="font-extrabold text-2xl text-gray-900">PawBlissYoga</span>
              </Link>
              <p className="text-gray-500 text-base leading-relaxed">
                Breathe Deep. Wag More. The ultimate destination for premium pet wellness and community.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 tracking-widest uppercase mb-6">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-500 hover:text-primary font-medium transition-colors">About Us</Link></li>
                <li><Link to="/services" className="text-gray-500 hover:text-primary font-medium transition-colors">Services</Link></li>
                <li><Link to="/events" className="text-gray-500 hover:text-primary font-medium transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 tracking-widest uppercase mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-500 hover:text-primary font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-primary font-medium transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 tracking-widest uppercase mb-6">Say Hello</h3>
              <ul className="space-y-4">
                <li className="text-gray-500 font-medium">hello@pawblissyoga.com</li>
                <li className="text-gray-500 font-medium">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-100 pt-8 flex items-center justify-between">
            <p className="text-gray-400 text-sm font-medium">&copy; {new Date().getFullYear()} PawBlissYoga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
