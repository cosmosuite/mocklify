import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PasswordForm } from '../components/auth/PasswordForm';
import { cn } from '../lib/utils';

export function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements from AuthPage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/10 rounded-[40%_60%_70%_30%] blur-3xl animate-morph-slow" />
          <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/5 rounded-[60%_40%_30%_70%] blur-3xl animate-morph-slower" />
          <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-[#CCFC7E]/10 rounded-[30%_70%_40%_60%] blur-3xl animate-morph" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,252,126,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(204,252,126,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="bg-[#0F0F0F] rounded-xl border border-[#1F1F1F] shadow-2xl w-full max-w-md relative z-10">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            Create an account
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Sign up to get started with Mocklify
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          <PasswordForm
            mode="signup"
            onSuccess={() => {
              setSuccessMessage('Account created! Please check your email to verify your account.');
            }}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/auth" className="text-[#CCFC7E] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}