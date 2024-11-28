import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get URL params
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    
    // Check for errors
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      console.error('Auth error:', error, errorDescription);
      navigate('/auth', { 
        state: { error: decodeURIComponent(errorDescription || 'Authentication failed') }
      });
      return;
    }
    
    // Handle successful auth
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        navigate('/auth', { 
          state: { error: 'Failed to authenticate. Please try again.' }
        });
        return;
      }
      
      if (session) {
        // Redirect to home with welcome message for new users
        navigate('/', { 
          replace: true,
          state: { 
            message: email ? `Welcome! You're now signed in as ${email}` : 'Welcome back!'
          }
        });
      } else {
        navigate('/auth');
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col items-center">
          <Loader2 size={24} className="animate-spin mb-3" />
          <p className="text-gray-500">Completing sign in...</p>
        </div>
      </div>
    </div>
  );
}