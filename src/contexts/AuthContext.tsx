import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null; }>;
  signOut: () => Promise<{ success: boolean; }>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signInWithMagicLink: async () => ({ error: null }),
  signOut: async () => ({ success: true }),
  isLoading: true,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true
        }
      });

      if (error) {
        console.error('Magic link error:', error);
        if (error.message?.includes('rate limit')) {
          return { error: 'Too many attempts. Please wait a few minutes before trying again.' };
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

  const signOut = useCallback(async () => {
    try {
      console.log('Starting signOut process...');
      setError(null);
      
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session before signOut:', session);

      // Clear the session from Supabase
      console.log('Clearing Supabase session...');
      await supabase.auth.signOut();

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
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithMagicLink,
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