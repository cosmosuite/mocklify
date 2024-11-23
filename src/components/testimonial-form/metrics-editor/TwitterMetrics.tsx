import type { SocialMetrics } from '../../../types';

interface Props {
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

export function TwitterMetrics({ metrics, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Likes
        </label>
        <input
          type="number"
          min="0"
          value={metrics.likes}
          onChange={(e) => onChange('likes', parseInt(e.target.value) || 0)}
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
          onChange={(e) => onChange('comments', parseInt(e.target.value) || 0)}
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
          onChange={(e) => onChange('retweets', parseInt(e.target.value) || 0)}
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
          onChange={(e) => onChange('views', parseInt(e.target.value) || 0)}
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
          onChange={(e) => onChange('timeAgo', e.target.value)}
          className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="verified"
          checked={metrics.isVerified}
          onChange={(e) => onChange('isVerified', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
        />
        <label htmlFor="verified" className="text-sm text-gray-600">
          Verified Account
        </label>
      </div>
    </div>
  );
}