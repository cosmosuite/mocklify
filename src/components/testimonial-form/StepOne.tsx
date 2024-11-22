import { AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { cn } from '../../lib/utils';
import type { Platform } from '../../types';
import { PlatformSelector } from './PlatformSelector';

interface Props {
  selectedPlatforms: Platform[];
  platformCounts: Record<Platform, number>;
  productInfo: string;
  websiteUrl: string;
  urlError: string;
  activeTab: 'url' | 'description';
  tone: 'positive' | 'neutral' | 'negative';
  onPlatformToggle: (platform: Platform) => void;
  onPlatformCountChange: (platform: Platform, value: string) => void;
  onProductInfoChange: (value: string) => void;
  onWebsiteUrlChange: (value: string) => void;
  onTabChange: (value: 'url' | 'description') => void;
  onToneChange: (value: 'positive' | 'neutral' | 'negative') => void;
  onNext: () => void;
}

export function StepOne({
  selectedPlatforms,
  platformCounts,
  productInfo,
  websiteUrl,
  urlError,
  activeTab,
  tone,
  onPlatformToggle,
  onPlatformCountChange,
  onProductInfoChange,
  onWebsiteUrlChange,
  onTabChange,
  onToneChange,
  onNext
}: Props) {
  return (
    <div className="space-y-6">
      {/* Platform Selection */}
      <PlatformSelector 
        selectedPlatforms={selectedPlatforms}
        platformCounts={platformCounts}
        onPlatformToggle={onPlatformToggle}
        onCountChange={onPlatformCountChange}
      />

      {/* Product Information Tabs */}
      <div className="space-y-2">
        <Tabs 
          defaultValue="url" 
          value={activeTab}
          onValueChange={(value) => onTabChange(value as 'url' | 'description')}
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
                onChange={(e) => onWebsiteUrlChange(e.target.value)}
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
              onChange={(e) => onProductInfoChange(e.target.value)}
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
                onChange={(e) => onToneChange(e.target.value as typeof tone)}
                className="sr-only"
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-gray-900 text-white h-11 px-8 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Step
      </button>
    </div>
  );
}