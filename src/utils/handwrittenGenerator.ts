import { generateAITestimonial } from './openai';
import type { HandwrittenFormData, HandwrittenTestimonial } from '../types';

export const WORD_LIMITS = {
  short: 150,
  medium: 300,
  long: 500
} as const;

const DEFAULT_AUTHOR_NAME = 'Anonymous';

export async function generateHandwrittenTestimonial(form: HandwrittenFormData): Promise<HandwrittenTestimonial> {
  try {
    const authorName = form.authorName?.trim() || DEFAULT_AUTHOR_NAME;
    
    // Generate content using OpenAI
    const content = await generateAITestimonial(
      'handwritten',
      { 
        description: `${form.productInfo} [LENGTH:${form.length}]`,
        companyName: form.productInfo.startsWith('http') ? new URL(form.productInfo).hostname : undefined,
        authorName
      },
      form.tone || 'enthusiastic' // Ensure tone is never null
    );

    if (!content) {
      throw new Error('Failed to generate content');
    }

    // Create testimonial object
    return {
      id: Math.random().toString(36).substr(2, 9),
      platform: 'handwritten',
      content,
      productInfo: form.productInfo,
      author: {
        name: authorName
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