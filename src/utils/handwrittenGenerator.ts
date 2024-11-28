import { generateAITestimonial } from './openai';
import type { HandwrittenFormData, HandwrittenTestimonial } from '../types';

const DEFAULT_AUTHOR = {
  name: 'Sarah Johnson',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
};

export async function generateHandwrittenTestimonial(form: HandwrittenFormData): Promise<HandwrittenTestimonial> {
  try {
    // Generate content using OpenAI
    const content = await generateAITestimonial(
      'handwritten',
      { 
        description: form.productInfo,
        companyName: form.productInfo.startsWith('http') ? new URL(form.productInfo).hostname : undefined
      },
      form.tone
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
      tone: form.tone,
      author: {
        name: DEFAULT_AUTHOR.name,
        avatar: DEFAULT_AUTHOR.avatar
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