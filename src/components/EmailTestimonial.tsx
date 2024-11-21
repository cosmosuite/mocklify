import { Star, Flag, Reply, Archive, Trash2, MoreVertical, Tag, ArrowLeft, Mail, ChevronDown } from 'lucide-react';
import type { GeneratedTestimonial } from '../types';

interface Props {
  testimonial: GeneratedTestimonial;
}

export function EmailTestimonial({ testimonial }: Props) {
  const formatTimestamp = (timeAgo: string) => {
    const now = new Date();
    const today = now.toLocaleDateString();
    
    if (timeAgo.includes('ago')) {
      const value = parseInt(timeAgo);
      const unit = timeAgo.includes('h') ? 'hours' : timeAgo.includes('m') ? 'minutes' : 'days';
      const date = new Date();
      
      if (unit === 'hours') date.setHours(date.getHours() - value);
      else if (unit === 'minutes') date.setMinutes(date.getMinutes() - value);
      else date.setDate(date.getDate() - value);

      if (date.toLocaleDateString() === today) {
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
      }
      
      if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        });
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return timeAgo;
  };

  return (
    <div id={`email-${testimonial.id}`} className="bg-white rounded-xl overflow-hidden">
      {/* Gmail Mobile Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-[#5F6368]" />
        </button>
        <div className="flex items-center space-x-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Archive className="w-5 h-5 text-[#5F6368]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Trash2 className="w-5 h-5 text-[#5F6368]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 relative">
            <Mail className="w-5 h-5 text-[#5F6368]" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#5F6368] rounded-full"></div>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-[#5F6368]" />
          </button>
        </div>
      </div>

      {/* Email Subject */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <h1 className="text-[#202124] text-xl leading-6 font-normal">
            {testimonial.metrics.subject}
          </h1>
          {testimonial.metrics.starred && (
            <button className="p-2 -mr-2">
              <Star className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
            </button>
          )}
        </div>
      </div>

      {/* Sender Info */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: '#1A73E8' }}
          >
            {testimonial.author.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <span className="font-medium text-[#202124] text-sm">
                {testimonial.author.name}
              </span>
              <span className="text-[#5F6368] text-sm ml-2">
                {formatTimestamp(testimonial.metrics.timeAgo)}
              </span>
              {testimonial.metrics.important && (
                <div className="w-4 h-4 ml-2">
                  <svg viewBox="0 0 24 24" className="w-full h-full text-[#F4B400]" fill="currentColor">
                    <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
                  </svg>
                </div>
              )}
            </div>
            <button className="flex items-center text-xs text-[#5F6368] mt-0.5 hover:text-[#202124]">
              <span>to me</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <button className="text-[#5F6368] hover:text-[#202124]">
            <span className="inline-flex items-center">
              <span className="w-1 h-1 bg-[#5F6368] rounded-full mx-0.5"></span>
              <span className="w-1 h-1 bg-[#5F6368] rounded-full mx-0.5"></span>
              <span className="w-1 h-1 bg-[#5F6368] rounded-full mx-0.5"></span>
            </span>
          </button>
        </div>
      </div>

      {/* Email Content */}
      <div className="px-4 py-3 text-[#202124] text-[14px] leading-relaxed">
        {testimonial.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Attachments */}
      {testimonial.metrics.attachments > 0 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="text-sm font-medium text-[#5F6368] mb-2">
            {testimonial.metrics.attachments} attachment{testimonial.metrics.attachments > 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: testimonial.metrics.attachments }).map((_, index) => (
              <div
                key={index}
                className="relative bg-[#F6F8FC] rounded-lg overflow-hidden aspect-[4/3] p-3 flex flex-col justify-between"
              >
                <div className="w-8 h-8 rounded-sm bg-[#E8F0FE]" />
                <div className="text-xs font-medium text-[#5F6368] mt-2">
                  Attachment {index + 1}.jpg
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <button className="h-9 px-6 bg-[#1A73E8] text-white text-sm font-medium rounded-full hover:bg-[#1557B0] transition-colors">
          Reply
        </button>
        <button className="h-9 px-6 bg-[#F6F8FC] text-[#1A73E8] text-sm font-medium rounded-full hover:bg-[#E8F0FE] transition-colors">
          Forward
        </button>
      </div>
    </div>
  );
}