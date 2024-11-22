import { Facebook, Twitter, Star, Mail } from 'lucide-react';
import type { Platform } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  selectedPlatforms: Platform[];
  platformCounts: Record<Platform, number>;
  onPlatformToggle: (platform: Platform) => void;
  onCountChange: (platform: Platform, value: string) => void;
}

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter },
  { id: 'trustpilot', name: 'Trustpilot', icon: Star },
  { id: 'email', name: 'Email', icon: Mail }
] as const;

export function PlatformSelector({
  selectedPlatforms,
  platformCounts,
  onPlatformToggle,
  onCountChange
}: Props) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Choose Platforms
      </label>
      <div className="grid grid-cols-2 gap-4">
        {platforms.map(({ id, name, icon: Icon }) => {
          const isSelected = selectedPlatforms.includes(id as Platform);
          return (
            <div key={id} className="space-y-2">
              <button
                type="button"
                onClick={() => onPlatformToggle(id as Platform)}
                className={cn(
                  "relative flex items-center justify-center w-full h-12 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Icon 
                  size={20} 
                  className={isSelected ? "text-gray-900" : "text-gray-500"} 
                />
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  isSelected ? "text-gray-900" : "text-gray-500"
                )}>
                  {name}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-900 rounded-full" />
                )}
              </button>
              
              {isSelected && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Count:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={platformCounts[id as Platform]}
                    onChange={(e) => onCountChange(id as Platform, e.target.value)}
                    className="w-16 h-8 px-2 text-sm border border-gray-200 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                  />
                  <span className="text-xs text-gray-500">(max 5)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}