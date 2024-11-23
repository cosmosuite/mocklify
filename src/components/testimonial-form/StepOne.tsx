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
    <div className="space-y-8">
      {/* Platform Selection */}
      <PlatformSelector 
        selectedPlatforms={selectedPlatforms}
        platformCounts={platformCounts}
        onPlatformToggle={onPlatformToggle}
        onCountChange={onPlatformCountChange}
      />

      {/* Product Information Tabs */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Product Information
        </label>
        <Tabs 
          defaultValue="url" 
          value={activeTab}
          onValueChange={(value) => onTabChange(value as 'url' | 'description')}
          className="w-full"
        >
          <TabsList className="w-full bg-[#1F1F1F] p-1">
            <TabsTrigger 
              value="url" 
              className="flex-1 text-sm text-gray-400 data-[state=active]:bg-[#CCFC7E] data-[state=active]:text-black"
            >
              Website URL
            </TabsTrigger>
            <TabsTrigger 
              value="description" 
              className="flex-1 text-sm text-gray-400 data-[state=active]:bg-[#CCFC7E] data-[state=active]:text-black"
            >
              Description
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <div className="space-y-2">
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => onWebsiteUrlChange(e.target.value)}
                placeholder="Enter your website URL (e.g., https://example.com)"
                className={cn(
                  "w-full h-12 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
                  "outline-none transition-colors",
                  "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
                  urlError ? "border-red-500" : "border-[#2F2F2F]"
                )}
              />
              {urlError && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  <span>{urlError}</span>
                </div>
              )}
              <p className="text-sm text-gray-400">
                We'll analyze your website to generate relevant testimonials.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-4">
            <textarea
              value={productInfo}
              onChange={(e) => onProductInfoChange(e.target.value)}
              placeholder="Describe your product or service in detail..."
              className={cn(
                "w-full h-32 rounded-lg border bg-[#1F1F1F] px-4 py-3 text-sm text-white placeholder:text-gray-500",
                "outline-none transition-colors resize-none",
                "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
                "border-[#2F2F2F]"
              )}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tone Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Testimonial Tone
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(['positive', 'neutral', 'negative'] as const).map((t) => (
            <label
              key={t}
              className={cn(
                "flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-colors",
                tone === t
                  ? "bg-[#1F1F1F] border-[#CCFC7E] text-[#CCFC7E]"
                  : "border-[#2F2F2F] text-gray-400 hover:border-[#3F3F3F]"
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
        className={cn(
          "w-full h-12 rounded-lg font-medium transition-colors",
          "bg-[#CCFC7E] text-black hover:bg-[#B8E86E]",
          "focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Next Step
      </button>
    </div>
  );
}