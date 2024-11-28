import { MessageSquareQuote, ArrowRight, Bell, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  // Get first name from user's name or email
  const getFirstName = () => {
    if (user?.user_metadata?.name) {
      return user.user_metadata.name.split(' ')[0];
    }
    return 'There';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-[#0F0F0F] mb-8">
          Hey {getFirstName()} 👋
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Testimonial Generator Card */}
          <button 
            onClick={() => handleNavigate('generator')}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0F0F0F] rounded-lg">
                <MessageSquareQuote className="w-5 h-5 text-[#CCFC7E]" />
              </div>
              <div className="p-1.5 text-gray-500 group-hover:text-gray-900 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Testimonial Thumbnail */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6747e1b6ca86fa4ef6464280.png"
                  alt="Testimonial Generator Preview" 
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-[#0F0F0F] mb-2">
              Social Testimonials
            </h2>
            
            <p className="text-sm text-gray-500 mb-4">
              Generate authentic social media testimonials for Facebook, Twitter, and Trustpilot.
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

          {/* Handwritten Testimonial Card */}
          <button 
            onClick={() => handleNavigate('handwritten')}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0F0F0F] rounded-lg">
                <PenTool className="w-5 h-5 text-[#CCFC7E]" />
              </div>
              <div className="p-1.5 text-gray-500 group-hover:text-gray-900 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Handwritten Thumbnail */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6747e1b66b2c4835a66e6693.png"
                  alt="Handwritten Notes Preview" 
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-[#0F0F0F] mb-2">
              Handwritten Notes
            </h2>
            
            <p className="text-sm text-gray-500 mb-4">
              Create authentic handwritten testimonials with custom styles and signatures.
            </p>
            
            <div className="flex items-center space-x-2">
              <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                5 Styles
              </div>
              <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                Customizable
              </div>
            </div>
          </button>

          {/* Payment Notification Generator Card */}
          <button 
            onClick={() => handleNavigate('payment-screenshot')}
            className="text-left bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#0F0F0F] rounded-lg w-fit">
                <Bell className="w-5 h-5 text-[#CCFC7E]" />
              </div>
              <div className="p-1.5 text-gray-500 group-hover:text-gray-900 rounded-full">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Payment Notification Thumbnail */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6747e1b6abf060062ad55696.png"
                  alt="Payment Screenshot Preview" 
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-[#0F0F0F] mb-2">
              Payment Notifications
            </h2>
            
            <p className="text-sm text-gray-500 mb-4">
              Generate professional payment notifications for various platforms.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                Stripe
              </div>
              <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                PayPal
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}