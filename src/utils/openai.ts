import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not set in environment variables');
}

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

interface ProductContext {
  description: string;
  companyName?: string;
  productName?: string;
}

export async function generateAITestimonial(
  platform: 'facebook' | 'twitter' | 'trustpilot' | 'email' | 'handwritten',
  productInfo: ProductContext,
  tone: string,
  senderName?: string
): Promise<string> {
  const maxLength = platform === 'twitter' ? 280 : 1000;
  
  // Create a shorter context string
  const context = productInfo.description.slice(0, 500); // Limit description length

  let prompt = '';

  if (platform === 'facebook') {
    prompt = `Write a ${tone} Facebook comment about: ${context}\n\nMake it natural, conversational, and include 1-2 emojis. Limit to ${maxLength} chars.`;
  } else if (platform === 'twitter') {
    prompt = `Write a ${tone} tweet about: ${context}\n\nMake it casual and authentic. No hashtags. Limit to ${maxLength} chars.`;
  } else if (platform === 'trustpilot') {
    prompt = `Write a ${tone} Trustpilot review about: ${context}\n\nFormat as:\n[Short Title]\n[Review Content]\n\nBe specific and authentic. Focus on 2-3 key points.`;
  } else if (platform === 'handwritten') {
    prompt = `Write a ${tone} handwritten testimonial about: ${context}\n\nMake it personal and authentic. Focus on emotional impact and real experience.`;

  } else {
    prompt = `Write a ${tone} email testimonial about: ${context}\n\nFormat as:\n[Subject]\n[Content]\n\nBest regards,\n${senderName}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.85,
      max_tokens: maxLength,
      presence_penalty: 0.7,
      frequency_penalty: 0.7
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return response;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate testimonial');
  }
}