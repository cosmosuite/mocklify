import { cn } from '../../../lib/utils';
import type { SocialMetrics } from '../../../types';

interface Props {
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

export function TwitterMetrics({ metrics, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Likes
        </label>
        <input
          type="number"
          min="0"
          value={metrics.likes}
          onChange={(e) => onChange('likes', parseInt(e.target.value) || 0)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Comments
        </label>
        <input
          type="number"
          min="0"
          value={metrics.comments}
          onChange={(e) => onChange('comments', parseInt(e.target.value) || 0)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Retweets
        </label>
        <input
          type="number"
          min="0"
          value={metrics.retweets}
          onChange={(e) => onChange('retweets', parseInt(e.target.value) || 0)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Views
        </label>
        <input
          type="number"
          min="0"
          value={metrics.views}
          onChange={(e) => onChange('views', parseInt(e.target.value) || 0)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Time Ago (e.g., 2h, 1d)
        </label>
        <input
          type="text"
          value={metrics.timeAgo}
          onChange={(e) => onChange('timeAgo', e.target.value)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="verified"
          checked={metrics.isVerified}
          onChange={(e) => onChange('isVerified', e.target.checked)}
          className="h-4 w-4 rounded border-[#2F2F2F] bg-[#1F1F1F] text-[#CCFC7E] focus:ring-[#CCFC7E] focus:ring-offset-[#0F0F0F]"
        />
        <label htmlFor="verified" className="text-sm text-white">
          Verified Account
        </label>
      </div>
    </div>
  );
}