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

  const login = async (email, password) => {
    setLoading(true);
    // Mock login logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@admin.com' && password === 'admin') {
          const adminUser = { id: 'admin1', email, name: 'System Admin', role: 'admin' };
          setUser(adminUser);
          setRole('admin');
          localStorage.setItem('petCareUser', JSON.stringify(adminUser));
          resolve({ user: adminUser });
        } else {
          // Accept any other email/password as a regular user for mock testing
          const regularUser = { id: 'user' + Date.now(), email, name: email.split('@')[0] || 'User', role: 'user' };
          setUser(regularUser);
          setRole('user');
          localStorage.setItem('petCareUser', JSON.stringify(regularUser));
          resolve({ user: regularUser });
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

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
