import { useState } from 'react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface Props {
  onClose: () => void;
}

// Demo user credentials
const DEMO_USER = {
  email: 'demo@example.com',
  password: 'demo1234'
};

export function AuthModal({ onClose }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      signIn(DEMO_USER.email);
      onClose();
    } catch (error) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      signIn(email);
      onClose();
    } catch (error) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <Tabs defaultValue="signin" onValueChange={(value) => setMode(value as 'signin' | 'signup')}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {mode === 'signup' ? 'Get 5 free tokens to start generating content' : 'Sign in to your account'}
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-100 focus:border-gray-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full inline-flex items-center justify-center h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center h-10 px-4 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue with Demo Account
              </button>
            </form>
          </Tabs>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-900"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}