import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ 
    error: string | null;
    needsEmailConfirmation?: boolean;
    userExists?: boolean;
  }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
  signIn: async () => ({ error: null }),
  signInWithMagicLink: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  isLoading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const parseAuthError = (error: AuthError): string => {
    const message = error.message.toLowerCase();
    
    // Check for specific error messages
    if (message.includes('user already registered')) {
      return 'existing_user';
    }
    if (message.includes('email not confirmed')) {
      return 'email_not_confirmed';
    }
    if (message.includes('invalid login credentials')) {
      return 'invalid_credentials';
    }
    
    // Return the original message if no specific case matches
    return error.message;
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: email.split('@')[0]
          }
        }
      });

      if (error) {
        const parsedError = parseAuthError(error);
        
        // Handle specific error cases
        if (parsedError === 'existing_user') {
          return { 
            error: null,
            userExists: true
          };
        }
        
        return { error: parsedError };
      }

      // Check response status
      if (data?.user?.identities?.length === 0) {
        return { 
          error: null,
          userExists: true
        };
      }

      // Check if email confirmation is required
      if (data?.user && !data.user.confirmed_at) {
        return { 
          error: null,
          needsEmailConfirmation: true
        };
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      setError(message);
      return { error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        const parsedError = parseAuthError(error);
        
        switch (parsedError) {
          case 'email_not_confirmed':
            return { error: 'Please confirm your email before signing in' };
          case 'invalid_credentials':
            return { error: 'Invalid email or password' };
          default:
            return { error: parsedError };
        }
      }

      if (data?.user) {
        setUser(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Signin error:', error);
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      setError(message);
      return { error: message };
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Magic link error:', error);
      const message = error instanceof Error ? error.message : 'Failed to send magic link';
      setError(message);
      return { error: message };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      setError(message);
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Signout error:', error);
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      setError(message);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signOut, 
      signIn, 
      signInWithMagicLink,
      signUp, 
      resetPassword,
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}