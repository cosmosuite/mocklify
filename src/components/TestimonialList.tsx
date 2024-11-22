import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Download, Loader2, Pencil, Archive } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';
import { FacebookComment } from './FacebookComment';
import { Tweet } from './Tweet';
import { TrustpilotReview } from './TrustpilotReview';
import { EmailTestimonial } from './EmailTestimonial';
import { downloadSingleTestimonial, downloadAllTestimonials } from '../utils/download';
import { cn } from '../lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  testimonials: GeneratedTestimonial[];
  onEdit: (id: string) => void;
  isLoading?: boolean;
}

export function TestimonialList({ testimonials, onEdit, isLoading }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200">
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

      <div className="relative px-6 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 size={24} className="animate-spin mb-3" />
            <p className="text-sm">Generating your testimonial...</p>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative max-w-[600px] mx-auto">
            <div className="testimonial-carousel relative">
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <button
                    className={cn(
                      "testimonial-prev",
                      "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
                      "flex items-center justify-center",
                      "hover:bg-gray-50 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className={cn(
                      "testimonial-next",
                      "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
                      "flex items-center justify-center",
                      "hover:bg-gray-50 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  enabled: true,
                  prevEl: '.testimonial-prev',
                  nextEl: '.testimonial-next'
                }}
                pagination={{
                  enabled: true,
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-gray-300',
                  bulletActiveClass: '!bg-gray-900 !w-4'
                }}
                spaceBetween={32}
                slidesPerView={1}
                loop={testimonials.length > 1}
                className="!pb-12"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="w-full">
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Platform Badge & Actions */}
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <span 
                            className="px-2.5 py-1 rounded-full text-xs font-medium capitalize text-white"
                            style={{
                              backgroundColor: 
                                testimonial.platform === 'facebook' ? '#1877f2' :
                                testimonial.platform === 'trustpilot' ? '#00b67a' :
                                testimonial.platform === 'email' ? '#EA4335' : '#000'
                            }}
                          >
                            {testimonial.platform}
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onEdit(testimonial.id)}
                              className="p-1.5 text-gray-500 hover:text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors"
                              title="Edit testimonial"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDownload(testimonial)}
                              disabled={!!downloadingId}
                              className="p-1.5 text-gray-500 hover:text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors"
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

                        {/* Testimonial Content */}
                        <div className="p-4">
                          {renderTestimonial(testimonial)}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              Generated testimonials will appear here
            </p>
          </div>
        )}
      </div>

      <style>{`
        .testimonial-carousel {
          padding: 0;
        }

        .swiper {
          position: relative !important;
          overflow: visible;
        }

        .swiper-wrapper {
          align-items: stretch;
        }

        .swiper-slide {
          height: auto;
          display: flex;
        }

        .swiper-pagination {
          bottom: 0 !important;
        }

        .swiper-pagination-bullet {
          transition: all 0.2s ease;
        }

        .testimonial-prev.swiper-button-disabled,
        .testimonial-next.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}