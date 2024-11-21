import { Download, Pencil, Loader2, Archive } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';
import { FacebookComment } from './FacebookComment';
import { Tweet } from './Tweet';
import { TrustpilotReview } from './TrustpilotReview';
import { EmailTestimonial } from './EmailTestimonial';
import { downloadAllTestimonials } from '../utils/download';
import { useState } from 'react';

interface Props {
  testimonials: GeneratedTestimonial[];
  onEdit: (id: string) => void;
  onDownload: (testimonial: GeneratedTestimonial) => void;
  isLoading?: boolean;
}

export function TestimonialList({ testimonials, onEdit, onDownload, isLoading }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadAll = async () => {
    setError(null);
    setIsDownloadingAll(true);
    try {
      await downloadAllTestimonials(testimonials);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download testimonials. Please try again.');
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleSingleDownload = async (testimonial: GeneratedTestimonial) => {
    setError(null);
    setDownloadingId(testimonial.id);
    try {
      await onDownload(testimonial);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download testimonial. Please try again.');
    } finally {
      setDownloadingId(null);
    }
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Generated Testimonials</h2>
        {testimonials.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download all testimonials"
          >
            {isDownloadingAll ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Archive size={16} />
                <span>Download All</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {isLoading && (
          <div className="p-8 flex flex-col items-center justify-center text-gray-500">
            <Loader2 size={24} className="animate-spin mb-3" />
            <p className="text-sm">Generating your testimonial...</p>
          </div>
        )}
        
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize" 
                  style={{
                    backgroundColor: 
                      testimonial.platform === 'facebook' ? '#1877f2' :
                      testimonial.platform === 'trustpilot' ? '#00b67a' :
                      testimonial.platform === 'email' ? '#EA4335' : '#000',
                    color: 'white'
                  }}>
                  {testimonial.platform}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(testimonial.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(testimonial.id)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Edit testimonial"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleSingleDownload(testimonial)}
                  disabled={!!downloadingId}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download as image"
                >
                  {downloadingId === testimonial.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                </button>
              </div>
            </div>

            {renderTestimonial(testimonial)}
          </div>
        ))}
      </div>
    </div>
  );
}