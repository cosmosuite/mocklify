import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { SocialMetrics, FacebookReaction } from '../../../types';

interface Props {
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

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

export function FacebookMetrics({ metrics, onChange }: Props) {
  const defaultMetrics = {
    likes: 0,
    reactions: ['like'],
    timeAgo: '2h'
  };

  // Merge with defaults to ensure all fields have values
  const currentMetrics = { ...defaultMetrics, ...metrics };

  const handleChange = (field: keyof SocialMetrics, value: any) => {
    // Immediately propagate changes
    onChange(field, value);
  };

  const currentReactions = currentMetrics.reactions;
  const hasMaxReactions = currentReactions.length >= 3;

  const toggleReaction = (e: React.MouseEvent, reaction: FacebookReaction) => {
    e.preventDefault();
    e.stopPropagation();

    const newReactions: FacebookReaction[] = [...(metrics.reactions || [])];
    const reactionIndex = newReactions.indexOf(reaction);

    if (reactionIndex > -1) {
      newReactions.splice(reactionIndex, 1);
      if (newReactions.length === 0) newReactions.push('like');
    } else if (newReactions.length < 3) {
      newReactions.push(reaction);
    }

    handleChange('reactions', newReactions);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-white mb-1">
            Likes Count
          </label>
          <input
            type="number"
            min="0"
            value={currentMetrics.likes}
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
            Time Ago (e.g., 2h, 1d)
          </label>
          <input
            type="text"
            value={currentMetrics.timeAgo}
            onChange={(e) => onChange('timeAgo', e.target.value)}
            className={cn(
              "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
              "outline-none transition-colors",
              "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
              "border-[#2F2F2F]"
            )}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-white mb-2">
          Reactions (max 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {FACEBOOK_REACTIONS.map(({ value, icon, label }) => {
            const isSelected = currentReactions.includes(value);
            const isDisabled = hasMaxReactions && !isSelected;
            
            return (
              <button
                key={value}
                type="button"
                onClick={(e) => toggleReaction(e, value)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center space-x-1.5 px-2 py-1.5 rounded-full border transition-all",
                  isSelected
                    ? "border-[#CCFC7E] bg-[#1F1F1F] text-[#CCFC7E]"
                    : "border-[#2F2F2F] hover:border-[#3F3F3F] text-gray-400",
                  isDisabled && "opacity-40 cursor-not-allowed hover:border-[#2F2F2F]"
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
        <p className="mt-1.5 text-xs text-gray-400">
          Click to toggle reactions. First reaction will be the primary one.
        </p>
      </div>
    </div>
  );
}