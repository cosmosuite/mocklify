import { useState } from 'react';
import type { Platform, SocialMetrics } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  selectedPlatforms: Platform[];
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

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

export function MetricsEditor({ selectedPlatforms, metrics, onChange }: Props) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {selectedPlatforms.includes('facebook') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Likes/Reactions
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
              Time Ago (e.g., 2h, 1d)
            </label>
            <input
              type="text"
              value={metrics.timeAgo}
              onChange={(e) => onChange('timeAgo', e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
            />
          </div>
        </div>
      )}

      {selectedPlatforms.includes('twitter') && (
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
      )}

      {selectedPlatforms.includes('trustpilot') && (
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
              onChange={(e) => onChange('rating', parseInt(e.target.value) || 5)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Location
            </label>
            <select
              value={metrics.location}
              onChange={(e) => onChange('location', e.target.value)}
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
              onChange={(e) => onChange('usefulCount', parseInt(e.target.value) || 0)}
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
              onChange={(e) => onChange('reviewCount', parseInt(e.target.value) || 1)}
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
                onChange('dateOfExperience', formatted);
              }}
              className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
            />
          </div>
        </div>
      )}

      {selectedPlatforms.includes('email') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={metrics.senderName}
              onChange={(e) => onChange('senderName', e.target.value)}
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
              onChange={(e) => onChange('senderEmail', e.target.value)}
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
              onChange={(e) => onChange('subject', e.target.value)}
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
              onChange={(e) => onChange('timeAgo', e.target.value)}
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
              onChange={(e) => onChange('attachments', parseInt(e.target.value) || 0)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 bg-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={metrics.starred}
                onChange={(e) => onChange('starred', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-600">Starred</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={metrics.important}
                onChange={(e) => onChange('important', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm text-gray-600">Important</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}