import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useAuthMethods } from './useAuthMethods';
import { initializeAuth, setupAuthListener } from './authUtils';

interface AuthContextType {
  user: User | null;
  signInWithOtp: (email: string) => Promise<{ error: string | null; }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null; }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null; }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ error: string | null; message?: string; }>;
  signOut: () => Promise<{ success: boolean; }>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithOtp: async () => ({ error: null }),
  verifyOtp: async () => ({ error: null }),
  signInWithPassword: async () => ({ error: null }),
  signUpWithPassword: async () => ({ error: null }),
  signOut: async () => ({ success: true }),
  isLoading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authMethods = useAuthMethods({ setUser, setError, setIsLoading });

  useEffect(() => {
    // Initialize auth state
    initializeAuth({ setUser, setError, setIsLoading });

    // Set up auth state change listener
    const { unsubscribe } = setupAuthListener({ setUser, setIsLoading });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      ...authMethods,
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}