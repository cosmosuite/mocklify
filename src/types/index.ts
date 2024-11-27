export type Platform = 'facebook' | 'twitter' | 'trustpilot' | 'email' | 'handwritten';
export type Tone = 'positive' | 'neutral' | 'negative' | 'enthusiastic' | 'professional' | 'casual' | 'grateful';
export type FacebookReaction = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface SocialMetrics {
  likes: number;
  comments?: number;
  retweets?: number;
  timeAgo: string;
  bookmarks?: number;
  reactions?: FacebookReaction[];
  views?: number;
  isVerified?: boolean;
  rating?: number;
  usefulCount?: number;
  dateOfExperience?: string;
  location?: string;
  reviewCount?: number;
  // Handwritten specific metrics
  font?: string;
  background?: {
    style: 'classic' | 'notepad' | 'journal' | 'custom';
    color: string;
  };
  text?: {
    color: string;
    size: number;
    lineHeight: number;
  };
  subject?: string;
  starred?: boolean;
  important?: boolean;
  senderName?: string;
  senderEmail?: string;
  attachments?: string[];
}

export interface HandwrittenFormData {
  productInfo: string;
  tone: 'enthusiastic' | 'professional' | 'casual' | 'grateful';
  length: 'short' | 'medium' | 'long';
  aspects: string[];
  font: string;
  background: {
    style: 'classic' | 'notepad' | 'journal' | 'custom';
    color: string;
  };
  text: {
    color: string;
    size: number;
    lineHeight: number;
    includeSignature: boolean;
  };
}

export interface HandwrittenTestimonial {
  id: string;
  platform: 'handwritten';
  content: string;
  productInfo: string;
  tone: 'enthusiastic' | 'professional' | 'casual' | 'grateful';
  author: {
    name: string;
  };
  timestamp: Date;
  style: {
    font: string;
    background: {
      style: 'classic' | 'notepad' | 'journal' | 'custom';
      color: string;
    };
    text: {
      color: string;
      size: number;
      lineHeight: number;
    };
  };
}

export interface TestimonialForm {
  platform: Platform;
  productInfo: string;
  tone: Tone;
  metrics: SocialMetrics;
}

export interface GeneratedTestimonial {
  id: string;
  platform: Platform;
  content: string;
  title?: string;
  author: {
    name: string;
    handle?: string;
    avatar?: string;
    email?: string;
    isVerified?: boolean;
    location?: string;
    reviewCount?: number;
  };
  timestamp: Date;
  metrics: SocialMetrics;
  productInfo?: string;
}