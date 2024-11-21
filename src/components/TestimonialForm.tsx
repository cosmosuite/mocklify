import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, Facebook, Twitter, Star, AlertCircle, Mail } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import type { Platform, TestimonialForm as TestimonialFormType, SocialMetrics } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onSubmit: (form: TestimonialFormType) => void;
  isLoading?: boolean;
}

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter },
  { id: 'trustpilot', name: 'Trustpilot', icon: Star },
  { id: 'email', name: 'Email', icon: Mail }
] as const;

const COUNTRY_CODES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'IN', name: 'India' }
].sort((a, b) => a.name.localeCompare(b.name));

// Get today's date formatted for the date input
const today = new Date().toISOString().split('T')[0];

export function TestimonialForm({ onSubmit, isLoading }: Props) {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['facebook']);
  const [productInfo, setProductInfo] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'description'>('url');
  const [tone, setTone] = useState<'positive' | 'neutral' | 'negative'>('positive');
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [metrics, setMetrics] = useState<SocialMetrics>({
    likes: 42,
    comments: 5,
    retweets: 12,
    timeAgo: '2h',
    bookmarks: 3,
    reactions: ['like', 'love'],
    views: 1200,
    isVerified: false,
    rating: 5,
    usefulCount: 8,
    dateOfExperience: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }),
    location: 'US',
    reviewCount: 1,
    subject: 'Exceptional Experience with Your Product',
    attachments: 0,
    starred: false,
    important: false,
    senderName: 'John Smith',
    senderEmail: 'john.smith@example.com'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!productInfo.trim() && !websiteUrl.trim()) || selectedPlatforms.length === 0) return;
    
    for (const platform of selectedPlatforms) {
      const form = {
        platform,
        productInfo: activeTab === 'url' ? websiteUrl : productInfo,
        tone,
        metrics
      };
      
      try {
        await onSubmit(form);
      } catch (error) {
        console.error('Failed to generate testimonial:', error);
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center w-full">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 1 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
          )}>
            1
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-gray-200" />
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-medium",
            step === 2 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
          )}>
            2
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Choose Platforms
            </label>
            <div className="flex gap-4">
              {platforms.map(({ id, name, icon: Icon }) => {
                const isSelected = selectedPlatforms.includes(id as Platform);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => togglePlatform(id as Platform)}
                    className={cn(
                      "relative flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all",
                      isSelected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon 
                      size={20} 
                      className={isSelected ? "text-gray-900" : "text-gray-500"} 
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-900 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="space-y-2">
            <Tabs 
              defaultValue="url" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'url' | 'description')}
              className="w-full"
            >
              <TabsList className="w-full">
                <TabsTrigger value="url" className="flex-1">Website URL</TabsTrigger>
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <div className="space-y-2">
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    className={cn(
                      "w-full h-11 rounded-lg border bg-white px-3 py-2 text-sm outline-none hover:border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-100",
                      urlError ? "border-red-300" : "border-gray-200"
                    )}
                  />
                  {urlError && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm">
                      <AlertCircle size={16} />
                      <span>{urlError}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    We'll analyze your website to generate relevant testimonials.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="description">
                <textarea
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  placeholder="Describe your product or service in detail..."
                  className="w-full h-32 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none hover:border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-100 resize-none"
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Testimonial Tone
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['positive', 'neutral', 'negative'] as const).map((t) => (
                <label
                  key={t}
                  className={cn(
                    "flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                    tone === t
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    value={t}
                    checked={tone === t}
                    onChange={(e) => setTone(e.target.value as typeof tone)}
                    className="sr-only"
                  />
                  <span className="capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full bg-gray-900 text-white h-11 px-8 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics Customization */}
          <div>
            <button
              type="button"
              onClick={() => setIsMetricsOpen(!isMetricsOpen)}
              className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Customize Metrics</span>
              {isMetricsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isMetricsOpen && (
              <div className="mt-4 space-y-4">
                {selectedPlatforms.includes('twitter') && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-900">Twitter Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Likes
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.likes}
                          onChange={(e) => setMetrics(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Comments
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.comments}
                          onChange={(e) => setMetrics(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Retweets
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.retweets}
                          onChange={(e) => setMetrics(prev => ({ ...prev, retweets: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Views
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.views}
                          onChange={(e) => setMetrics(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Time Ago (e.g., 2h, 1d)
                        </label>
                        <input
                          type="text"
                          value={metrics.timeAgo}
                          onChange={(e) => setMetrics(prev => ({ ...prev, timeAgo: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={metrics.isVerified}
                          onChange={(e) => setMetrics(prev => ({ ...prev, isVerified: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <label htmlFor="verified" className="text-sm text-gray-600">
                          Verified Account
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes('facebook') && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-900">Facebook Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Likes/Reactions
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.likes}
                          onChange={(e) => setMetrics(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Time Ago (e.g., 2h, 1d)
                        </label>
                        <input
                          type="text"
                          value={metrics.timeAgo}
                          onChange={(e) => setMetrics(prev => ({ ...prev, timeAgo: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes('trustpilot') && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-900">Trustpilot Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={metrics.rating}
                          onChange={(e) => setMetrics(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Location
                        </label>
                        <select
                          value={metrics.location}
                          onChange={(e) => setMetrics(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        >
                          {COUNTRY_CODES.map(country => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Useful Count
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.usefulCount}
                          onChange={(e) => setMetrics(prev => ({ ...prev, usefulCount: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Review Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={metrics.reviewCount}
                          onChange={(e) => setMetrics(prev => ({ ...prev, reviewCount: parseInt(e.target.value) || 1 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Date of Experience
                        </label>
                        <input
                          type="date"
                          defaultValue={today}
                          max={today}
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            const formatted = date.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            });
                            setMetrics(prev => ({ ...prev, dateOfExperience: formatted }));
                          }}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlatforms.includes('email') && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm text-gray-900">Email Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sender Name
                        </label>
                        <input
                          type="text"
                          value={metrics.senderName}
                          onChange={(e) => setMetrics(prev => ({ ...prev, senderName: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                          placeholder="Enter sender name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Sender Email
                        </label>
                        <input
                          type="email"
                          value={metrics.senderEmail}
                          onChange={(e) => setMetrics(prev => ({ ...prev, senderEmail: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                          placeholder="Enter sender email"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={metrics.subject}
                          onChange={(e) => setMetrics(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                          placeholder="Enter email subject"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Time Ago (e.g., 2h, 1d)
                        </label>
                        <input
                          type="text"
                          value={metrics.timeAgo}
                          onChange={(e) => setMetrics(prev => ({ ...prev, timeAgo: e.target.value }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Attachments
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={metrics.attachments}
                          onChange={(e) => setMetrics(prev => ({ ...prev, attachments: parseInt(e.target.value) || 0 }))}
                          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={metrics.starred}
                            onChange={(e) => setMetrics(prev => ({ ...prev, starred: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-600">Starred</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={metrics.important}
                            onChange={(e) => setMetrics(prev => ({ ...prev, important: e.target.checked }))}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="text-sm text-gray-600">Important</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-100 text-gray-900 h-11 px-8 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gray-900 text-white h-11 px-8 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Generating...
                </span>
              ) : (
                'Generate Testimonial'
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}