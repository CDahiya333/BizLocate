import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AdminData, loginAdmin, registerAdmin, AdminLoginData, AdminRegisterData } from '../services/api';

interface AuthContextProps {
  admin: Omit<AdminData, 'token'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AdminLoginData) => Promise<void>;
  register: (data: AdminRegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [admin, setAdmin] = useState<Omit<AdminData, 'token'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (token) {
          const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
          if (adminData && adminData._id) {
            setAdmin({
              _id: adminData._id,
              name: adminData.name,
              email: adminData.email
            });
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: AdminLoginData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginAdmin(data);
      
      // Store token and admin data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response));
      
      setAdmin({
        _id: response._id,
        name: response.name,
        email: response.email
      });
      
      router.push('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: AdminRegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await registerAdmin(data);
      
      // Store token and admin data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response));
      
      setAdmin({
        _id: response._id,
        name: response.name,
        email: response.email
      });
      
      router.push('/admin');
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 