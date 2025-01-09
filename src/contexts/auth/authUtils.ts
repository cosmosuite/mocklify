import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthUtilsProps {
  setUser: (user: User | null) => void;
  setError?: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export async function initializeAuth({ setUser, setError, setIsLoading }: AuthUtilsProps) {
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
    if (setError) {
      setError('Failed to initialize authentication');
    }
  } finally {
    setIsLoading(false);
  }
}

export function setupAuthListener({ setUser, setIsLoading }: AuthUtilsProps) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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

  return {
    unsubscribe: () => subscription.unsubscribe()
  };
}