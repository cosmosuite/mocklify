import { Loader2 } from 'lucide-react';
import type { HandwrittenTestimonial } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  testimonial: HandwrittenTestimonial | null;
  isLoading?: boolean;
}

export function HandwrittenPreview({ testimonial, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Loader2 size={24} className="animate-spin mb-3" />
          <p className="text-sm">Generating your testimonial...</p>
        </div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p>Your handwritten testimonial will appear here</p>
        </div>
      </div>
    );
  }

  const { content, author, style } = testimonial;

  return (
    <div 
      id={`handwritten-${testimonial.id}`}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
      style={{ backgroundColor: style.background.color }}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm border border-gray-100">
        <button
          onClick={() => {}}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100/80 transition-colors"
          title="Edit testimonial"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => {}}
          className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100/80 transition-colors"
          title="Download as image"
        >
          <Download size={14} />
        </button>
      </div>

      <div className="p-8">
        {/* Content */}
        <div 
          className={cn(
            "mb-8 whitespace-pre-wrap break-words",
            `font-${style.font}`
          )}
          style={{
            color: style.text.color,
            fontSize: `${style.text.size}px`,
            lineHeight: style.text.lineHeight
          }}
        >
          {content}
        </div>

        {/* {/* Signature */}
        {style.text.includeSignature && (
          <div 
            className={cn(
              "text-right",
              `font-${style.font}`
            )}
            style={{
              color: style.text.color,
              fontSize: `${style.text.size}px`
            }}
          >
            {author.name}
          </div>
        )}
      </div>
    </div>
  );
}