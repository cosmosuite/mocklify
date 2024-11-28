import { useState, useEffect } from 'react';
import type { Platform, TestimonialForm as TestimonialFormType, SocialMetrics } from '../../types';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';
import { GeneratedTestimonial } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  onSubmit: (form: TestimonialFormType) => void;
  selectedTestimonial: GeneratedTestimonial | null;
  onMetricsUpdate: (id: string, metrics: SocialMetrics) => void;
  isLoading?: boolean;
}

const defaultMetrics: SocialMetrics = {
  likes: 42,
  comments: 5,
  retweets: 12,
  timeAgo: '2h',
  bookmarks: 3,
  reactions: ['like', 'love'],
  views: 1200,
  isVerified: false,
  rating: 4,
  usefulCount: 8,
  dateOfExperience: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }),
  location: 'US',
  reviewCount: 1,
  subject: 'Exceptional Experience with Your Product',
  starred: false,
  important: false,
  senderName: 'John Smith'
};

export function TestimonialForm({ onSubmit, selectedTestimonial, onMetricsUpdate, isLoading }: Props) {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['facebook']);
  const [productInfo, setProductInfo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'description'>('url');
  const [tone, setTone] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [platformCounts, setPlatformCounts] = useState<Record<Platform, number>>({
    facebook: 1,
    twitter: 1,
    trustpilot: 1,
    email: 1
  });
  const [metrics, setMetrics] = useState<SocialMetrics>(defaultMetrics);
  const [openPlatform, setOpenPlatform] = useState<Platform | null>(null);

  // Update metrics when selected testimonial changes
  useEffect(() => {
    if (selectedTestimonial) {
      setMetrics(selectedTestimonial.metrics);
    }
  }, [selectedTestimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTestimonial) {
      // Update metrics for selected testimonial
      onMetricsUpdate(selectedTestimonial.id, metrics);
      // Keep the form in editing state
      return;
    }

    if ((!productInfo.trim() && !websiteUrl.trim()) || selectedPlatforms.length === 0) {
      return;
    }

    // Generate testimonials for each selected platform based on count
    for (const platform of selectedPlatforms) {
      const count = platformCounts[platform];
      for (let i = 0; i < count; i++) {
        const form: TestimonialFormType = {
          platform,
          productInfo: activeTab === 'url' ? websiteUrl : productInfo,
          tone,
          metrics: {
            ...metrics,
            timeAgo: platform === 'email' 
              ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : `${Math.floor(Math.random() * 24)}h`
          }
        };
        
        try {
          await onSubmit(form);
        } catch (error) {
          console.error('Failed to generate testimonial:', error);
        }
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlError('');
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
    }
    setWebsiteUrl(url);
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => {
      const isSelected = prev.includes(platform);
      if (isSelected) {
        if (prev.length === 1) return prev;
        return prev.filter(p => p !== platform);
      }
      return [...prev, platform];
    });
  };

  const handlePlatformCountChange = (platform: Platform, value: string) => {
    const count = parseInt(value) || 1;
    setPlatformCounts(prev => ({
      ...prev,
      [platform]: Math.min(Math.max(count, 1), 5) // Limit between 1 and 5
    }));
  };

  const handleMetricsChange = (field: keyof SocialMetrics, value: any) => {
    const updatedMetrics = {
      ...metrics,
      [field]: value
    };
    
    setMetrics(updatedMetrics);
    
    // Always propagate changes immediately
    if (selectedTestimonial) {
      onMetricsUpdate(selectedTestimonial.id, updatedMetrics);
    }
  };

  useEffect(() => {
    if (selectedTestimonial) {
      setStep(2); // Show metrics editor
      setSelectedPlatforms([selectedTestimonial.platform]);
      setMetrics(selectedTestimonial.metrics);
      // Auto-expand metrics editor for selected platform
      setOpenPlatform(selectedTestimonial.platform);
    } else {
      // Reset form to initial state when deselecting
      setStep(1);
      setSelectedPlatforms(['facebook']);
      setMetrics(defaultMetrics);
      setOpenPlatform(null);
    }
  }, [selectedTestimonial]);

  return (
    <form onSubmit={handleSubmit} className="bg-[#0F0F0F] p-6 rounded-xl shadow-sm border border-[#1F1F1F]">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center w-full">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 1 ? "bg-[#CCFC7E] text-black" : "bg-[#1F1F1F] text-gray-400"
          )}>
            1
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-[#1F1F1F]" />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 2 ? "bg-[#CCFC7E] text-black" : "bg-[#1F1F1F] text-gray-400"
          )}>
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <StepOne 
          selectedPlatforms={selectedPlatforms}
          platformCounts={platformCounts}
          productInfo={productInfo}
          websiteUrl={websiteUrl}
          urlError={urlError}
          activeTab={activeTab}
          tone={tone}
          onPlatformToggle={togglePlatform}
          onPlatformCountChange={handlePlatformCountChange}
          onProductInfoChange={setProductInfo}
          onWebsiteUrlChange={handleUrlChange}
          onTabChange={(value) => setActiveTab(value)}
          onToneChange={setTone}
          onNext={() => setStep(2)}
        />
      ) : (
        <StepTwo 
          selectedPlatforms={selectedPlatforms}
          metrics={metrics}
          selectedTestimonial={selectedTestimonial}
          isLoading={isLoading}
          onMetricsChange={handleMetricsChange}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </form>
  );
}