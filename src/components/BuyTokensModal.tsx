import { useState } from 'react';
import { Loader2, Package, CreditCard, Check, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { addCredits, getUserCreditsBalance } from '../lib/tokens';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface Props {
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 5,
    credits: 1000,
    generations: 10,
    description: 'Perfect for light usage and casual users',
    popular: false
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 25,
    credits: 6500,
    generations: 65,
    description: 'Ideal for regular users',
    popular: true
  },
  {
    id: 'advanced',
    name: 'Advanced Plan',
    price: 49,
    credits: 15000,
    generations: 150,
    description: 'Best for heavy users and professionals',
    popular: false
  }
];

const reloadPackages = [
  {
    id: 'basic',
    credits: 2500,
    price: 10,
    description: 'Generate 25 unique testimonials or notifications'
  }
];

export function BuyTokensModal({ onClose, onSuccess }: Props) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<'subscription' | 'reload'>('subscription');

  const handlePurchase = async (credits: number) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await addCredits(user.id, credits);
      if (success) {
        const newBalance = await getUserCreditsBalance(user.id);
        if (newBalance !== null) {
          onSuccess(newBalance);
        }
      } else {
        throw new Error('Failed to add credits');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setError('Failed to process purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div 
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Get More AI Credits
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Tabs value={purchaseType} onValueChange={(value) => setPurchaseType(value as 'subscription' | 'reload')}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="subscription" className="flex-1">Monthly Subscription</TabsTrigger>
                <TabsTrigger value="reload" className="flex-1">Credit Reload</TabsTrigger>
              </TabsList>

              <TabsContent value="subscription">
                <div className="grid md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`relative bg-white rounded-lg border-2 transition-all ${
                        plan.popular 
                          ? 'border-gray-900 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <span className="bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline">
                          <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                          <span className="ml-1 text-gray-500">/month</span>
                        </div>
                        
                        <ul className="mt-4 space-y-3">
                          <li className="flex items-center text-sm">
                            <Check size={16} className="text-gray-600 mr-2 flex-shrink-0" />
                            <span><b>{plan.credits.toLocaleString()}</b> AI credits per month</span>
                          </li>
                          <li className="flex items-center text-sm">
                            <Check size={16} className="text-gray-600 mr-2 flex-shrink-0" />
                            <span>Up to <b>{plan.generations}</b> image generations</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-500">
                            <Zap size={16} className="mr-2 flex-shrink-0" />
                            <span>{plan.description}</span>
                          </li>
                        </ul>

                        <button
                          onClick={() => handlePurchase(plan.credits)}
                          disabled={isLoading}
                          className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            plan.popular
                              ? 'bg-gray-900 text-white hover:bg-gray-800'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            'Subscribe Now'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reload">
                <div className="max-w-md mx-auto">
                  {reloadPackages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      className="bg-white rounded-lg border-2 border-gray-200 p-5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-700 mr-2" />
                          <span className="font-medium text-gray-900">
                            {pkg.credits.toLocaleString()} AI Credits
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                          ${pkg.price}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">
                        {pkg.description}
                      </p>

                      <button
                        onClick={() => handlePurchase(pkg.credits)}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Purchase Credits'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}