import { useState, useEffect } from 'react';
import { Coins, Plus, Loader2 } from 'lucide-react';
import { getUserCreditsBalance, CREDITS_CONFIG } from '../lib/tokens';
import { useAuth } from '../contexts/AuthContext';
import { BuyTokensModal } from './BuyTokensModal';
import { cn } from '../lib/utils';

interface Props {
  isExpanded?: boolean;
}

export function TokenBalance({ isExpanded = true }: Props) {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadBalance = async () => {
      if (!user) return;
      
      try {
        const creditsBalance = await getUserCreditsBalance(user.id);
        if (mounted && creditsBalance !== null) {
          setBalance(creditsBalance);
        }
      } catch (error) {
        console.error('Error loading credits balance:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadBalance();

    // Refresh balance periodically
    const interval = setInterval(loadBalance, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const handleBuySuccess = (newBalance: number) => {
    setBalance(newBalance);
    setIsModalOpen(false);
  };

  if (!user) return null;

  if (!isExpanded) {
    return (
      <div className="px-2 py-3 flex flex-col items-center gap-1 text-gray-400">
        <Coins size={16} />
        <span className="text-xs font-medium">
          {isLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            balance
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="border border-[#1F1F1F] bg-[#161616] rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Coins size={18} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-300">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                {balance ?? 0} Credits
                <span className="text-xs text-gray-500 ml-1">
                  ({Math.floor((balance ?? 0) / CREDITS_CONFIG.CREDITS_PER_GENERATION)} generations)
                </span>
              </>
            )}
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1 hover:bg-[#252525] rounded-md transition-colors text-gray-400"
          title="Buy more credits"
        >
          <Plus size={18} />
        </button>
      </div>

      {isModalOpen && (
        <BuyTokensModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleBuySuccess}
        />
      )}
    </div>
  );
}