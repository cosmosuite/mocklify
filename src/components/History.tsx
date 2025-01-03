import { useState, useEffect } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import type { GeneratedTestimonial, Platform } from '../types';
import { getTestimonials, getPaymentNotifications, deleteTestimonial, deletePaymentNotification } from '../utils/db';
import { KanbanBoard } from './KanbanBoard';

type ProjectGroup = {
  id: string;
  source: string;
  type: 'url' | 'description';
  testimonials: GeneratedTestimonial[];
};

export function History() {
  const [testimonials, setTestimonials] = useState<GeneratedTestimonial[]>([]);
  const [paymentNotifications, setPaymentNotifications] = useState<any[]>([]);
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'testimonials' | 'payments'>('testimonials');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'testimonials') {
        const data = await getTestimonials();
        console.log('Loaded testimonials:', data);
        setTestimonials(data);
      } else {
        const data = await getPaymentNotifications();
        console.log('Loaded payment notifications:', data);
        setPaymentNotifications(data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError(`Failed to load ${activeTab}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'testimonials') {
      groupTestimonials(testimonials);
    }
  }, [testimonials, searchQuery, selectedPlatform]);

  const groupTestimonials = (testimonials: GeneratedTestimonial[]) => {
    const groups = new Map<string, ProjectGroup>();

    testimonials.forEach(testimonial => {
      const productInfo = testimonial.productInfo || '';
      const isUrl = productInfo.startsWith('http://') || productInfo.startsWith('https://');
      const source = isUrl ? new URL(productInfo).hostname : productInfo;
      const id = isUrl ? source : `desc-${btoa(source).slice(0, 10)}`;

      if (!groups.has(id)) {
        groups.set(id, {
          id,
          source: isUrl ? source : productInfo,
          type: isUrl ? 'url' : 'description',
          testimonials: []
        });
      }

      groups.get(id)?.testimonials.push(testimonial);
    });

    const filteredGroups = Array.from(groups.values()).filter(group => {
      const matchesSearch = group.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = selectedPlatform === 'all' || 
        group.testimonials.some(t => t.platform === selectedPlatform);
      return matchesSearch && matchesPlatform;
    });

    setProjectGroups(filteredGroups);
  };

  const handleDelete = async (type: 'testimonial' | 'payment', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    try {
      if (type === 'testimonial') {
        await deleteTestimonial(id);
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        await deletePaymentNotification(id);
        setPaymentNotifications(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setError(`Failed to delete ${type}. Please try again.`);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center space-y-4 text-gray-500">
          <Loader2 size={24} className="animate-spin" />
          <p>Loading {activeTab}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'testimonials'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'payments'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Payment Notifications
            </button>
          </div>
        </div>

        {activeTab === 'testimonials' ? (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-400" />
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 bg-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="trustpilot">Trustpilot</option>
                </select>
              </div>
            </div>

            {/* Kanban Board */}
            <KanbanBoard
              testimonials={testimonials}
              onDelete={(id) => handleDelete('testimonial', id)}
              isDeleting={isDeleting}
            />
          </>
        ) : (
          <div className="grid gap-6">
            {paymentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize text-white" 
                        style={{
                          backgroundColor: notification.platform === 'stripe' ? '#635BFF' : '#003087'
                        }}
                      >
                        {notification.platform}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete('payment', notification.id)}
                      disabled={isDeleting === notification.id}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete notification"
                    >
                      {isDeleting === notification.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <PaymentCarousel notification={notification} />
                </div>
              </div>
            ))}

            {paymentNotifications.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <p>No payment notifications found</p>
                <p className="text-sm mt-1">Generate some notifications to see them here</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="fixed bottom-4 right-4 p-4 bg-red-50 border border-red-100 rounded-lg shadow-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}