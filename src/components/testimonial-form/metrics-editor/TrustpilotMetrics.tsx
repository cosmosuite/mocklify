import { useState } from 'react';
import { cn } from '../../../lib/utils';
import type { SocialMetrics } from '../../../types';

interface Props {
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

const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  return (
    <div className="flex space-x-0.5">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onMouseEnter={() => setHoverRating(rating)}
          onMouseLeave={() => setHoverRating(null)}
          onClick={() => onChange(rating)}
          className={`h-8 aspect-square transition-colors ${
            rating <= (hoverRating ?? value) ? 'bg-[#06b57a]' : 'bg-[#dcdce6]'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-full w-full text-white"
            fill="currentColor"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export function TrustpilotMetrics({ metrics, onChange }: Props) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-[1fr,120px] gap-4">
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Rating
        </label>
        <StarRating 
          value={metrics.rating || 4}
          onChange={(rating) => onChange('rating', rating)}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Location
        </label>
        <select
          value={metrics.location}
          onChange={(e) => onChange('location', e.target.value)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white",
            "outline-none transition-colors appearance-none",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        >
          {COUNTRY_CODES.map(country => (
            <option key={country.code} value={country.code}>
              {country.code}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-white mb-1">
          Useful Count
        </label>
        <input
          type="number"
          min="0"
          value={metrics.usefulCount}
          onChange={(e) => onChange('usefulCount', parseInt(e.target.value) || 0)}
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
          Reviews
        </label>
        <input
          type="number"
          min="1"
          value={metrics.reviewCount}
          onChange={(e) => onChange('reviewCount', parseInt(e.target.value) || 1)}
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-white mb-1">
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
          className={cn(
            "w-full h-9 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>
    </div>
  );
}