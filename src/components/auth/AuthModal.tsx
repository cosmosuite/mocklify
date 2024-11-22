import { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, Info, ArrowLeft } from 'lucide-react';
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

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'forgot-password';

export function AuthModal({ onClose }: Props) {
  const { signIn, signUp, signInWithMagicLink, resetPassword } = useAuth();
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '' });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  const currentForm = mode === 'signin' ? signInForm : signUpForm;
  const passwordChecks = validatePassword(currentForm.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateSignIn = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!signInForm.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(signInForm.email)) {
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
    } else if (!validateEmail(signUpForm.email)) {
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
    setNeedsEmailConfirmation(false);

    try {
      switch (mode) {
        case 'signup':
          if (!validateSignUp()) {
            setIsLoading(false);
            return;
          }

          const { error: signUpError, needsEmailConfirmation: confirmationNeeded, userExists } = 
            await signUp(signUpForm.email, signUpForm.password);

          if (signUpError) {
            setError(signUpError);
          } else if (userExists) {
            setMode('signin');
            setSignInForm({ email: signUpForm.email, password: '' });
            setSuccessMessage('This email is already registered. Please sign in instead.');
            setSignUpForm({ email: '', password: '' });
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
          break;

        case 'signin':
          if (!validateSignIn()) {
            setIsLoading(false);
            return;
          }

          const { error: signInError } = await signIn(signInForm.email, signInForm.password);
          if (signInError) {
            if (signInError === 'Please confirm your email before signing in') {
              setNeedsEmailConfirmation(true);
              setError('Please confirm your email address before signing in.');
            } else {
              setError(signInError);
            }
          } else {
            onClose();
          }
          break;

        case 'magic-link':
          if (!magicLinkEmail || !validateEmail(magicLinkEmail)) {
            setFormErrors({ email: 'Please enter a valid email address' });
            setIsLoading(false);
            return;
          }

          const { error: magicLinkError } = await signInWithMagicLink(magicLinkEmail);
          if (magicLinkError) {
            setError(magicLinkError);
          } else {
            setSuccessMessage('Magic link sent! Please check your email.');
            setMagicLinkEmail('');
          }
          break;

        case 'forgot-password':
          if (!resetEmail || !validateEmail(resetEmail)) {
            setFormErrors({ email: 'Please enter a valid email address' });
            setIsLoading(false);
            return;
          }

          const { error: resetError } = await resetPassword(resetEmail);
          if (resetError) {
            setError(resetError);
          } else {
            setSuccessMessage('Password reset email sent! Please check your inbox.');
            setResetEmail('');
          }
          break;
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
    setFormErrors({});
    setShowPasswordChecks(false);
    setNeedsEmailConfirmation(false);
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ email: '', password: '' });
    setMagicLinkEmail('');
    setResetEmail('');
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    const setForm = mode === 'signin' ? setSignInForm : setSignUpForm;
    setForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
    setError(null);
    setSuccessMessage(null);
    if (needsEmailConfirmation) setNeedsEmailConfirmation(false);
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'magic-link':
        return (
          <div className="space-y-4">
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
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Sending magic link...
                </>
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className="w-full inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign In
            </button>
          </div>
        );

      case 'forgot-password':
        return (
          <div className="space-y-4">
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
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Sending reset email...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('signin')}
              className="w-full inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign In
            </button>
          </div>
        );

      default:
        return (
          <>
            <Tabs defaultValue="signin" onValueChange={(value) => handleModeChange(value as AuthMode)} value={mode}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
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
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5" />
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

                {mode === 'signin' && (
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => handleModeChange('magic-link')}
                      className="font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sign in with magic link
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot-password')}
                      className="font-medium text-gray-700 hover:text-gray-900"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

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
              </div>
            </Tabs>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {mode === 'magic-link' ? 'Sign in with Magic Link' :
             mode === 'forgot-password' ? 'Reset Password' :
             mode === 'signup' ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'magic-link' ? 'Get a sign in link sent to your email' :
             mode === 'forgot-password' ? 'Get a password reset link sent to your email' :
             mode === 'signup' ? 'Get started with your account' : 'Sign in to your account'}
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
            <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-amber-600">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderAuthForm()}
          </form>
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