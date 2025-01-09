import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

const TEST_USER_EMAIL = 'test@test.com';
const isDevelopment = import.meta.env.DEV;

interface AuthMethodsProps {
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export function useAuthMethods({ setUser, setError, setIsLoading }: AuthMethodsProps) {
  const signInWithPassword = async (email: string, password: string) => {
    try {
      setError(null);
      
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
  };

  const signUpWithPassword = async (email: string, password: string) => {
    try {
      setError(null);
      
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
  };

  const signInWithOtp = async (email: string) => {
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
  };

  const verifyOtp = async (email: string, token: string) => {
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
  };

  const signOut = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Handle test user signout
      if (isDevelopment && user?.email === TEST_USER_EMAIL) {
        setUser(null);
        setIsLoading(false);
        return { success: true };
      }
      
      // Clear the session from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all auth-related data from localStorage
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      }

      sessionStorage.clear();
      setUser(null);
      setIsLoading(false);

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
  };

  return {
    signInWithPassword,
    signUpWithPassword,
    signInWithOtp,
    verifyOtp,
    signOut
  };
}