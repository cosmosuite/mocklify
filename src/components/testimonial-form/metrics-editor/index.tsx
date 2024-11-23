import type { Platform, SocialMetrics } from '../../../types';
import { FacebookMetrics } from './FacebookMetrics';
import { TwitterMetrics } from './TwitterMetrics';
import { TrustpilotMetrics } from './TrustpilotMetrics';
import { EmailMetrics } from './EmailMetrics';

interface Props {
  selectedPlatforms: Platform[];
  metrics: SocialMetrics;
  onChange: (field: keyof SocialMetrics, value: any) => void;
}

// Default metrics to prevent uncontrolled to controlled warnings
export const defaultMetrics: SocialMetrics = {
  likes: 0,
  comments: 0,
  retweets: 0,
  timeAgo: '2h',
  bookmarks: 0,
  reactions: ['like'],
  views: 0,
  isVerified: false,
  rating: 4,
  usefulCount: 0,
  dateOfExperience: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }),
  location: 'US',
  reviewCount: 1,
  subject: '',
  starred: false,
  important: false,
  senderName: ''
};

export function MetricsEditor({ selectedPlatforms, metrics: rawMetrics, onChange }: Props) {
  // Merge provided metrics with defaults to ensure all fields have values
  const metrics = { ...defaultMetrics, ...rawMetrics };

  return (
    <div className="space-y-4">
      {selectedPlatforms.includes('facebook') && (
        <FacebookMetrics metrics={metrics} onChange={onChange} />
      )}
      {selectedPlatforms.includes('twitter') && (
        <TwitterMetrics metrics={metrics} onChange={onChange} />
      )}
      {selectedPlatforms.includes('trustpilot') && (
        <TrustpilotMetrics metrics={metrics} onChange={onChange} />
      )}
      {selectedPlatforms.includes('email') && (
        <EmailMetrics metrics={metrics} onChange={onChange} />
      )}
    </div>
  );
}