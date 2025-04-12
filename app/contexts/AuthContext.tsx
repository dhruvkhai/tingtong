import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import type { AuthResponse } from '../services/authService';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isFirstTime: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  socialLogin: (provider: 'google' | 'facebook', token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check for existing session and first-time status on app start
    const loadSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        const firstTime = await AsyncStorage.getItem('isFirstTime');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
        
        if (firstTime === 'false') {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await authService.signup({ name, email, password, confirmPassword });
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('isFirstTime', 'false');
      setToken(response.token);
      setUser(response.user);
      setIsFirstTime(false);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook', token: string) => {
    try {
      const response = await authService.socialLogin(provider, token);
      await AsyncStorage.setItem('token', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      await AsyncStorage.setItem('isFirstTime', 'false');
      setToken(response.token);
      setUser(response.user);
      setIsFirstTime(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isFirstTime, login, signup, logout, socialLogin }}>
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