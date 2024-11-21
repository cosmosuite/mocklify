import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { StripeNotification } from './PaymentScreenshot/notifications/StripeNotification';
import { PayPalNotification } from './PaymentScreenshot/notifications/PayPalNotification';
import { cn } from '../lib/utils';
import { downloadScreenshot } from '../utils/downloadImage';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  notification: {
    id: string;
    platform: 'stripe' | 'paypal';
    currency: string;
    recipients: Array<{
      identifier: string;
      amount: string;
      timestamp: string;
    }>;
    wallpaper: string;
  };
}

export function PaymentCarousel({ notification }: Props) {
  const NotificationComponent = notification.platform === 'stripe' 
    ? StripeNotification 
    : PayPalNotification;

  const handleDownload = async () => {
    try {
      await downloadScreenshot(notification.platform);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="relative">
      <div className="max-w-[600px] mx-auto">
        <div className="w-full">
          <div 
            id="payment-screenshot-preview"
            className="relative w-[398px] h-[862px] mx-auto rounded-[2.5rem] overflow-hidden"
            style={{ 
              background: notification.wallpaper,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-1/3 inset-x-0 px-4">
              <div className="space-y-1.5">
                {notification.recipients.map((recipient, index) => (
                  <NotificationComponent
                    key={index}
                    amount={recipient.amount}
                    currency={notification.currency}
                    recipient={recipient.identifier}
                    timestamp={recipient.timestamp}
                    masked={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors z-10"
          title="Download as image"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}