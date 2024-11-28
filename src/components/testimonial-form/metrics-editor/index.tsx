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

export function MetricsEditor({ selectedPlatforms, metrics, onChange }: Props) {
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