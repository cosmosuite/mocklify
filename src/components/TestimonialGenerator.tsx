import { useState } from 'react';
import { TestimonialList } from './TestimonialList';
import { generateTestimonial } from '../utils/testimonialGenerator';
import { saveTestimonial } from '../utils/db';
import type { GeneratedTestimonial, TestimonialForm as TestimonialFormType, SocialMetrics } from '../types';
import { TestimonialForm } from './testimonial-form';

export function TestimonialGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState<GeneratedTestimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: TestimonialFormType) => {
    if (!form) return;
    
    setError(null);
    setIsLoading(true);

    try {
      const generated = await generateTestimonial(form);
      await saveTestimonial(generated, form);
      setCurrentTestimonials(prev => [generated, ...prev]);
    } catch (error) {
      console.error('Failed to generate testimonial:', error);
      setError('Failed to generate testimonial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricsUpdate = async (id: string, metrics: SocialMetrics) => {
    setCurrentTestimonials(prev => 
      prev.map(testimonial => 
        testimonial.id === id 
          ? { ...testimonial, metrics }
          : testimonial
      )
    );
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
          <TestimonialForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Testimonials Section */}
        <div className="testimonial-list">
          {currentTestimonials.length > 0 || isLoading ? (
            <TestimonialList
              testimonials={currentTestimonials}
              onEdit={() => {}}
              onMetricsUpdate={handleMetricsUpdate}
              isLoading={isLoading}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-[#0F0F0F]">
                Generated testimonials will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}