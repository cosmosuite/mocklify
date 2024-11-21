import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { processBackgroundImage } from '../../utils/imageProcessor';

interface Props {
  onBackgroundChange: (background: string | null) => void;
}

export function BackgroundUploader({ onBackgroundChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processBackgroundImage(file);
      
      if (result.error) {
        setError(result.error);
        setPreview(null);
        onBackgroundChange(null);
      } else {
        setPreview(result.url);
        onBackgroundChange(result.url);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setPreview(null);
      onBackgroundChange(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const clearPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setError(null);
    onBackgroundChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-colors
          ${isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
          ${error ? 'border-red-200' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="sr-only"
        />

        <div className="p-4">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 size={24} className="animate-spin text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Processing image...</p>
            </div>
          ) : preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Background preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 flex flex-col items-center justify-center"
            >
              <Upload size={24} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Recommended size: 1290×2796px
              </p>
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}