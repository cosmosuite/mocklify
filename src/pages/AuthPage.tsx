import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MagicLinkForm } from '../components/auth/MagicLinkForm';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

type AuthMode = 'magic-link' | 'password';

export function AuthPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>('magic-link');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect while checking auth state
    if (isLoading) return;

    // Check for messages in location state
    const message = location.state?.message;
    if (message) {
      setSuccessMessage(message);
    }

    if (user) {
      // Redirect to the page they tried to visit or home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location]);


  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/10 rounded-[40%_60%_70%_30%] blur-3xl animate-morph-slow" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/5 rounded-[60%_40%_30%_70%] blur-3xl animate-morph-slower" />
          <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/10 rounded-[30%_70%_40%_60%] blur-3xl animate-morph" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,252,126,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(204,252,126,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-[15%] left-[20%] w-2 h-8 bg-gradient-to-b from-[#CCFC7E]/20 to-transparent rounded-full animate-float-up" />
          <div className="absolute top-[45%] right-[15%] w-2 h-12 bg-gradient-to-b from-[#CCFC7E]/20 to-transparent rounded-full animate-float-up delay-200" />
          <div className="absolute top-[25%] right-[35%] w-2 h-6 bg-gradient-to-b from-[#CCFC7E]/20 to-transparent rounded-full animate-float-up delay-500" />
          <div className="absolute top-[65%] left-[40%] w-2 h-10 bg-gradient-to-b from-[#CCFC7E]/20 to-transparent rounded-full animate-float-up delay-700" />
        </div>
        
        {/* Glowing Dots */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[#CCFC7E] rounded-full animate-glow" />
          <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-[#CCFC7E] rounded-full animate-glow delay-300" />
          <div className="absolute bottom-[30%] left-[35%] w-1.5 h-1.5 bg-[#CCFC7E] rounded-full animate-glow delay-500" />
          <div className="absolute top-[15%] right-[15%] w-1 h-1 bg-[#CCFC7E] rounded-full animate-glow delay-700" />
          <div className="absolute bottom-[20%] right-[30%] w-1 h-1 bg-[#CCFC7E] rounded-full animate-glow delay-100" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] shadow-2xl w-full max-w-md relative z-10">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Sign in to your account to continue
          </p>
          
          {/* Auth Mode Selector */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setAuthMode('magic-link')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                authMode === 'magic-link'
                  ? "bg-[#1F1F1F] text-[#CCFC7E]"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Magic Link
            </button>
            <button
              onClick={() => setAuthMode('password')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                authMode === 'password'
                  ? "bg-[#1F1F1F] text-[#CCFC7E]"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Password
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-sm text-amber-600">{successMessage}</p>
            </div>
          )}

          {authMode === 'magic-link' ? (
            <MagicLinkForm onSuccess={() => navigate('/')} />
          ) : (
            <LoginForm
              onSuccess={() => navigate('/')}
            />
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#CCFC7E] hover:underline font-medium">
                Create one
              </Link>
            </p>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4 space-x-1">
            <span>By clicking "Continue", you agree to the</span>
            <a href="/terms" className="text-[#CCFC7E] hover:underline">Terms of Service</a>
            <span>and</span>
            <a href="/privacy" className="text-[#CCFC7E] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}