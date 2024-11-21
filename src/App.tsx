import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TestimonialForm } from './components/TestimonialForm';
import { TestimonialList } from './components/TestimonialList';
import { History } from './components/History';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { PaymentScreenshot } from './components/PaymentScreenshot';
import { AuthModal } from './components/auth/AuthModal';
import { saveTestimonial } from './utils/db';
import { generateTestimonial } from './utils/testimonialGenerator';
import { downloadSingleTestimonial } from './utils/download';
import type { GeneratedTestimonial, TestimonialForm as TestimonialFormType } from './types';
import { runAllTests } from './utils/testDb';

// Run tests on startup
runAllTests().catch(console.error);

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState<GeneratedTestimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: TestimonialFormType) => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateTestimonial(form);
      await saveTestimonial(generated, form);
      setCurrentTestimonials(prev => [generated, ...prev]);
      return generated;
    } catch (error) {
      console.error('Failed to generate testimonial:', error);
      setError('Failed to generate testimonial. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    alert('Edit functionality would be implemented here');
  };

  const handleDownload = async (testimonial: GeneratedTestimonial) => {
    await downloadSingleTestimonial(testimonial);
  };

  const handleViewChange = (view: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot') => {
    if (view !== currentView) {
      setCurrentTestimonials([]);
    }
    setCurrentView(view);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 flex flex-col min-w-0 ml-16">
        {['generator', 'payment-screenshot'].includes(currentView) && (
          <Header currentView={currentView} />
        )}
        
        <div className="flex-1 bg-gray-50">
          {error && (
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {currentView === 'dashboard' ? (
            <Dashboard onNavigate={handleViewChange} />
          ) : currentView === 'generator' ? (
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex gap-8">
                <div className="w-[400px] flex-shrink-0">
                  <div className="sticky top-8">
                    <TestimonialForm onSubmit={handleSubmit} isLoading={isLoading} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {currentTestimonials.length > 0 || isLoading ? (
                    <TestimonialList
                      testimonials={currentTestimonials}
                      onEdit={handleEdit}
                      onDownload={handleDownload}
                      isLoading={isLoading}
                    />
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                      <p className="text-gray-500">
                        Generated testimonials will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : currentView === 'history' ? (
            <History />
          ) : currentView === 'payment-screenshot' ? (
            <PaymentScreenshot />
          ) : (
            <Settings />
          )}
        </div>
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}