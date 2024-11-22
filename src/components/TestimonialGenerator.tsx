import { useState } from 'react';
import { TestimonialList } from './TestimonialList';
import { generateTestimonial } from '../utils/testimonialGenerator';
import { saveTestimonial } from '../utils/db';
import type { GeneratedTestimonial, TestimonialForm as TestimonialFormType } from '../types';
import { TestimonialForm } from './testimonial-form';

export function TestimonialGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState<GeneratedTestimonial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generationQueue, setGenerationQueue] = useState<number>(0);

  const handleSubmit = async (form: TestimonialFormType) => {
    if (isLoading) return;
    
    setError(null);
    setGenerationQueue(prev => prev + 1);
    setIsLoading(true);

    try {
      // Generate the testimonial
      const generated = await generateTestimonial(form);
      
      // Save to database
      await saveTestimonial(generated, form);
      
      // Update UI
      setCurrentTestimonials(prev => [generated, ...prev]);
      
      return generated;
    } catch (error) {
      console.error('Failed to generate testimonial:', error);
      setError('Failed to generate testimonial. Please try again.');
      throw error;
    } finally {
      setGenerationQueue(prev => prev - 1);
      if (generationQueue <= 1) {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (testimonialId: string) => {
    // Edit functionality will be implemented later
    console.log('Edit testimonial:', testimonialId);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {error && (
        <div className="mb-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
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
              onEdit={handleEdit}
              isLoading={isLoading}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">
                Generated testimonials will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}