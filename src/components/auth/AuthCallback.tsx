import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get URL params
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const token = params.get('token');
    const type = params.get('type');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      console.error('Auth error:', error, errorDescription);
      navigate('/auth', { 
        state: { error: decodeURIComponent(errorDescription || 'Authentication failed') }
      });
      return;
    }

    // Handle email verification
    if (type === 'signup' && token) {
      navigate('/auth', {
        state: { 
          message: `Email verified successfully! You can now sign in with ${email}.`
        }
      });
      return;
    }
    
    // Redirect to home on successful auth
    navigate('/', { 
      replace: true,
      state: { message: 'Welcome back!' }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col items-center">
          <Loader2 size={24} className="animate-spin mb-3" />
          <p className="text-gray-500">Completing authentication...</p>
        </div>
      </div>
    </div>
  );
}