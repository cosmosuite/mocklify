import { X } from 'lucide-react';
import { BackgroundUploader } from './BackgroundUploader';

interface Props {
  formData: {
    platform: 'stripe' | 'paypal';
    stripeRecipients: Array<{
      identifier: string;
      amount: string;
      timestamp: string;
    }>;
    paypalRecipients: Array<{
      identifier: string;
      amount: string;
      timestamp: string;
    }>;
    currency: string;
    wallpaper: string;
    maskEmails: boolean;
    customBackground: string | null;
  };
  onChange: (field: string, value: any) => void;
  wallpapers: string[];
}

const platforms = [
  { 
    id: 'stripe', 
    name: 'Stripe',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path 
          fill="currentColor" 
          d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
        />
      </svg>
    ),
    color: '#635BFF'
  },
  { 
    id: 'paypal', 
    name: 'PayPal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path 
          fill="currentColor" 
          d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42c-.003.02-.006.039-.01.058-.905 4.642-4.168 6.325-8.451 6.325H10.57c-.524 0-.968.382-1.05.9l-1.12 7.106c-.083.519.278.949.802.949h4.374c.447 0 .828-.31.902-.748l.037-.227.704-4.462.045-.276a.907.907 0 0 1 .902-.748h.57c3.67 0 6.545-1.49 7.385-5.8.35-1.797.171-3.297-.699-4.351-.291-.351-.65-.65-1.077-.897-.107-.062-.218-.118-.333-.169z"
        />
      </svg>
    ),
    color: '#003087'
  }
];

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' }
];

const timeOptions = ['4h', '3h', '2h', '1h', '30m', '15m', '10m', '5m', '4m', '3m', '2m', '1m', 'now'];

const paypalBusinessNames = [
  "Digital Solutions LLC",
  "Tech Innovations Co",
  "Global Services Inc",
  "Creative Studios Ltd",
  "Web Dynamics Group",
  "Smart Systems Corp",
  "Future Tech Solutions",
  "Digital Ventures LLC",
  "Pro Services Network",
  "Elite Business Group",
  "Prime Solutions Inc",
  "Next Level Systems",
  "Advanced Tech Corp",
  "Modern Solutions Ltd",
  "Strategic Services"
];

function generateRandomAmount() {
  const min = 10;
  const max = 999;
  const amount = Math.random() * (max - min) + min;
  return amount.toFixed(2);
}

function generateRandomBusinessName() {
  return paypalBusinessNames[Math.floor(Math.random() * paypalBusinessNames.length)];
}

function generateTimestampsInOrder(count: number) {
  const selectedTimes = timeOptions.slice(-count);
  return selectedTimes.map(time => time === 'now' ? time : `${time} ago`);
}

