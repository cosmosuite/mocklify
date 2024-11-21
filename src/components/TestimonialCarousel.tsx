import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Download, Loader2, Pencil, Trash2 } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';
import { FacebookComment } from './FacebookComment';
import { Tweet } from './Tweet';
import { TrustpilotReview } from './TrustpilotReview';
import { cn } from '../lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  testimonials: GeneratedTestimonial[];
  onEdit: (id: string) => void;
  onDownload: (testimonial: GeneratedTestimonial) => void;
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

export function TestimonialCarousel({ testimonials, onEdit, onDownload, onDelete, isDeleting }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (testimonial: GeneratedTestimonial) => {
    setDownloadingId(testimonial.id);
    try {
      await onDownload(testimonial);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="relative">
      <div className="max-w-[600px] mx-auto">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.carousel-prev-btn',
            nextEl: '.carousel-next-btn',
            disabledClass: 'opacity-40 cursor-not-allowed'
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-gray-300',
            bulletActiveClass: '!bg-gray-900 !w-4',
          }}
          spaceBetween={32}
          slidesPerView={1}
          className="!pb-16"
          loop={testimonials.length > 1}
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
                          testimonial.platform === 'trustpilot' ? '#00b67a' : '#000'
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
                      <button
                        onClick={() => onDelete(testimonial.id)}
                        disabled={isDeleting === testimonial.id}
                        className="p-1.5 text-gray-500 hover:text-red-500 bg-white rounded-full hover:bg-gray-50 transition-colors"
                        title="Delete testimonial"
                      >
                        {isDeleting === testimonial.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="p-4">
                    {testimonial.platform === 'facebook' ? (
                      <FacebookComment testimonial={testimonial} />
                    ) : testimonial.platform === 'twitter' ? (
                      <Tweet testimonial={testimonial} />
                    ) : (
                      <TrustpilotReview testimonial={testimonial} />
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {testimonials.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center space-x-4 mt-2">
            <button
              className={cn(
                "carousel-prev-btn",
                "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
                "flex items-center justify-center",
                "hover:bg-gray-50 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                "z-10"
              )}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className={cn(
                "carousel-next-btn",
                "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
                "flex items-center justify-center",
                "hover:bg-gray-50 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                "z-10"
              )}
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .swiper-button-disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          display: none;
        }

        .swiper-pagination {
          bottom: 4px !important;
        }
      `}</style>
    </div>
  );
}