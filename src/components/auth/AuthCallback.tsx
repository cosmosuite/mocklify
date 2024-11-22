import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    // Get hash params from URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    if (error) {
      console.error('Auth error:', error, errorDescription);
      navigate('/login', { 
        state: { 
          error: decodeURIComponent(errorDescription || 'Authentication failed')
        }
      });
      return;
    }

    // If no error, attempt to exchange token
    const refreshToken = hashParams.get('refresh_token');
    if (refreshToken) {
      supabase.auth.refreshSession({ refresh_token: refreshToken })
        .then(({ data, error }) => {
          if (error) {
            console.error('Session refresh error:', error);
            navigate('/login', { 
              state: { 
                error: 'Failed to authenticate. Please try again.'
              }
            });
          } else if (data.session) {
            navigate('/');
          }
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-t-gray-900 border-gray-200 rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Completing sign in...</p>
        </div>
      </div>
    </div>
  );
}