export function NotificationForm({ formData, onChange, wallpapers }: Props) {
  const activeRecipients = formData.platform === 'stripe' 
    ? formData.stripeRecipients 
    : formData.paypalRecipients;

  const handleEditRecipient = (index: number, field: string, value: string) => {
    const recipientField = formData.platform === 'stripe' ? 'stripeRecipients' : 'paypalRecipients';
    const newRecipients = [...activeRecipients];
    newRecipients[index] = {
      ...newRecipients[index],
      [field === 'email' || field === 'business' ? 'identifier' : field]: 
        field === 'timestamp' && value !== 'now' ? `${value} ago` : value
    };
    onChange(recipientField, newRecipients);
  };

  const handleRemoveRecipient = (index: number) => {
    const recipientField = formData.platform === 'stripe' ? 'stripeRecipients' : 'paypalRecipients';
    const newRecipients = activeRecipients.filter((_, i) => i !== index);
    onChange(recipientField, newRecipients);
  };

  const handleAddRecipient = () => {
    const recipientField = formData.platform === 'stripe' ? 'stripeRecipients' : 'paypalRecipients';
    const timestamps = generateTimestampsInOrder(activeRecipients.length + 1);
    const newRecipients = [...activeRecipients, {
      identifier: formData.platform === 'paypal' ? generateRandomBusinessName() : '',
      amount: generateRandomAmount(),
      timestamp: timestamps[timestamps.length - 1]
    }];
    onChange(recipientField, newRecipients);
  };

  const handleRandomizeAmounts = () => {
    const recipientField = formData.platform === 'stripe' ? 'stripeRecipients' : 'paypalRecipients';
    const timestamps = generateTimestampsInOrder(activeRecipients.length);
    const newRecipients = activeRecipients.map((recipient, index) => ({
      ...recipient,
      amount: generateRandomAmount(),
      identifier: formData.platform === 'paypal' ? generateRandomBusinessName() : recipient.identifier,
      timestamp: timestamps[index]
    }));
    onChange(recipientField, newRecipients);
  };

  const handlePlatformChange = (platform: 'stripe' | 'paypal') => {
    onChange('platform', platform);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Customize Payment Screenshot
        </h2>

        <div className="space-y-6">
          {/* Platform Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <div className="flex gap-2">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformChange(platform.id as 'stripe' | 'paypal')}
                  className={`
                    relative flex items-center px-3 h-10 rounded-lg border text-sm font-medium transition-colors
                    ${formData.platform === platform.id
                      ? 'text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }
                  `}
                  style={{ 
                    backgroundColor: formData.platform === platform.id ? platform.color : 'transparent',
                    borderColor: formData.platform === platform.id ? platform.color : undefined
                  }}
                >
                  {platform.icon}
                  <span className="ml-2">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="relative w-24">
              <select
                value={formData.currency}
                onChange={(e) => onChange('currency', e.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-200 pl-2.5 pr-6 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {formData.platform === 'paypal' ? 'Business Names' : 'Recipients'}
              </label>
              <button
                onClick={handleRandomizeAmounts}
                className="text-xs font-medium text-gray-500 hover:text-gray-900"
              >
                Randomize All
              </button>
            </div>
            
            <div className="space-y-2 mb-3">
              {activeRecipients.map((recipient, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-[minmax(0,1.5fr),80px,80px,32px] gap-2 items-start"
                >
                  {formData.platform === 'paypal' ? (
                    <select
                      value={recipient.identifier}
                      onChange={(e) => handleEditRecipient(index, 'business', e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-gray-200 px-2 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm"
                    >
                      {paypalBusinessNames.map(name => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="email"
                      value={recipient.identifier}
                      onChange={(e) => handleEditRecipient(index, 'email', e.target.value)}
                      placeholder="Email address"
                      className="h-10 rounded-lg border border-gray-200 px-3 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 w-full min-w-0"
                    />
                  )}
                  <input
                    type="text"
                    value={recipient.amount}
                    onChange={(e) => handleEditRecipient(index, 'amount', e.target.value)}
                    className="h-10 rounded-lg border border-gray-200 px-2 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-right"
                  />
                  <select
                    value={recipient.timestamp.replace(' ago', '')}
                    onChange={(e) => handleEditRecipient(index, 'timestamp', e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-gray-200 px-2 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-sm"
                  >
                    {timeOptions.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveRecipient(index)}
                    className="h-10 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddRecipient}
              className="w-full h-10 rounded-lg border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
            >
              Add {formData.platform === 'paypal' ? 'Business' : 'Recipient'}
            </button>
          </div>

          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Style
            </label>
            <div className="space-y-4">
              {/* Preset Backgrounds */}
              <div className="grid grid-cols-5 gap-3">
                {wallpapers.map((wallpaper, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onChange('wallpaper', wallpaper);
                      onChange('customBackground', null);
                    }}
                    className={`
                      w-full aspect-square rounded-lg border-2 transition-all bg-cover bg-center
                      ${formData.wallpaper === wallpaper && !formData.customBackground
                        ? 'border-gray-900 scale-95'
                        : 'border-transparent hover:border-gray-200'
                      }
                    `}
                    style={{ backgroundImage: `url(${wallpaper})` }}
                  />
                ))}
              </div>

              {/* Custom Background Upload */}
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Or upload a custom background:
                </p>
                <BackgroundUploader
                  onBackgroundChange={(background) => {
                    onChange('customBackground', background);
                    onChange('wallpaper', '');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Mask {formData.platform === 'paypal' ? 'Business Names' : 'Email Addresses'}
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Hide {formData.platform === 'paypal' ? 'business names' : 'recipient email addresses'} in the preview
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maskEmails}
                onChange={(e) => onChange('maskEmails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}