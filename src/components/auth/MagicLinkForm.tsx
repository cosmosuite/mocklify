import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onSuccess: () => void;
}

export function MagicLinkForm({ onSuccess }: Props) {
  const { signInWithOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!email?.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    
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
        setSuccessMessage('Check your email for a secure sign in link');
        setEmail('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            className={cn(
              "block w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg bg-[#1F1F1F] text-white",
              "focus:ring-2 focus:ring-[#CCFC7E] focus:border-[#CCFC7E]",
              "border-[#2F2F2F] hover:border-[#3F3F3F]",
              error ? "border-red-500" : ""
            )}
            required
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          We'll send you a secure link to sign in
        </p>
      </div>

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
            Sending link...
          </>
        ) : (
          'Send Magic Link'
        )}
      </button>
    </form>
  );
}