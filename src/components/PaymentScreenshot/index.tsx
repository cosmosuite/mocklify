import { useState } from 'react';
import { Download, Save, Loader2 } from 'lucide-react';
import { NotificationForm } from './NotificationForm';
import { StripeNotification } from './notifications/StripeNotification';
import { PayPalNotification } from './notifications/PayPalNotification';
import { downloadScreenshot } from '../../utils/downloadImage';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCreditsBalance, useCredits } from '../../lib/tokens';
import { cn } from '../../lib/utils';
import { savePaymentNotification } from '../../utils/db';

// Curated collection of high-quality backgrounds
const wallpapers = [
  'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/673f36047776d5b7c48b5254.jpeg',
  'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/673f37b5569467324d5d4218.jpeg',
  'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/673f37b5387fff7a493e6528.jpeg',
  'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/673f37b5569467f7f45d4219.jpeg',
  'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/673f37b556946729bc5d4217.jpeg'
];

interface FormData {
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
}

export function PaymentScreenshot() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    platform: 'stripe',
    stripeRecipients: [
      {
        identifier: 'customer@example.com',
        amount: '499.99',
        timestamp: '2m ago'
      },
      {
        identifier: 'client@business.com',
        amount: '299.99',
        timestamp: '15m ago'
      },
      {
        identifier: 'user@company.net',
        amount: '199.99',
        timestamp: '1h ago'
      }
    ],
    paypalRecipients: [
      {
        identifier: 'Digital Solutions LLC',
        amount: '499.99',
        timestamp: '2m ago'
      },
      {
        identifier: 'Tech Innovations Co',
        amount: '299.99',
        timestamp: '15m ago'
      },
      {
        identifier: 'Global Services Inc',
        amount: '199.99',
        timestamp: '1h ago'
      }
    ],
    currency: 'USD',
    wallpaper: wallpapers[0],
    maskEmails: false,
    customBackground: null
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getBackgroundStyle = () => {
    if (formData.customBackground) {
      return {
        backgroundImage: `url(${formData.customBackground})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      };
    }
    return {
      backgroundImage: `url(${formData.wallpaper})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    };
  };

  const handleSave = async () => {
    if (!user) {
      setError('Please sign in to save notifications');
      return;
    }

    const creditsBalance = await getUserCreditsBalance(user.id);
    if (creditsBalance === null || creditsBalance < 1) {
      setError('Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await savePaymentNotification(formData);
      await useCredits(user.id);
      setSuccessMessage('Payment notification saved successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setError('Failed to save notification. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      setError('Please sign in to download notifications');
      return;
    }

    const creditsBalance = await getUserCreditsBalance(user.id);
    if (creditsBalance === null || creditsBalance < 1) {
      setError('Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setIsDownloading(true);
    setError(null);
    try {
      await downloadScreenshot(formData.platform);
      await useCredits(user.id);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const NotificationComponent = formData.platform === 'stripe' 
    ? StripeNotification 
    : PayPalNotification;

  const hasNotifications = (formData.platform === 'stripe' ? formData.stripeRecipients : formData.paypalRecipients).length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <NotificationForm 
              formData={formData}
              onChange={handleFormChange}
              wallpapers={wallpapers}
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-sm text-green-600">{successMessage}</p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div>
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preview
                  </h2>
                  
                  {hasNotifications && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                          "inline-flex items-center justify-center h-9 px-4 rounded-lg font-medium text-sm transition-colors",
                          "bg-gray-900 text-white hover:bg-gray-800",
                          "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 size={14} className="animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={14} className="mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={cn(
                          "inline-flex items-center justify-center h-9 px-4 rounded-lg font-medium text-sm transition-colors",
                          "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50",
                          "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                          "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 size={14} className="animate-spin mr-2" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download size={14} className="mr-2" />
                            Download
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div 
                  className="w-[398px] h-[862px] mx-auto rounded-[2.5rem] overflow-hidden relative"
                  id="payment-screenshot-preview"
                  style={getBackgroundStyle()}
                >
                  <div className="absolute top-1/3 inset-x-0 px-4">
                    <div className="space-y-1.5">
                      {(formData.platform === 'stripe' ? formData.stripeRecipients : formData.paypalRecipients)
                        .map((recipient, index) => (
                          <NotificationComponent
                            key={index}
                            amount={recipient.amount}
                            currency={formData.currency}
                            recipient={recipient.identifier}
                            timestamp={recipient.timestamp}
                            masked={formData.maskEmails}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}