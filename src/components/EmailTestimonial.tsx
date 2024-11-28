import {
  Star,
  Flag,
  Reply,
  Archive,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Mail,
  ChevronDown,
  Smile,
} from "lucide-react";
import type { GeneratedTestimonial } from "../types";

interface Props {
  testimonial: GeneratedTestimonial;
}

export function EmailTestimonial({ testimonial }: Props) {
  return (
    <div id={`email-${testimonial.id}`} className="bg-white rounded-xl overflow-hidden">
      {/* Gmail Mobile Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 transition-colors">
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
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Smile className="w-5 h-5 text-[#5F6368]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Reply className="w-5 h-5 text-[#5F6368]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-[#5F6368]" />
          </button>
        </div>
      </div>

      {/* Email Subject */}
      <div className="px-4 py-3 border-b border-gray-100 transition-colors">
        <div className="flex items-start justify-between">
          <h1 className="text-[#202124] text-xl leading-6 font-normal">
            {testimonial.metrics.subject}
          </h1>
          {testimonial.metrics.starred && (
            <button className="p-2 -mr-2 transition-colors">
              <Star className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
            </button>
          )}
        </div>
      </div>

      {/* Sender Info */}
      <div className="px-4 py-2 flex items-center justify-between transition-colors">
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
                {testimonial.metrics.senderName || testimonial.author.name}
              </span>
              <span className="text-[#5F6368] text-sm ml-2">
                {testimonial.metrics.timeAgo}
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

      {/* Bottom Actions */}
      <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <button className="h-9 bg-[#1A73E8] text-white text-sm font-medium rounded-lg hover:bg-[#1557B0] transition-colors flex items-center justify-center">
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </button>
        <button className="h-9 bg-[#F6F8FC] text-[#1A73E8] text-sm font-medium rounded-lg hover:bg-[#E8F0FE] transition-colors flex items-center justify-center">
          <Reply className="w-4 h-4 mr-2 transform rotate-180 scale-y-[-1]" />
          Forward
        </button>
      </div>
    </div>
  );
}