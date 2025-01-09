import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  email?: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export function OtpForm({ email: initialEmail, onSuccess, onBack }: Props) {
  const { signInWithOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(!!initialEmail);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signInWithOtp(email);
      if (error) {
        setError(error);
      } else {
        setOtpSent(true);
        setSuccessMessage('Check your email for the 6-digit code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await verifyOtp(email, otp);
      if (error) {
        if (error.includes('Invalid OTP')) {
          setError('Invalid code. Please try again.');
        } else {
          setError(error);
        }
      } else {
        setSuccessMessage('Successfully verified!');
        // Small delay to show success message
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={16} className="text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            disabled={otpSent}
            className={cn(
              "block w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-[#1F1F1F] text-white",
              "focus:ring-2 focus:ring-[#CCFC7E] focus:border-[#CCFC7E]",
              "border-[#2F2F2F] hover:border-[#3F3F3F]",
              error ? "border-red-500" : "",
              otpSent ? "opacity-50" : ""
            )}
            required
          />
        </div>
        {!otpSent && (
          <p className="mt-2 text-xs text-gray-400">
            We'll send you a verification code to sign in
          </p>
        )}
      </div>

      {otpSent && (
        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP code"
            className={cn(
              "block w-full px-4 py-2.5 text-sm border rounded-lg bg-[#1F1F1F] text-white",
              "focus:ring-2 focus:ring-[#CCFC7E] focus:border-[#CCFC7E]",
              "border-[#2F2F2F] hover:border-[#3F3F3F]",
              error ? "border-red-500" : ""
            )}
            required
            pattern="[0-9]{6}"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full inline-flex items-center justify-center h-10 px-4",
          "bg-[#CCFC7E] text-black text-sm font-medium rounded-lg",
          "hover:bg-[#B8E86E] focus:outline-none focus:ring-2",
          "focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            {otpSent ? 'Verifying...' : 'Sending OTP...'}
          </>
        ) : (
          otpSent ? 'Verify OTP' : 'Send OTP'
        )}
      </button>

      {otpSent && (
        <button
          type="button"
          onClick={onBack}
          className="w-full text-sm text-gray-400 hover:text-gray-300"
        >
          Use a different email
        </button>
      )}
    </form>
  );
}