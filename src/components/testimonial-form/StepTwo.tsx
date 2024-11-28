import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Platform, SocialMetrics, GeneratedTestimonial } from '../../types';
import { MetricsEditor } from './metrics-editor';

interface Props {
  selectedPlatforms: Platform[];
  metrics: SocialMetrics;
  selectedTestimonial: GeneratedTestimonial | null;
  isLoading?: boolean;
  onMetricsChange: (field: keyof SocialMetrics, value: any) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function StepTwo({
  selectedPlatforms,
  metrics,
  selectedTestimonial,
  isLoading,
  onMetricsChange,
  onBack,
  onSubmit
}: Props) {
  const [localOpenPlatform, setLocalOpenPlatform] = useState<Platform | null>(selectedPlatforms[0] || null);

  const togglePlatform = (platform: Platform) => {
    setLocalOpenPlatform(current => current === platform ? null : platform);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleMetricsChange = (field: keyof SocialMetrics, value: any) => {
    onMetricsChange(field, value);
  };
  return (
    <div className="space-y-8">
      {/* Individual Platform Metrics */}
      <div className="space-y-4">
        {selectedPlatforms.map((platform) => (
          <div key={platform} className="border border-[#2F2F2F] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => togglePlatform(platform)}
              className={cn(
                "w-full flex items-center justify-between p-3 text-sm font-medium transition-colors",
                localOpenPlatform === platform 
                  ? "bg-[#CCFC7E] text-black"
                  : "bg-[#1F1F1F] text-white hover:bg-[#2F2F2F]"
              )}
            >
              <span className="capitalize">{platform} Metrics</span>
              {localOpenPlatform === platform ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {localOpenPlatform === platform && (
              <div className="p-4 bg-[#1F1F1F]">
                <MetricsEditor 
                  selectedPlatforms={[platform]}
                  metrics={metrics}
                  onChange={(field, value) => {
                    handleMetricsChange(field, value);
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          disabled={!!selectedTestimonial}
          onClick={onBack}
          className="flex-1 bg-[#1F1F1F] text-white h-11 px-8 rounded-lg font-medium hover:bg-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-[#CCFC7E] text-black h-11 px-8 rounded-lg font-medium hover:bg-[#B8E86E] focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Generating...
            </span>
          ) : (
            selectedTestimonial ? 'Update Metrics' : 'Generate Testimonial'
          )}
        </button>
      </div>
    </div>
  );
}