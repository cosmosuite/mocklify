import { useState, useEffect } from 'react';
import { HandwrittenForm } from './HandwrittenForm';
import { HandwrittenPreview } from './HandwrittenPreview';
import { generateHandwrittenTestimonial } from '../../utils/handwrittenGenerator';
import { saveHandwrittenTestimonial } from '../../utils/db';
import type { HandwrittenFormData, HandwrittenTestimonial as HandwrittenTestimonialType } from '../../types';

export function HandwrittenTestimonial() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<HandwrittenTestimonialType | null>(null);
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
          <HandwrittenForm onSubmit={handleSubmit} isLoading={isLoading} />
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