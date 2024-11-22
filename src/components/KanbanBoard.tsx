import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Download, Loader2, Pencil, Trash2, Archive } from 'lucide-react';
import type { GeneratedTestimonial, Platform } from '../types';
import { FacebookComment } from './FacebookComment';
import { Tweet } from './Tweet';
import { TrustpilotReview } from './TrustpilotReview';
import { EmailTestimonial } from './EmailTestimonial';
import { downloadAllTestimonials } from '../utils/download';
import { cn } from '../lib/utils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Props {
  testimonials: GeneratedTestimonial[];
  onDelete: (id: string) => void;
  isDeleting: string | null;
}

interface KanbanColumn {
  id: Platform;
  title: string;
  color: string;
  items: GeneratedTestimonial[];
}

export function KanbanBoard({ testimonials, onDelete, isDeleting }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingPlatform, setDownloadingPlatform] = useState<Platform | null>(null);

  // Group testimonials by platform
  const columns: KanbanColumn[] = [
    {
      id: 'facebook',
      title: 'Facebook',
      color: '#1877f2',
      items: testimonials.filter(t => t.platform === 'facebook')
    },
    {
      id: 'twitter',
      title: 'Twitter',
      color: '#000000',
      items: testimonials.filter(t => t.platform === 'twitter')
    },
    {
      id: 'trustpilot',
      title: 'Trustpilot',
      color: '#00b67a',
      items: testimonials.filter(t => t.platform === 'trustpilot')
    },
    {
      id: 'email',
      title: 'Email',
      color: '#EA4335',
      items: testimonials.filter(t => t.platform === 'email')
    }
  ];

  const handleDownloadPlatform = async (platform: Platform) => {
    try {
      setDownloadingPlatform(platform);
      const platformTestimonials = testimonials.filter(t => t.platform === platform);
      await downloadAllTestimonials(platformTestimonials);
    } catch (error) {
      console.error(`Failed to download ${platform} testimonials:`, error);
    } finally {
      setDownloadingPlatform(null);
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
    <div className="relative bg-gray-50 rounded-xl p-6">
      <Swiper
        modules={[Navigation, Pagination, Mousewheel]}
        navigation={{
          prevEl: '.kanban-prev-btn',
          nextEl: '.kanban-next-btn',
          disabledClass: 'opacity-40 cursor-not-allowed'
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-2 !h-2 !bg-gray-300',
          bulletActiveClass: '!bg-gray-900 !w-4',
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true
        }}
        slidesPerView="auto"
        spaceBetween={24}
        className="!pb-12"
      >
        {columns.map(column => (
          <SwiperSlide key={column.id} className="!w-[450px]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              {/* Column Header - Fixed Position */}
              <div className="sticky top-0 z-10 bg-white px-4 py-3 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: column.color }}
                    >
                      {column.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {column.items.length} item{column.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {column.items.length > 0 && (
                    <button
                      onClick={() => handleDownloadPlatform(column.id)}
                      disabled={!!downloadingPlatform}
                      className="inline-flex items-center space-x-1 px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title={`Download all ${column.title} testimonials`}
                    >
                      {downloadingPlatform === column.id ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Archive size={14} />
                          <span>Download All</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Column Content - Scrollable */}
              <div className="p-4">
                <div className="space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin">
                  {column.items.map(testimonial => (
                    <div 
                      key={testimonial.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      {/* Testimonial Actions - Fixed Position */}
                      <div className="sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(testimonial.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {}}
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                            title="Edit testimonial"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => {}}
                            disabled={!!downloadingId}
                            className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
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
                            className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
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
                        {renderTestimonial(testimonial)}
                      </div>
                    </div>
                  ))}

                  {column.items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No {column.title} testimonials</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        className={cn(
          "kanban-prev-btn",
          "absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
          "flex items-center justify-center",
          "hover:bg-gray-50 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        )}
        aria-label="Previous column"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        className={cn(
          "kanban-next-btn",
          "absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700",
          "flex items-center justify-center",
          "hover:bg-gray-50 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        )}
        aria-label="Next column"
      >
        <ChevronRight size={16} />
      </button>

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
          bottom: 0 !important;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #E5E7EB;
          border-radius: 9999px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #D1D5DB;
        }
      `}</style>
    </div>
  );
}