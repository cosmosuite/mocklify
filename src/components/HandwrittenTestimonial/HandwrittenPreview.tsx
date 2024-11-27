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
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      style={{ backgroundColor: style.background.color }}
    >
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