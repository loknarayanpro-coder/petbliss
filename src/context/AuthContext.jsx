import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'user' or 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('petCareUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setRole(parsedUser.role);
    }
    setLoading(false);
  }, []);

  const sendOtp = async (phone) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate a 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Store it temporarily for verification
        localStorage.setItem('mockOtp', otp);
        setLoading(false);
        resolve(otp);
      }, 600);
    });
  };

  const verifyOtp = async (phone, otp) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedOtp = localStorage.getItem('mockOtp');
        
        if (otp === storedOtp || otp === '123456') { // Allow '123456' as a universal bypass for easy testing
          let authUser;
          
          if (phone === '9999999999') {
            authUser = { id: 'admin1', phone, name: 'System Admin', role: 'admin' };
          } else {
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const registeredUser = existingUsers.find(u => u.phone === phone);
            
            authUser = { 
              id: 'user' + Date.now(), 
              phone, 
              name: registeredUser?.name || 'Pet Lover', 
              email: registeredUser?.email || '',
              role: 'user' 
            };
          }
          
          setUser(authUser);
          setRole(authUser.role);
          localStorage.setItem('petCareUser', JSON.stringify(authUser));
          localStorage.removeItem('mockOtp');
          resolve({ user: authUser });
        } else {
          reject(new Error('Invalid OTP'));
        }
        setLoading(false);
      }, 800);
    });
  };

  const logout = async () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('petCareUser');
  };

  const updateUser = async (updates) => {
    if (!user) return;
    
    // Create new updated user object
    const updatedUser = { ...user, ...updates };
    
    // Update active session
    setUser(updatedUser);
    localStorage.setItem('petCareUser', JSON.stringify(updatedUser));

    // Update the mock database if it's a regular user
    if (user.role === 'user') {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = existingUsers.findIndex(u => u.phone === user.phone);
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...updates };
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, sendOtp, verifyOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
