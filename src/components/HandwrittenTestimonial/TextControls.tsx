import { Sliders } from 'lucide-react';
import { cn } from '../../lib/utils';

const DEFAULT_SETTINGS = {
  textSize: 24,
  lineHeight: 2.0,
  padding: 32,
  signaturePosition: 'bottom-right' as const
};

interface TextControlsProps {
  textSize: number;
  lineHeight: number;
  padding: number;
  signaturePosition: 'bottom-right' | 'bottom-center' | 'bottom-left';
  onTextSizeChange: (size: number) => void;
  onLineHeightChange: (height: number) => void;
  onPaddingChange: (padding: number) => void;
  onSignaturePositionChange: (position: 'bottom-right' | 'bottom-center' | 'bottom-left') => void;
  onReset: () => void;
}

export function TextControls({
  textSize,
  lineHeight,
  padding,
  signaturePosition,
  onTextSizeChange,
  onLineHeightChange,
  onPaddingChange,
  onSignaturePositionChange,
  onReset
}: TextControlsProps) {
  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sliders size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Text Controls</span>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          Reset to Default
        </button>
      </div>

      <div className="space-y-4">
        {/* Text Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Text Size</label>
            <span className="text-xs text-gray-500">{textSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="32"
            value={textSize}
            onChange={(e) => onTextSizeChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Line Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Line Spacing</label>
            <span className="text-xs text-gray-500">{lineHeight.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.2"
            max="2.4"
            step="0.1"
            value={lineHeight}
            onChange={(e) => onLineHeightChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Padding */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Content Padding</label>
            <span className="text-xs text-gray-500">{padding}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="64"
            step="8"
            value={padding}
            onChange={(e) => onPaddingChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Signature Position */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Signature Position
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['bottom-left', 'bottom-center', 'bottom-right'] as const).map((position) => (
              <button
                key={position}
                onClick={() => onSignaturePositionChange(position)}
                className={cn(
                  "px-3 py-2 text-xs font-medium rounded-lg border transition-colors",
                  signaturePosition === position
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                )}
              >
                {position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}