import { MessageCircle, Repeat2, Heart, Bookmark, Share, MoreHorizontal } from 'lucide-react';
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
      year: 'numeric',
    });
  };

  return (
    <div id={`twitter-${testimonial.id}`} className="bg-black text-white p-4 border border-[#2f3336] rounded-lg">
      {/* Grid Layout */}
      <div className="grid grid-cols-[48px_auto_auto] gap-x-1">
        {/* Profile Picture */}
        <div>
          <img
            src={testimonial.author.avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* Profile Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[15px] hover:underline">
              {testimonial.author.name}
            </span>
            {testimonial.author.isVerified && (
              <img
                src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6741874c7776d5cdc39045ff.png"
                alt="Verified"
                className="w-[16px] h-[16px]"
              />
            )}
          </div>
          <span className="text-[15px] text-[#71767b]">
            @{testimonial.author.handle}
          </span>
        </div>

        {/* 3-Dot Menu */}
        <div className="flex items-start justify-end">
          <button className="p-2 text-[#71767b] hover:bg-[#1d9bf01a] hover:text-[#e7e9ea] rounded-full">
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Tweet Content */}
        <div className="col-span-3 mt-[6px] text-[15px] leading-normal whitespace-pre-wrap break-words text-[#e7e9ea]">
          {testimonial.content}
        </div>

        {/* Timestamp & Metrics */}
        <div className="col-span-3 flex items-center mt-[10px] text-[#71767b] text-[15px]">
          <span>{formatTimestamp(testimonial.timestamp)}</span>
          <span className="px-1">·</span>
          <span>{formatDate(testimonial.timestamp)}</span>
          {testimonial.metrics.views && (
            <>
              <span className="px-1">·</span>
              <span>{formatNumber(testimonial.metrics.views)} Views</span>
            </>
          )}
        </div>

        {/* Divider Below Timestamp */}
        <div className="col-span-3 mt-[6px] border-t border-[#2f3336]"></div>

        {/* Reaction Buttons */}
        <div className="col-span-3 flex items-center justify-between mt-[6px] max-w-md text-[#71767b]">
          {/* Comment */}
          <button className="group flex items-center">
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            <span className="text-sm ml-1 group-hover:text-[#1d9bf0]">
              {formatNumber(testimonial.metrics.comments || 0)}
            </span>
          </button>

          {/* Retweet */}
          <button className="group flex items-center">
            <div className="p-2 rounded-full group-hover:bg-[#00ba7c1a] group-hover:text-[#00ba7c]">
              <Repeat2 className="w-[18px] h-[18px]" />
            </div>
            <span className="text-sm ml-1 group-hover:text-[#00ba7c]">
              {formatNumber(testimonial.metrics.retweets || 0)}
            </span>
          </button>

          {/* Like */}
          <button className="group flex items-center">
            <div className="p-2 rounded-full group-hover:bg-[#f918801a] group-hover:text-[#f91880]">
              <Heart className="w-[18px] h-[18px]" />
            </div>
            <span className="text-sm ml-1 group-hover:text-[#f91880]">
              {formatNumber(testimonial.metrics.likes)}
            </span>
          </button>

          {/* Bookmark */}
          <button className="group flex items-center">
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
              <Bookmark className="w-[18px] h-[18px]" />
            </div>
            {testimonial.metrics.bookmarks && (
              <span className="text-sm ml-1 group-hover:text-[#1d9bf0]">
                {formatNumber(testimonial.metrics.bookmarks)}
              </span>
            )}
          </button>

          {/* Share */}
          <button className="group">
            <div className="p-2 rounded-full group-hover:bg-[#1d9bf01a] group-hover:text-[#1d9bf0]">
              <Share className="w-[18px] h-[18px]" />
            </div>
          </button>
        </div>

        {/* Divider Below Reactions */}
        <div className="col-span-3 mt-[6px] border-t border-[#2f3336]"></div>
      </div>
    </div>
  );
}
