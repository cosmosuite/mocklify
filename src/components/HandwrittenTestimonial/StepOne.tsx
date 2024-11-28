import { AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { cn } from '../../lib/utils';
import { WORD_LIMITS } from '../../utils/handwrittenGenerator';
import type { HandwrittenFormData } from '../../types';

interface Props {
  formData: HandwrittenFormData;
  onChange: (field: keyof HandwrittenFormData, value: any) => void;
  onNext: () => void;
}

const aspects = [
  { id: 'quality', label: 'Quality' },
  { id: 'service', label: 'Customer Service' },
  { id: 'results', label: 'Results/Impact' },
  { id: 'value', label: 'Value for Money' },
  { id: 'ease', label: 'Ease of Use' },
  { id: 'innovation', label: 'Innovation' }
];

export function StepOne({ formData, onChange, onNext }: Props) {
  const handleAspectToggle = (aspect: string) => {
    const currentAspects = formData.aspects || [];
    const newAspects = currentAspects.includes(aspect)
      ? currentAspects.filter(a => a !== aspect)
      : [...currentAspects, aspect];
    onChange('aspects', newAspects);
  };

  return (
    <div className="space-y-8">
      {/* Product Information */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Product Information
        </label>
        <Tabs 
          defaultValue="url" 
          className="w-full"
        >
          <TabsList className="w-full bg-[#1F1F1F] p-1">
            <TabsTrigger 
              value="url" 
              className="flex-1 text-sm text-gray-400 data-[state=active]:bg-[#CCFC7E] data-[state=active]:text-black"
            >
              Website URL
            </TabsTrigger>
            <TabsTrigger 
              value="description" 
              className="flex-1 text-sm text-gray-400 data-[state=active]:bg-[#CCFC7E] data-[state=active]:text-black"
            >
              Description
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <input
              type="url"
              value={formData.productInfo}
              onChange={(e) => onChange('productInfo', e.target.value)}
              placeholder="Enter your website URL (e.g., https://example.com)"
              className={cn(
                "w-full h-12 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
                "outline-none transition-colors",
                "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
                "border-[#2F2F2F]"
              )}
            />
          </TabsContent>
          
          <TabsContent value="description" className="mt-4">
            <textarea
              value={formData.productInfo}
              onChange={(e) => onChange('productInfo', e.target.value)}
              placeholder="Describe your product or service in detail..."
              className={cn(
                "w-full h-32 rounded-lg border bg-[#1F1F1F] px-4 py-3 text-sm text-white placeholder:text-gray-500",
                "outline-none transition-colors resize-none",
                "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
                "border-[#2F2F2F]"
              )}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Tone Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Testimonial Tone
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(['enthusiastic', 'professional', 'casual', 'grateful'] as const).map((t) => (
            <label
              key={t}
              className={cn(
                "flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-colors",
                formData.tone === t
                  ? "bg-[#1F1F1F] border-[#CCFC7E] text-[#CCFC7E]"
                  : "border-[#2F2F2F] text-gray-400 hover:border-[#3F3F3F]"
              )}
            >
              <input
                type="radio"
                value={t}
                checked={formData.tone === t}
                onChange={(e) => onChange('tone', e.target.value)}
                className="sr-only"
              />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Author Name */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Author Name
        </label>
        <input
          type="text"
          value={formData.authorName || ''}
          onChange={(e) => onChange('authorName', e.target.value)}
          placeholder="Enter author's name"
          className={cn(
            "w-full h-12 rounded-lg border bg-[#1F1F1F] px-4 text-sm text-white placeholder:text-gray-500",
            "outline-none transition-colors",
            "hover:border-[#3F3F3F] focus:border-[#CCFC7E] focus:ring-1 focus:ring-[#CCFC7E]",
            "border-[#2F2F2F]"
          )}
        />
      </div>

      {/* Length Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Testimonial Length
        </label>
        <div className="text-xs text-gray-400 mb-2">
          {formData.length === 'short' && `Up to ${WORD_LIMITS.short} words`}
          {formData.length === 'medium' && `${WORD_LIMITS.short + 1}-${WORD_LIMITS.medium} words`}
          {formData.length === 'long' && `${WORD_LIMITS.medium + 1}-${WORD_LIMITS.long} words`}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(['short', 'medium', 'long'] as const).map((l) => (
            <label
              key={l}
              className={cn(
                "flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-colors",
                formData.length === l
                  ? "bg-[#1F1F1F] border-[#CCFC7E] text-[#CCFC7E]"
                  : "border-[#2F2F2F] text-gray-400 hover:border-[#3F3F3F]"
              )}
            >
              <input
                type="radio"
                value={l}
                checked={formData.length === l}
                onChange={(e) => onChange('length', e.target.value)}
                className="sr-only"
              />
              <span className="capitalize">{l}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Key Aspects */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Key Aspects to Highlight
        </label>
        <div className="grid grid-cols-2 gap-4">
          {aspects.map((aspect) => (
            <label
              key={aspect.id}
              className={cn(
                "flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-colors",
                formData.aspects?.includes(aspect.id)
                  ? "bg-[#1F1F1F] border-[#CCFC7E] text-[#CCFC7E]"
                  : "border-[#2F2F2F] text-gray-400 hover:border-[#3F3F3F]"
              )}
            >
              <input
                type="checkbox"
                checked={formData.aspects?.includes(aspect.id)}
                onChange={() => handleAspectToggle(aspect.id)}
                className="sr-only"
              />
              <span>{aspect.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!formData.productInfo || !formData.aspects?.length}
        className={cn(
          "w-full h-12 rounded-lg font-medium transition-colors",
          "bg-[#CCFC7E] text-black hover:bg-[#B8E86E]",
          "focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F]",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Next Step
      </button>
    </div>
  );
}