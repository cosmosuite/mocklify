import { useState } from 'react';
import { TestimonialForm } from './TestimonialForm';
import { TestimonialList } from './TestimonialList';
import { generateTestimonial } from '../utils/testimonialGenerator';
import { saveTestimonial } from '../utils/db';
import type { GeneratedTestimonial, TestimonialForm as TestimonialFormType } from '../types';

export function TestimonialGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonials, setCurrentTestimonials] = useState<GeneratedTestimonial[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (form: TestimonialFormType) => {
    setIsLoading(true);
    setError(null);
    try {
      // Generate the testimonial
      const generated = await generateTestimonial(form);
      
      // Save to database and localStorage
      await saveTestimonial(generated, form);
      
      // Update UI
      setCurrentTestimonials(prev => [generated, ...prev]);
      
      return generated;
    } catch (error) {
      console.error('Failed to generate testimonial:', error);
      setError('Failed to generate testimonial. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (_id: string) => {
    alert('Edit functionality would be implemented here');
  };

  const handleDownload = async (_testimonial: GeneratedTestimonial) => {
    // Download functionality will be implemented here
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

      <div className="flex gap-8">
        <div className="w-[400px] flex-shrink-0">
          <div className="sticky top-8">
            <TestimonialForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {currentTestimonials.length > 0 || isLoading ? (
            <TestimonialList
              testimonials={currentTestimonials}
              onEdit={handleEdit}
              onDownload={handleDownload}
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