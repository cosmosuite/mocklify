import { useState } from 'react';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  mode: 'login' | 'signup';
  onSuccess: () => void;
}

export function PasswordForm({ mode, onSuccess }: Props) {
  const { signInWithPassword, signUpWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await (mode === 'login' 
        ? signInWithPassword(email, password)
        : signUpWithPassword(email, password)
      );

      if (error) {
        setError(error);
      } else {
        onSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>

      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={16} className="text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={cn(
              "block w-full pl-10 pr-12 py-2.5 text-sm border rounded-lg bg-[#1F1F1F] text-white",
              "focus:ring-2 focus:ring-[#CCFC7E] focus:border-[#CCFC7E]",
              "border-[#2F2F2F] hover:border-[#3F3F3F]",
              error ? "border-red-500" : ""
            )}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
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
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          mode === 'login' ? 'Sign in with Password' : 'Create Account'
        )}
      </button>
    </form>
  );
}