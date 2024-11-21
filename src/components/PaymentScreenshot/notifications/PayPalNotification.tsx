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

export function PayPalNotification({ amount, currency, recipient, timestamp, masked }: Props) {
  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="bg-[rgba(28,28,30,0.6)] backdrop-blur-xl w-full overflow-hidden rounded-[14px]">
      <div className="px-[12px] py-[10px] flex items-center space-x-3">
        {/* PayPal Icon */}
        <div className="w-8 h-8 bg-[#003087] rounded-[8px] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
            <path 
              fill="currentColor" 
              d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42c-.003.02-.006.039-.01.058-.905 4.642-4.168 6.325-8.451 6.325H10.57c-.524 0-.968.382-1.05.9l-1.12 7.106c-.083.519.278.949.802.949h4.374c.447 0 .828-.31.902-.748l.037-.227.704-4.462.045-.276a.907.907 0 0 1 .902-.748h.57c3.67 0 6.545-1.49 7.385-5.8.35-1.797.171-3.297-.699-4.351-.291-.351-.65-.65-1.077-.897-.107-.062-.218-.118-.333-.169z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-white leading-none">Business</span>
            <span className="text-[12px] text-white/60 leading-none">{timestamp}</span>
          </div>
          <p className="mt-0.5 text-[13px] text-white/90 leading-[1.2]">
            You received {symbol}{amount} from{' '}
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