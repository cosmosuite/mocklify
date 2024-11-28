import { useState, useEffect } from 'react';
import { HandwrittenForm } from './HandwrittenForm';
import { HandwrittenPreview } from './HandwrittenPreview';
import { generateHandwrittenTestimonial } from '../../utils/handwrittenGenerator';
import { saveHandwrittenTestimonial } from '../../utils/db';
import type { HandwrittenFormData, HandwrittenTestimonial as HandwrittenTestimonialType } from '../../types';

import { paperBackgrounds } from './BackgroundSelector';

export function HandwrittenTestimonial() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<HandwrittenTestimonialType | null>(null);
  const [formData, setFormData] = useState<HandwrittenFormData>({
    productInfo: '',
    authorName: '',
    tone: 'enthusiastic',
    length: 'medium',
    aspects: ['quality'],
    font: 'qe-caroline', // Set default font
    background: {
      style: 'classic',
      color: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15cb83c394c922e1bf3.png'
    },
    text: {
      color: '#000000',
      size: 18,
      lineHeight: 1.8
    }
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: HandwrittenFormData) => {
    if (!form) return;
    
    setError(null);
    setIsLoading(true);

    try {
      const generated = await generateHandwrittenTestimonial(form);
      const savedTestimonial = await saveHandwrittenTestimonial(generated);
      setCurrentTestimonial(savedTestimonial);
    } catch (error) {
      console.error('Failed to generate testimonial:', error);
      setError('Failed to generate testimonial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: keyof HandwrittenFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {error && (
        <div className="mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-[#0F0F0F]">{error}</p>
          </div>
        </div>
      )}

      <div className="testimonial-layout">
        {/* Form Section */}
        <div className="testimonial-form">
          <HandwrittenForm 
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>

        {/* Preview Section */}
        <div className="testimonial-preview">
          <HandwrittenPreview 
            testimonial={currentTestimonial}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}