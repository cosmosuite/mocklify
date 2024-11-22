import { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, Check, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { validatePassword } from '../../utils/validation';

interface Props {
  onClose: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function AuthModal({ onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const currentForm = mode === 'signin' ? signInForm : signUpForm;
  const passwordChecks = validatePassword(currentForm.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const validateSignIn = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!signInForm.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signInForm.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!signInForm.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateSignUp = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!signUpForm.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!signUpForm.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!isPasswordValid) {
      errors.password = 'Password does not meet requirements';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setFormErrors({});

    try {
      if (mode === 'signup') {
        if (!validateSignUp()) {
          setIsLoading(false);
          return;
        }

        const { error: signUpError, needsEmailConfirmation: confirmationNeeded } = 
          await signUp(signUpForm.email, signUpForm.password);

        if (signUpError) {
          if (signUpError.toLowerCase().includes('email')) {
            setFormErrors({ email: signUpError });
          } else {
            setError(signUpError);
          }
        } else if (confirmationNeeded) {
          setNeedsEmailConfirmation(true);
          setSuccessMessage('Account created! Please check your email for confirmation.');
          setSignUpForm({ email: '', password: '' });
        } else {
          // Auto sign in if email confirmation is not required
          const { error: signInError } = await signIn(signUpForm.email, signUpForm.password);
          if (!signInError) {
            onClose();
          }
        }
      } else {
        if (!validateSignIn()) {
          setIsLoading(false);
          return;
        }

        const { error: signInError } = await signIn(signInForm.email, signInForm.password);
        if (signInError) {
          if (signInError === 'Email not confirmed') {
            setNeedsEmailConfirmation(true);
            setError('Please confirm your email address before signing in.');
          } else {
            setError('Invalid email or password');
          }
        } else {
          onClose();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'signin' | 'signup');
    setError(null);
    setSuccessMessage(null);
    setFormErrors({});
    setShowPasswordChecks(false);
    setNeedsEmailConfirmation(false);
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ email: '', password: '' });
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    const setForm = mode === 'signin' ? setSignInForm : setSignUpForm;
    setForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
    setError(null);
    if (needsEmailConfirmation) setNeedsEmailConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <Tabs defaultValue="signin" onValueChange={handleModeChange}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
            </TabsList>

            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {mode === 'signup' ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {mode === 'signup' ? 'Get started with your account' : 'Sign in to your account'}
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {needsEmailConfirmation && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-600">
                  <p className="font-medium">Email confirmation required</p>
                  <p className="mt-1">Please check your email and click the confirmation link to activate your account.</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-600">{successMessage}</p>
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
                    value={currentForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setShowPasswordChecks(false)}
                    placeholder="you@example.com"
                    className={`block w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-100 ${
                      formErrors.email 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-gray-200 focus:border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={currentForm.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => mode === 'signup' && setShowPasswordChecks(true)}
                    placeholder="••••••••"
                    className={`block w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-gray-100 ${
                      formErrors.password 
                        ? 'border-red-300 focus:border-red-300' 
                        : 'border-gray-200 focus:border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}

                {mode === 'signup' && showPasswordChecks && (
                  <div className="mt-2 space-y-2">
                    <p className="text-xs font-medium text-gray-500">Password must contain:</p>
                    <ul className="space-y-1">
                      {Object.entries(passwordChecks).map(([check, isValid]) => (
                        <li key={check} className="flex items-center text-xs">
                          {isValid ? (
                            <Check size={12} className="text-green-500 mr-1.5" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-gray-300 mr-1.5" />
                          )}
                          <span className={isValid ? 'text-green-700' : 'text-gray-600'}>
                            {check === 'hasLowercase' && 'One lowercase letter'}
                            {check === 'hasUppercase' && 'One uppercase letter'}
                            {check === 'hasNumber' && 'One number'}
                            {check === 'hasSpecial' && 'One special character'}
                            {check === 'hasMinLength' && 'At least 8 characters'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (mode === 'signup' && !isPasswordValid)}
                className="w-full inline-flex items-center justify-center h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>

              {mode === 'signin' && (
                <p className="text-sm text-center text-gray-500">
                  Demo account: demo@example.com / demo1234
                </p>
              )}
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