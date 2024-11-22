import { useState } from 'react';
import type { Platform, SocialMetrics, FacebookReaction } from '../../types';
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

const FACEBOOK_REACTIONS: { value: FacebookReaction; icon: string; label: string }[] = [
  { 
    value: 'like',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bfbba5760ae59b82a.png',
    label: 'Like'
  },
  {
    value: 'love',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bbac6c2d6458b001a.png',
    label: 'Love'
  },
  {
    value: 'care',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bd6b97e1600a0efee.png',
    label: 'Care'
  },
  {
    value: 'haha',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130cc621bcf19075bbe7.png',
    label: 'Haha'
  },
  {
    value: 'wow',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130be7467649de1b8625.png',
    label: 'Wow'
  },
  {
    value: 'sad',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130cc621bc521475bbe6.png',
    label: 'Sad'
  },
  {
    value: 'angry',
    icon: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741130bbbab9f92d299ec36.png',
    label: 'Angry'
  }
];

export function MetricsEditor({ selectedPlatforms, metrics, onChange }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const currentReactions = metrics.reactions || ['like'];
  const hasMaxReactions = currentReactions.length >= 3;

  const toggleReaction = (e: React.MouseEvent, reaction: FacebookReaction) => {
    // Prevent form submission
    e.preventDefault();
    e.stopPropagation();

    const newReactions: FacebookReaction[] = [...(metrics.reactions || [])];
    const reactionIndex = newReactions.indexOf(reaction);

    if (reactionIndex > -1) {
      // Remove reaction if it exists
      newReactions.splice(reactionIndex, 1);
      // Always keep at least one reaction (like)
      if (newReactions.length === 0) newReactions.push('like');
    } else if (newReactions.length < 3) {
      // Add reaction if under limit
      newReactions.push(reaction);
    }

    onChange('reactions', newReactions);
  };

  return (
    <div className="space-y-4">
      {selectedPlatforms.includes('facebook') && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Likes Count
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

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Reactions (max 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {FACEBOOK_REACTIONS.map(({ value, icon, label }) => {
                const isSelected = currentReactions.includes(value);
                const isDisabled = hasMaxReactions && !isSelected;
                
                return (
                  <button
                    key={value}
                    type="button" // Prevent form submission
                    onClick={(e) => toggleReaction(e, value)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center space-x-1.5 px-2 py-1.5 rounded-full border transition-all",
                      isSelected
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700",
                      isDisabled && "opacity-40 cursor-not-allowed hover:border-gray-200"
                    )}
                  >
                    <img 
                      src={icon}
                      alt={label}
                      className={cn(
                        "w-5 h-5 object-contain transition-opacity",
                        isDisabled && "opacity-40"
                      )}
                    />
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Click to toggle reactions. First reaction will be the primary one.
            </p>
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