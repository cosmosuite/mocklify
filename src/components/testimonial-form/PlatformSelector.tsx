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
      <label className="text-sm font-medium text-white">
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
                  "relative flex items-center justify-center w-full h-14 rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-[#CCFC7E] bg-[#1F1F1F]"
                    : "border-[#2F2F2F] hover:border-[#3F3F3F]"
                )}
              >
                <Icon 
                  size={20} 
                  className={isSelected ? "text-[#CCFC7E]" : "text-gray-400"} 
                />
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  isSelected ? "text-[#CCFC7E]" : "text-gray-400"
                )}>
                  {name}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#CCFC7E] rounded-full" />
                )}
              </button>
              
              {isSelected && (
                <div className="flex items-center space-x-2 px-2">
                  <label className="text-sm text-gray-400">Count:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={platformCounts[id as Platform]}
                    onChange={(e) => onCountChange(id as Platform, e.target.value)}
                    className="w-16 h-8 px-2 text-sm border border-[#2F2F2F] bg-[#1F1F1F] text-white rounded-md focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]"
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