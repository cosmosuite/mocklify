import { useState } from 'react';
import { Loader2, Pencil, Download, Check, ChevronDown } from 'lucide-react';
import type { HandwrittenTestimonial } from '../../types';
import { cn } from '../../lib/utils';
import { TextControls } from './TextControls';
import { downloadHandwrittenTestimonial } from '../../utils/downloadHandwritten';

interface Props {
  testimonial: HandwrittenTestimonial | null;
  isLoading?: boolean;
  onStyleChange?: (updates: Partial<HandwrittenTestimonial['style']>) => void;
}

const DEFAULT_SETTINGS = {
  textSize: 24,
  lineHeight: 2.0,
  padding: 32,
  signaturePosition: 'bottom-right' as const
};

export function HandwrittenPreview({ testimonial, isLoading, onStyleChange }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [padding, setPadding] = useState(32);
  const [signaturePosition, setSignaturePosition] = useState<'bottom-right' | 'bottom-center' | 'bottom-left'>('bottom-right');
  const [showControls, setShowControls] = useState(true);

  const handleDownload = async () => {
    if (!testimonial) return;
    
    setIsDownloading(true);
    try {
      await downloadHandwrittenTestimonial(testimonial);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header with Actions */}
      <div className="sticky top-0 z-20 px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
        <span className="text-sm text-gray-500">
          {new Date(testimonial.timestamp).toLocaleDateString()}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-1.5 text-gray-500 hover:text-gray-700 bg-white rounded-full hover:bg-gray-50 transition-colors"
            title="Download as image"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : downloadSuccess ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Download size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        id={`handwritten-${testimonial.id}`}
        className="relative bg-white overflow-hidden w-full"
        style={{ 
          backgroundImage: `url(${style.background.color})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          aspectRatio: '0.7'
        }}
      >
        {/* Content */}
        <div 
          id={`handwritten-content-${testimonial.id}`}
          className={cn( 
            "absolute inset-0 whitespace-pre-wrap break-words overflow-y-auto",
            `font-${style.font}`,
            "relative z-10"
          )}
          style={{
            color: style.text.color,
            fontSize: `${style.text.size}px`,
            lineHeight: style.text.lineHeight,
            padding: `${padding}px`
          }}
        >
          {content}
          
          {/* Signature */}
          <div 
            id={`handwritten-signature-${testimonial.id}`}
            className={cn(
              "absolute bottom-8",
              signaturePosition === 'bottom-right' && "right-8",
              signaturePosition === 'bottom-center' && "left-1/2 -translate-x-1/2",
              signaturePosition === 'bottom-left' && "left-8"
            )}
            style={{
              color: style.text.color,
              fontSize: `${style.text.size}px`
            }}
          >
            {author.name}
          </div>
        </div>
      </div>
    </div>
  );
}