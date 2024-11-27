import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { HandwrittenFormData } from '../../types';

interface Props {
  formData: HandwrittenFormData;
  isLoading?: boolean;
  onChange: (field: keyof HandwrittenFormData, value: any) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const fonts = [
  { 
    id: 'qe-caroline',
    name: 'Caroline Mutiboko'
  },
  { 
    id: 'qe-geekzoid',
    name: 'geeKzoid'
  },
  { 
    id: 'qe-julian',
    name: 'Julian Dean'
  },
  { 
    id: 'qe-mamas',
    name: 'Mamas and Papas'
  },
  { 
    id: 'qe-vicky',
    name: 'Vicky Caulfield'
  }
];

const backgrounds = [
  { id: 'classic', name: 'Classic Paper', colors: ['#ffffff', '#f5f5dc', '#d3d3d3'] },
  { id: 'notepad', name: 'Notepad', colors: [] },
  { id: 'journal', name: 'Journal', colors: [] },
  { id: 'custom', name: 'Custom Color', colors: [] }
];

export function StepTwo({ formData, isLoading, onChange, onBack, onSubmit }: Props) {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);

  const handleFontChange = (fontId: string) => {
    onChange('font', fontId);
  };

  const handleBackgroundChange = (style: string, color?: string) => {
    onChange('background', {
      ...formData.background,
      style,
      color: color || formData.background.color
    });
  };

  const handleTextPropertyChange = (property: keyof typeof formData.text, value: any) => {
    onChange('text', {
      ...formData.text,
      [property]: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Font Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Handwriting Style
        </label>
        <div className="grid grid-cols-2 gap-4">
          {fonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => handleFontChange(font.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-lg border-2 transition-colors text-left",
                formData.font === font.id
                  ? "bg-[#1F1F1F] border-[#CCFC7E]"
                  : "border-[#2F2F2F] hover:border-[#3F3F3F]"
              )}
            >
              <span 
                className={cn(
                  "text-lg mb-1",
                  formData.font === font.id ? "text-[#CCFC7E]" : "text-white",
                  `font-${font.id}`
                )}
              >
                {font.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Background Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white">
          Background Style
        </label>
        <div className="grid grid-cols-2 gap-4">
          {backgrounds.map((bg) => (
            <div key={bg.id}>
              <button
                type="button"
                onClick={() => handleBackgroundChange(bg.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors",
                  formData.background.style === bg.id
                    ? "bg-[#1F1F1F] border-[#CCFC7E] text-[#CCFC7E]"
                    : "border-[#2F2F2F] text-gray-400 hover:border-[#3F3F3F]"
                )}
              >
                <span>{bg.name}</span>
                {bg.colors.length > 0 && <ChevronDown size={16} />}
              </button>

              {formData.background.style === bg.id && bg.colors.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {bg.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleBackgroundChange(bg.id, color)}
                      className={cn(
                        "w-full h-8 rounded border-2 transition-colors",
                        formData.background.color === color
                          ? "border-[#CCFC7E]"
                          : "border-transparent hover:border-gray-600"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              {formData.background.style === bg.id && bg.id === 'custom' && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowBgColor(!showBgColor)}
                    className="w-full h-10 rounded flex items-center justify-between px-3 border border-[#2F2F2F] hover:border-[#3F3F3F]"
                  >
                    <span className="text-sm text-gray-400">
                      Select Color
                    </span>
                    <div
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: formData.background.color }}
                    />
                  </button>
                  {showBgColor && (
                    <div className="mt-2">
                      <HexColorPicker
                        color={formData.background.color}
                        onChange={(color) => handleBackgroundChange('custom', color)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Text Properties */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-white mb-4 block">
            Text Properties
          </label>
          
          {/* Ink Color */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowTextColor(!showTextColor)}
              className="w-full h-10 rounded flex items-center justify-between px-3 border border-[#2F2F2F] hover:border-[#3F3F3F]"
            >
              <span className="text-sm text-gray-400">
                Ink Color
              </span>
              <div
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: formData.text.color }}
              />
            </button>
            {showTextColor && (
              <div className="mt-2">
                <HexColorPicker
                  color={formData.text.color}
                  onChange={(color) => handleTextPropertyChange('color', color)}
                />
              </div>
            )}
          </div>

          {/* Text Size */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Writing Size
            </label>
            <input
              type="range"
              min="14"
              max="24"
              step="1"
              value={formData.text.size}
              onChange={(e) => handleTextPropertyChange('size', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Line Height */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Line Spacing
            </label>
            <input
              type="range"
              min="1.2"
              max="2.4"
              step="0.1"
              value={formData.text.lineHeight}
              onChange={(e) => handleTextPropertyChange('lineHeight', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Include Signature */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.text.includeSignature}
              onChange={(e) => handleTextPropertyChange('includeSignature', e.target.checked)}
              className="h-4 w-4 rounded border-[#2F2F2F] bg-[#1F1F1F] text-[#CCFC7E] focus:ring-[#CCFC7E] focus:ring-offset-[#0F0F0F]"
            />
            <span className="text-sm text-gray-400">
              Include Signature
            </span>
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-[#1F1F1F] text-white h-11 px-8 rounded-lg font-medium hover:bg-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 bg-[#CCFC7E] text-black h-11 px-8 rounded-lg font-medium hover:bg-[#B8E86E] focus:outline-none focus:ring-2 focus:ring-[#CCFC7E] focus:ring-offset-2 focus:ring-offset-[#0F0F0F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              Generating...
            </span>
          ) : (
            'Generate Testimonial'
          )}
        </button>
      </div>
    </div>
  );
}