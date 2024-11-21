import { MessageSquareQuote, Bell } from 'lucide-react';

interface Props {
  currentView: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot';
}

export function Header({ currentView }: Props) {
  const getHeaderContent = () => {
    switch (currentView) {
      case 'generator':
        return {
          icon: MessageSquareQuote,
          title: 'Testimonial Generator',
          description: 'Create authentic-looking social media testimonials in seconds.'
        };
      case 'payment-screenshot':
        return {
          icon: Bell,
          title: 'Payment Notification Generator',
          description: 'Generate realistic payment notifications for various payment platforms.'
        };
      default:
        return null;
    }
  };

  const content = getHeaderContent();
  
  if (!content) return null;
  
  const Icon = content.icon;

  return (
    <header className="py-8 px-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-gray-100 rounded-xl">
            <Icon size={24} className="text-gray-900" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {content.title}
          </h1>
        </div>
        <p className="text-gray-500">
          {content.description}
        </p>
      </div>
    </header>
  );
}