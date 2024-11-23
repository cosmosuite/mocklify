import { useState } from 'react';
import { Download, Loader2, Pencil } from 'lucide-react';
import type { GeneratedTestimonial, Platform, SocialMetrics } from '../types';
import { FacebookComment } from './FacebookComment';
import { Tweet } from './Tweet';
import { TrustpilotReview } from './TrustpilotReview';
import { EmailTestimonial } from './EmailTestimonial';
import { downloadSingleTestimonial, downloadAllTestimonials } from '../utils/download';
import { cn } from '../lib/utils';
import { MetricsEditor } from './testimonial-form/metrics-editor';

interface Props {
  testimonials: GeneratedTestimonial[];
  onEdit: (id: string) => void;
  onMetricsUpdate: (id: string, metrics: SocialMetrics) => void;
  isLoading?: boolean;
}

export function TestimonialList({ testimonials, onEdit, onMetricsUpdate, isLoading }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDownload = async (testimonial: GeneratedTestimonial) => {
    setError(null);
    setDownloadingId(testimonial.id);
    try {
      await downloadSingleTestimonial(testimonial);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download testimonial. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    setError(null);
    setIsDownloadingAll(true);
    try {
      await downloadAllTestimonials(testimonials);
    } catch (error) {
      console.error('Download all failed:', error);
      setError('Failed to download testimonials. Please try again.');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleMetricsChange = (testimonialId: string, field: keyof SocialMetrics, value: any) => {
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (!testimonial) return;

    const updatedMetrics = {
      ...testimonial.metrics,
      [field]: value
    };

    onMetricsUpdate(testimonialId, updatedMetrics);
  };

  const renderTestimonial = (testimonial: GeneratedTestimonial) => {
    switch (testimonial.platform) {
      case 'facebook':
        return <FacebookComment testimonial={testimonial} />;
      case 'twitter':
        return <Tweet testimonial={testimonial} />;
      case 'trustpilot':
        return <TrustpilotReview testimonial={testimonial} />;
      case 'email':
        return <EmailTestimonial testimonial={testimonial} />;
      default:
        return null;
    }
  };

  // Group testimonials by platform
  const groupedTestimonials = testimonials.reduce((acc, testimonial) => {
    if (!acc[testimonial.platform]) {
      acc[testimonial.platform] = [];
    }
    acc[testimonial.platform].push(testimonial);
    return acc;
  }, {} as Record<Platform, GeneratedTestimonial[]>);

  const platforms = Object.keys(groupedTestimonials) as Platform[];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#0F0F0F]">Generated Testimonials</h2>
        {testimonials.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-sm font-medium text-[#0F0F0F] hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download all testimonials"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Download All</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100">
          <p className="text-sm text-[#0F0F0F]">{error}</p>
        </div>
      )}

      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#0F0F0F]">
            <Loader2 size={24} className="animate-spin mb-3" />
            <p className="text-sm">Generating your testimonial...</p>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="testimonial-columns">
            {platforms.map((platform) => (
              <div key={platform} className="testimonial-column">
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('platform-badge', `platform-badge-${platform}`)}>
                    {platform}
                  </div>
                  <span className="text-sm text-[#0F0F0F]">
                    {groupedTestimonials[platform].length} testimonial{groupedTestimonials[platform].length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Platform Testimonials */}
                <div className="space-y-6">
                  {groupedTestimonials[platform].map((testimonial) => (
                    <div key={testimonial.id}>
                      <div className="testimonial-card">
                        {/* Actions */}
                        <div className="testimonial-card-header">
                          <span className="text-sm text-[#0F0F0F]">
                            {new Date(testimonial.timestamp).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingId(editingId === testimonial.id ? null : testimonial.id)}
                              className="action-button"
                              title="Edit metrics"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDownload(testimonial)}
                              disabled={!!downloadingId}
                              className="action-button"
                              title="Download as image"
                            >
                              {downloadingId === testimonial.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="testimonial-card-content p-0">
                          {renderTestimonial(testimonial)}
                        </div>
                      </div>

                      {/* Metrics Editor */}
                      {editingId === testimonial.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <MetricsEditor
                            selectedPlatforms={[testimonial.platform]}
                            metrics={testimonial.metrics}
                            onChange={(field, value) => handleMetricsChange(testimonial.id, field, value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-[#0F0F0F]">
              Generated testimonials will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}