import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import type { Platform, SocialMetrics } from '../../types';
import { MetricsEditor } from './MetricsEditor';
import { cn } from '../../lib/utils';

interface Props {
  selectedPlatforms: Platform[];
  metrics: SocialMetrics;
  isLoading?: boolean;
  onMetricsChange: (field: keyof SocialMetrics, value: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function StepTwo({
  selectedPlatforms,
  metrics,
  isLoading,
  onMetricsChange,
  onBack,
  onSubmit
}: Props) {
  // Only keep one platform open at a time
  const [openPlatform, setOpenPlatform] = useState<Platform | null>(
    selectedPlatforms[0] || null
  );

  const togglePlatform = (platform: Platform) => {
    setOpenPlatform(current => current === platform ? null : platform);
  };

  return (
    <div className="space-y-6">
      {/* Individual Platform Metrics */}
      <div className="space-y-4">
        {selectedPlatforms.map((platform) => (
          <div key={platform} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => togglePlatform(platform)}
              className={cn(
                "w-full flex items-center justify-between p-3 text-sm font-medium transition-colors",
                openPlatform === platform 
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-900 hover:bg-gray-100"
              )}
            >
              <span className="capitalize">{platform} Metrics</span>
              {openPlatform === platform ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {openPlatform === platform && (
              <div className="p-4 bg-white">
                <MetricsEditor 
                  selectedPlatforms={[platform]}
                  metrics={metrics}
                  onChange={onMetricsChange}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-900 h-11 px-8 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-gray-900 text-white h-11 px-8 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Generating...
            </span>
          ) : (
            'Generate Testimonials'
          )}
        </button>
      </div>
    </div>
  );
}