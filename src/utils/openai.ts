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
  
  // Create a context string that includes company and product names if available
  const context = `
Product/Service: ${productInfo.productName || 'the product'}
Company: ${productInfo.companyName || 'the company'}
Description: ${productInfo.description}
  `.trim();

  let prompt = '';

  if (platform === 'facebook') {
    prompt = `Write a ${tone} Facebook comment as if you're casually talking to friends about your genuine experience with ${productInfo.companyName || 'a company'}. The tone should be completely natural and conversational.

Context:
${context}

Key guidelines:
- Write exactly like you're posting on Facebook
- Mention the company/product name naturally if provided
- Include real-world context (e.g., "just tried ${productInfo.productName || 'this'} yesterday", "been using it for a week")
- Focus on 1-2 specific details that matter to real users
- Keep it ${tone} but believable - no extreme reactions
- Use natural speech patterns with occasional emojis
- Skip hashtags completely
- Limit to ${maxLength} characters

Examples of natural posts:
"Finally tried ${productInfo.productName || 'their service'} that everyone's been talking about 🍽️ Gotta say, the quality is actually amazing and it's exactly what I needed!"
"Been using ${productInfo.companyName || 'their'} platform for about a month now. The learning curve was worth it - my workflow has improved so much 😅"
"Eh, not really impressed with ${productInfo.companyName || 'their'} support. Took forever to get a response and they didn't really solve my issue 🤷‍♀️"`;
  } else if (platform === 'twitter') {
    prompt = `Write a ${tone} tweet as if you're casually talking to friends about your experience with ${productInfo.companyName || 'a company'}. The tone should be completely natural and conversational.

Context:
${context}

Key guidelines:
- Write exactly like you're tweeting to followers
- Mention the company/product name naturally if provided
- Include real-world context (e.g., "just got ${productInfo.productName || 'this'} last week")
- Focus on 1-2 specific details that matter to real users
- Keep it ${tone} but believable - no extreme reactions
- Use natural speech patterns with occasional pauses
- Skip hashtags completely
- Limit to ${maxLength} characters

Examples of natural tweets:
"finally tried ${productInfo.productName || 'their product'} everyone's been talking about. ngl the quality is actually amazing and it's exactly what I needed"
"been using ${productInfo.companyName || 'their'} platform for about a month now. learning curve was worth it - workflow improved so much lol"
"not really impressed with ${productInfo.companyName || 'their'} support tbh. took forever to get a response and they didn't even solve my issue"`;
  } else if (platform === 'trustpilot') {
    prompt = `Generate a ${tone} Trustpilot review for ${productInfo.companyName || 'the company'} with a concise title (3-7 words) and detailed review content.

Context:
${context}

Title guidelines:
- Keep it short and impactful (3-7 words)
- Match the ${tone} sentiment
- Focus on key aspects like service quality, support, pricing, or experience
- Use Trustpilot's natural, direct style
- Include company/product name if it fits naturally
- Avoid marketing language

Review guidelines:
- Write naturally, like a real customer review
- Mention the company/product name early in the review
- Include specific details about the experience
- Keep the tone ${tone} but believable
- Add context about usage duration or specific interactions
- Focus on 2-3 main points
- Skip technical jargon

Format the response as:
[Title]
[Review Content]`;
  } else if (platform === 'handwritten') {
    prompt = `Write a ${tone} handwritten testimonial about your experience with ${productInfo.companyName || 'the product/service'}. The tone should be personal and authentic.

Context:
${context}

Key guidelines:
- Write in a natural, personal voice
- Include specific details about your experience
- Keep the tone ${tone} but genuine
- Focus on emotional connection and real impact
- Use natural pauses and flow
- Avoid business jargon
- Include a natural conclusion

Examples of natural handwritten testimonials:
"I can't express how grateful I am for discovering this amazing service. It's transformed the way I work and brought so much joy to my daily routine."
"From the moment I started using this product, I knew it was different. The attention to detail and quality is exactly what I've been looking for."
"What stands out most is how much time and effort this has saved me. I honestly can't imagine going back to my old way of doing things."`;

  } else {
    prompt = `Generate a ${tone} email testimonial about ${productInfo.companyName || 'the company'} with a concise subject line and detailed content.

Context:
${context}

Subject line guidelines:
- Keep it short and impactful (5-10 words)
- Match the ${tone} sentiment
- Focus on key aspects of the experience
- Use natural, professional language
- Include company/product name if it fits naturally

Email content guidelines:
- Write naturally, like a real customer email
- Mention the company/product name in the first paragraph
- Include specific details about the experience
- Keep the tone ${tone} but professional and believable
- Add context about usage duration or specific interactions
- Focus on 2-3 main points
- Use proper email formatting and etiquette
- End with a proper email signature including:
  * A line break after the main content
  * "Best regards," or similar closing
  * The sender's name "${senderName}" on a new line (IMPORTANT: Always use this exact name)

Format the response as:
[Subject Line]
[Email Content]
[Empty Line]
[Closing]
${senderName}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.92,
      max_tokens: maxLength,
      presence_penalty: 0.9,
      frequency_penalty: 0.9
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