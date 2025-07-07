import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => boolean;
  register: (username: string, password: string, email: string) => boolean;
  logout: () => void;
  loading: boolean;
  userType: 'test' | 'admin' | 'trial' | null;
  trialExpired: boolean;
  trialDaysLeft: number;
  setUserSubscribed: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'test' | 'admin' | 'trial' | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  const checkTrialStatus = (userType: string, trialStartDate?: string) => {
    if (userType !== 'trial' || !trialStartDate) {
      return { expired: false, daysLeft: 0 };
    }

    const startDate = new Date(trialStartDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = Math.max(0, 14 - diffDays);
    
    return {
      expired: diffDays >= 14,
      daysLeft: daysLeft
    };
  };

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('nexum-auth');
    const savedUserType = localStorage.getItem('nexum-user-type') as 'test' | 'admin' | 'trial' | null;
    const trialStartDate = localStorage.getItem('nexum-trial-start');
    
    if (authStatus === 'authenticated' && savedUserType) {
      const trialStatus = checkTrialStatus(savedUserType, trialStartDate || undefined);
      
      if (savedUserType === 'trial' && trialStatus.expired) {
        setTrialExpired(true);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setTrialExpired(false);
      }
      
      setUserType(savedUserType);
      setTrialDaysLeft(trialStatus.daysLeft);
    }
    setLoading(false);
  }, []);

  const login = (usernameOrEmail: string, password: string): boolean => {
    // Check registered users first
    const registeredUsers = JSON.parse(localStorage.getItem('nexum-registered-users') || '[]');
    
    // Find user by username or email
    const user = registeredUsers.find((u: any) => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    
    if (user) {
      const trialStatus = checkTrialStatus(user.userType, user.trialStartDate);
      
      if (user.userType === 'trial' && trialStatus.expired) {
        setTrialExpired(true);
        return false;
      }
      
      localStorage.setItem('nexum-auth', 'authenticated');
      localStorage.setItem('nexum-user-type', user.userType);
      if (user.trialStartDate) {
        localStorage.setItem('nexum-trial-start', user.trialStartDate);
      }
      
      setIsAuthenticated(true);
      setUserType(user.userType);
      setTrialExpired(false);
      setTrialDaysLeft(trialStatus.daysLeft);
      return true;
    }
    
    // Check default accounts
    if (usernameOrEmail === 'Teste' && password === 'teste123') {
      localStorage.setItem('nexum-auth', 'authenticated');
      localStorage.setItem('nexum-user-type', 'test');
      setIsAuthenticated(true);
      setUserType('test');
      setTrialExpired(false);
      return true;
    } else if (usernameOrEmail === 'Admin' && password === 'Admin123') {
      localStorage.setItem('nexum-auth', 'authenticated');
      localStorage.setItem('nexum-user-type', 'admin');
      setIsAuthenticated(true);
      setUserType('admin');
      setTrialExpired(false);
      return true;
    }
    return false;
  };

  const register = (username: string, password: string, email: string): boolean => {
    const registeredUsers = JSON.parse(localStorage.getItem('nexum-registered-users') || '[]');
    
    // Check if username or email already exists
    const userExists = registeredUsers.some((u: any) => u.username === username || u.email === email);
    if (userExists) {
      return false;
    }
    
    const newUser = {
      username,
      password,
      email,
      userType: 'pending', // Will be set after plan selection
      registeredAt: new Date().toISOString()
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('nexum-registered-users', JSON.stringify(registeredUsers));
    return true;
  };

  const setUserSubscribed = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('nexum-registered-users') || '[]');
    const currentUser = localStorage.getItem('nexum-current-user');
    
    if (currentUser) {
      const userIndex = registeredUsers.findIndex((u: any) => u.username === currentUser);
      if (userIndex !== -1) {
        registeredUsers[userIndex].userType = 'admin';
        localStorage.setItem('nexum-registered-users', JSON.stringify(registeredUsers));
        localStorage.setItem('nexum-user-type', 'admin');
        setUserType('admin');
        setTrialExpired(false);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('nexum-auth');
    localStorage.removeItem('nexum-user-type');
    localStorage.removeItem('nexum-trial-start');
    localStorage.removeItem('nexum-current-user');
    setIsAuthenticated(false);
    setUserType(null);
    setTrialExpired(false);
    setTrialDaysLeft(0);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      register,
      logout, 
      loading, 
      userType,
      trialExpired,
      trialDaysLeft,
      setUserSubscribed
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
