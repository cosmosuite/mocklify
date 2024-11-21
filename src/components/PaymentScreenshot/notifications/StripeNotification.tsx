import { cn } from '../../../lib/utils';

interface Props {
  amount: string;
  currency: string;
  recipient: string;
  timestamp: string;
  masked: boolean;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$'
};

export function StripeNotification({ amount, currency, recipient, timestamp, masked }: Props) {
  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="bg-[rgba(28,28,30,0.6)] backdrop-blur-xl w-full overflow-hidden rounded-[14px]">
      <div className="px-[12px] py-[10px] flex items-center space-x-3">
        {/* App Icon */}
        <div className="w-8 h-8 bg-[#635BFF] rounded-[8px] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
            <path 
              fill="currentColor" 
              d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-white leading-none">Stripe</span>
            <span className="text-[12px] text-white/60 leading-none">{timestamp}</span>
          </div>
          <p className="mt-0.5 text-[13px] text-white/90 leading-[1.2]">
            You received a payment of {symbol}{amount} from{' '}
            {masked ? (
              <span className="inline-flex items-center">
                <span className="bg-black/90 w-32 h-[13px] rounded-[1px]" />
              </span>
            ) : (
              recipient
            )}
          </p>
        </div>
      </div>
    </div>
  );
}