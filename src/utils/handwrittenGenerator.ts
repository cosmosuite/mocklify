import { generateAITestimonial } from './openai';
import type { HandwrittenFormData, HandwrittenTestimonial } from '../types';

export async function generateHandwrittenTestimonial(form: HandwrittenFormData): Promise<HandwrittenTestimonial> {
  try {
    // Generate content using OpenAI
    const content = await generateAITestimonial(
      'handwritten',
      { description: form.productInfo },
      form.tone
    );

    if (!content) {
      throw new Error('Failed to generate content');
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'handwritten',
      content,
      productInfo: form.productInfo,
      tone: form.tone,
      author: {
        name: 'Sarah Johnson'
      },
      timestamp: new Date(),
      style: {
        font: form.font,
        background: form.background,
        text: {
          color: form.text.color,
          size: form.text.size,
          lineHeight: form.text.lineHeight
        }
      }
    };
  } catch (error) {
    console.error('Failed to generate handwritten testimonial:', error);
    throw error;
  }
}