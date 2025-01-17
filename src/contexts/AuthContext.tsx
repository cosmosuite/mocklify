import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const TEST_USER_EMAIL = 'test@test.com';
const isDevelopment = import.meta.env.DEV;

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

  useEffect(() => {
    // Initialize auth state from stored session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get stored session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
          
          // Refresh token if needed
          const { data: { session: refreshedSession }, error: refreshError } = 
            await supabase.auth.refreshSession();
            
          if (refreshError) {
            throw refreshError;
          } else if (refreshedSession) {
            setUser(refreshedSession.user);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        // Clear any invalid session data
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true);

      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user ?? null);
          break;
        case 'SIGNED_OUT':
          setUser(null);
          // Clear any stored session data
          localStorage.removeItem('supabase.auth.token');
          sessionStorage.clear();
          break;
        case 'TOKEN_REFRESHED':
          setUser(session?.user ?? null);
          break;
        case 'USER_UPDATED':
          setUser(session?.user ?? null);
          break;
        default:
          // Handle any other events
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      
      // Validate inputs
      if (!email?.trim() || !password?.trim()) {
        return { error: 'Email and password are required' };
      }

      // Development bypass for test email
      if (isDevelopment && email === TEST_USER_EMAIL) {
        if (password !== 'test1234') {
          return { error: 'Invalid credentials' };
        }

        const testUser = {
          id: 'test-user-id',
          email: TEST_USER_EMAIL,
          user_metadata: { name: 'Test User' },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        setUser(testUser as unknown as User);
        return { error: null };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password' };
        }
        return { error: error.message || 'Failed to sign in' };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      setError(message);
      return { error: message };
    }
  }, []);

  const signUpWithPassword = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      
      // Create user with password
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { email }
        }
      });

      if (error) {
        if (error.message?.includes('User already registered')) {
          return { error: 'An account with this email already exists' };
        }
        console.error('Sign up error:', error);
        return { error: error.message };
      }

      // Send OTP for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (otpError) {
        console.error('OTP error:', otpError);
        return { error: otpError.message };
      }

      return { 
        error: null,
        message: 'Please check your email for the verification code.'
      };
    } catch (error) {
      console.error('Sign up error:', error);
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      setError(message);
      return { error: message };
    }
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        if (error.message?.includes('rate limit')) {
          return { error: 'Too many attempts. Please wait a minute before trying again.' };
        } 
        return { error: error.message || 'Failed to send magic link' };
      }

      return { error: null };
    } catch (error) {
      console.error('Magic link error:', error);
      const message = error instanceof Error ? error.message : 'Failed to send magic link';
      setError(message);
      return { error: message };
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, token: string) => {
    try {
      setError(null);
      
      // Development bypass for test email
      if (isDevelopment && email === TEST_USER_EMAIL) {
        const testUser = {
          id: 'test-user-id',
          email: TEST_USER_EMAIL,
          user_metadata: { name: 'Test User' },
          aud: 'authenticated',
          created_at: new Date().toISOString()
        };
        setUser(testUser as unknown as User);
        return { error: null };
      }

      const { error } = await supabase.auth.verifyOtp({
        email, 
        token, 
        type: 'email'
      });
      if (error) throw error;
      return { error: null };
      
    } catch (error) {
      console.error('OTP verification error:', error);
      const message = error instanceof Error ? error.message : 'Failed to verify OTP';
      setError(message);
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('Starting signOut process...');
      setError(null);
      setIsLoading(true);

      // Handle test user signout
      if (isDevelopment && user?.email === TEST_USER_EMAIL) {
        setUser(null);
        setIsLoading(false);
        return { success: true };
      }
      
      // Clear the session from Supabase
      console.log('Clearing Supabase session...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('Clearing local storage...');
      // Clear all auth-related data from localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          console.log('Removing key:', key);
          localStorage.removeItem(key);
        }
      }

      console.log('Clearing session storage...');
      sessionStorage.clear();

      console.log('Clearing user state...');
      setUser(null);
      setIsLoading(false);

      // Return success
      return { success: true };
    } catch (err) {
      console.error('SignOut error:', err);
      const error = err as Error;
      console.error('Detailed error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setIsLoading(false);
      throw error;
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithOtp,
      verifyOtp,
      signInWithPassword,
      signUpWithPassword,
      signOut,
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