import type { GeneratedTestimonial, TestimonialForm } from '../types';
import { scrapeWebsite } from './scraper';
import { generateAITestimonial } from './openai';

// Define complete personas with matching names, handles, and avatars
const PERSONAS = [
  {
    name: 'Sarah Johnson',
    handle: 'sarah_tech',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    gender: 'female',
    location: 'US',
    email: 'sarah.johnson@example.com'
  },
  {
    name: 'Michael Chen',
    handle: 'mike_codes',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
    gender: 'male',
    location: 'CA',
    email: 'michael.chen@example.com'
  },
  {
    name: 'Emma Wilson',
    handle: 'emma_designs',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    gender: 'female',
    location: 'UK',
    email: 'emma.wilson@example.com'
  },
  {
    name: 'David Rodriguez',
    handle: 'david_r',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    gender: 'male',
    location: 'ES',
    email: 'david.rodriguez@example.com'
  },
  {
    name: 'Lisa Thompson',
    handle: 'lisa_creates',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    gender: 'female',
    location: 'AU',
    email: 'lisa.thompson@example.com'
  }
];

function getTimestampFromAgo(timeAgo: string): Date {
  const now = new Date();
  const value = parseInt(timeAgo);
  const unit = timeAgo.slice(-1);

  switch (unit) {
    case 'y':
      now.setFullYear(now.getFullYear() - value);
      break;
    case 'w':
      now.setDate(now.getDate() - (value * 7));
      break;
    case 'd':
      now.setDate(now.getDate() - value);
      break;
    case 'h':
      now.setHours(now.getHours() - value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() - value);
      break;
    default:
      now.setHours(now.getHours() - 1);
  }

  return now;
}

async function extractProductInfo(input: string): Promise<{ description: string; companyName?: string; productName?: string; }> {
  try {
    const isUrl = input.startsWith('http://') || input.startsWith('https://');
    
    if (!isUrl) {
      return { description: input };
    }

    const { text, companyName, productName, error } = await scrapeWebsite(input);
    
    if (error) {
      console.warn('Scraping warning:', error);
    }

    return {
      description: text,
      companyName,
      productName
    };
  } catch (error) {
    console.error('Error in extractProductInfo:', error);
    return { description: input };
  }
}

export async function generateTestimonial(form: TestimonialForm): Promise<GeneratedTestimonial> {
  try {
    const productInfo = await extractProductInfo(form.productInfo);
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    
    // Ensure avatar is always set
    const avatar = `${persona.avatar}?w=100&h=100&fit=crop&crop=faces`;

    // Generate content using OpenAI with enhanced context
    const generatedContent = await generateAITestimonial(
      form.platform,
      productInfo,
      form.tone,
      form.platform === 'email' ? form.metrics.senderName || persona.name : undefined
    );

    if (!generatedContent) {
      throw new Error('Failed to generate content');
    }

    let title: string | undefined;
    let content: string;

    // Split title and content for Trustpilot and Email
    if (form.platform === 'trustpilot' || form.platform === 'email') {
      const [firstLine, ...rest] = generatedContent.split('\n');
      title = firstLine.replace(/^["']|["']$/g, ''); // Remove quotes if present
      content = rest.join('\n').trim();
    } else {
      content = generatedContent;
    }

    // Ensure metrics are properly structured
    const metrics = {
      likes: form.metrics.likes || 0,
      comments: form.platform === 'twitter' ? form.metrics.comments || 0 : undefined,
      retweets: form.platform === 'twitter' ? form.metrics.retweets || 0 : undefined,
      bookmarks: form.platform === 'twitter' ? form.metrics.bookmarks || 0 : undefined,
      reactions: form.platform === 'facebook' ? form.metrics.reactions || ['like'] : undefined,
      views: form.platform === 'twitter' ? form.metrics.views || 0 : undefined,
      timeAgo: form.metrics.timeAgo || '2h',
      rating: form.platform === 'trustpilot' ? form.metrics.rating || 4 : undefined,
      usefulCount: form.platform === 'trustpilot' ? form.metrics.usefulCount || 0 : undefined,
      dateOfExperience: form.platform === 'trustpilot' ? form.metrics.dateOfExperience : undefined,
      subject: form.platform === 'email' ? form.metrics.subject : undefined,
      attachments: form.platform === 'email' ? form.metrics.attachments : undefined,
      starred: form.platform === 'email' ? form.metrics.starred : undefined,
      important: form.platform === 'email' ? form.metrics.important : undefined,
      senderName: form.platform === 'email' ? form.metrics.senderName : undefined,
      senderEmail: form.platform === 'email' ? form.metrics.senderEmail : undefined
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      platform: form.platform,
      content,
      title,
      author: {
        name: form.platform === 'email' ? form.metrics.senderName || persona.name : persona.name,
        handle: ['twitter', 'facebook'].includes(form.platform) ? persona.handle : undefined,
        email: form.platform === 'email' ? form.metrics.senderEmail || persona.email : undefined,
        avatar: avatar,
        isVerified: form.platform === 'twitter' ? form.metrics.isVerified : form.platform === 'trustpilot',
        location: form.platform === 'trustpilot' ? form.metrics.location || persona.location : undefined,
        reviewCount: form.platform === 'trustpilot' ? form.metrics.reviewCount : undefined
      },
      timestamp: getTimestampFromAgo(form.metrics.timeAgo),
      metrics: {
        ...metrics
      },
      productInfo: productInfo.description
    };
  } catch (error) {
    console.error('Failed to generate testimonial:', error);
    throw new Error('Failed to generate testimonial. Please try again.');
  }
}