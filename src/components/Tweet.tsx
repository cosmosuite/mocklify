import { MessageCircle, Repeat2, Heart, Bookmark, Share, BadgeCheck } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';

interface Props {
  testimonial: GeneratedTestimonial;
}

export function Tweet({ testimonial }: Props) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimestamp = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div id={`twitter-${testimonial.id}`} className="bg-black text-white rounded-lg overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex space-x-3">
          <img
            src={testimonial.author.avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="font-bold hover:underline">
                    {testimonial.author.name}
                  </span>
                  {testimonial.author.isVerified && (
                    <BadgeCheck size={16} className="ml-0.5 text-[#1d9bf0]" />
                  )}
                </div>
                <span className="ml-2 text-[#71767b]">
                  @{testimonial.author.handle}
                </span>
              </div>
              <button className="text-[#71767b] hover:text-blue-400 transition-colors">
                •••
              </button>
            </div>

            <p className="mt-1 text-[15px] leading-normal break-words text-[#e7e9ea]">
              {testimonial.content}
            </p>

            <div className="flex items-center mt-3 text-[#71767b] text-[15px] font-medium">
              <span>{formatTimestamp(testimonial.timestamp)}</span>
              <span className="mx-1">·</span>
              <span>{formatDate(testimonial.timestamp)}</span>
              {testimonial.metrics.views && (
                <>
                  <span className="mx-1">·</span>
                  <span>{formatNumber(testimonial.metrics.views)} Views</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 text-[#71767b] max-w-md">
              <button className="group flex items-center space-x-1">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
                  <MessageCircle className="w-[18px] h-[18px]" />
                </div>
                <span className="text-sm group-hover:text-[#1d9bf0]">
                  {formatNumber(testimonial.metrics.comments || 0)}
                </span>
              </button>

              <button className="group flex items-center space-x-1">
                <div className="p-2 rounded-full group-hover:bg-[#00ba7c1a] group-hover:text-[#00ba7c]">
                  <Repeat2 className="w-[18px] h-[18px]" />
                </div>
                <span className="text-sm group-hover:text-[#00ba7c]">
                  {formatNumber(testimonial.metrics.retweets || 0)}
                </span>
              </button>

              <button className="group flex items-center space-x-1">
                <div className="p-2 rounded-full group-hover:bg-[#f918801a] group-hover:text-[#f91880]">
                  <Heart className="w-[18px] h-[18px]" />
                </div>
                <span className="text-sm group-hover:text-[#f91880]">
                  {formatNumber(testimonial.metrics.likes)}
                </span>
              </button>

              <button className="group flex items-center space-x-1">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
                  <Bookmark className="w-[18px] h-[18px]" />
                </div>
                {testimonial.metrics.bookmarks && (
                  <span className="text-sm group-hover:text-[#1d9bf0]">
                    {formatNumber(testimonial.metrics.bookmarks)}
                  </span>
                )}
              </button>

              <button className="group">
                <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
                  <Share className="w-[18px] h-[18px]" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}