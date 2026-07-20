import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home as HomeIcon, Calendar, Heart, User, LayoutDashboard, LogOut } from 'lucide-react';
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

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary selection:text-white pb-20 md:pb-0">
      <CustomCursor />
      
      {/* Desktop Floating Pill Navigation */}
      <div className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto glass-premium border border-white/40 shadow-premium rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl transition-all">
          
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center gap-3 group">
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
                onClick={handleNavClick}
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
                  onClick={handleNavClick}
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
                  onClick={handleNavClick}
                  className="text-gray-700 hover:bg-white/50 px-4 py-2 rounded-full font-semibold transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-primary/30"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Remove mobile hamburger for desktop pill */}
        </nav>
      </div>

      {/* Mobile Top App Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-premium border-b border-gray-100/50 flex items-center justify-between px-4 h-16">
        <Link to="/" onClick={handleNavClick} className="flex items-center gap-2">
          <img src="/logo.png" alt="PawBlissYoga" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">PawBlissYoga</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to={role === 'admin' ? '/admin' : '/dashboard'} onClick={handleNavClick} className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0) || 'U'}
            </Link>
          ) : (
            <Link to="/login" onClick={handleNavClick} className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu (Removed) */}

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-32 pb-6 md:pb-0">
        <Outlet />
      </main>

      {/* Premium Dark Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-auto relative z-10 pb-[env(safe-area-inset-bottom)] md:pb-0">
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" onClick={handleNavClick} className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="PawBlissYoga" className="w-12 h-12 object-contain" />
                <span className="font-extrabold font-serif text-2xl text-white">PawBlissYoga</span>
              </Link>
              <p className="text-gray-400 text-base leading-relaxed">
                Breathe Deep. Wag More. The ultimate destination for premium pet wellness and community.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-6">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/about" onClick={handleNavClick} className="text-gray-400 hover:text-white font-medium transition-colors">About Us</Link></li>
                <li><Link to="/services" onClick={handleNavClick} className="text-gray-400 hover:text-white font-medium transition-colors">Services</Link></li>
                <li><Link to="/events" onClick={handleNavClick} className="text-gray-400 hover:text-white font-medium transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white font-medium transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white font-medium transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-6">Say Hello</h3>
              <ul className="space-y-4">
                <li className="text-gray-400 font-medium">hello@pawblissyoga.com</li>
                <li className="text-gray-400 font-medium">+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-gray-800 pt-8 flex items-center justify-between">
            <p className="text-gray-500 text-sm font-medium">&copy; {new Date().getFullYear()} PawBlissYoga. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-premium border-t border-gray-100/50 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <Link to="/" onClick={handleNavClick} className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Home</span>
          </Link>
          <Link to="/services" onClick={handleNavClick} className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary">
            <Heart className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Services</span>
          </Link>
          <Link to="/events" onClick={handleNavClick} className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary">
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-semibold">Events</span>
          </Link>
          {user ? (
            <Link to={role === 'admin' ? '/admin' : '/dashboard'} onClick={handleNavClick} className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary">
              <LayoutDashboard className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Profile</span>
            </Link>
          ) : (
            <Link to="/login" onClick={handleNavClick} className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary">
              <User className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Account</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
