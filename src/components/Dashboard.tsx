import { MessageSquareQuote, ArrowRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Testimonial Generator Card */}
          <button 
            onClick={() => handleNavigate('generator')}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquareQuote className="w-5 h-5 text-gray-700" />
              </div>
              <div className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Testimonial Generator
            </h2>
            
            <p className="text-sm text-gray-500 mb-4">
              Create authentic-looking social media testimonials for Facebook, Twitter, and Trustpilot in seconds.
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                Facebook
              </div>
              <div className="px-2 py-1 rounded-full bg-black text-white text-xs font-medium">
                Twitter
              </div>
              <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                Trustpilot
              </div>
            </div>
          </button>

          {/* Payment Notification Generator Card */}
          <button 
            onClick={() => handleNavigate('payment-screenshot')}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg w-fit">
                <Bell className="w-5 h-5 text-gray-700" />
              </div>
              <div className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Payment Notification Generator
            </h2>
            
            <p className="text-sm text-gray-500 mb-4">
              Generate professional payment notifications for various payment platforms.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                Stripe
              </div>
              <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                PayPal
              </div>
              <div className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                Bank
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}