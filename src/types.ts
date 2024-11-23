export type Platform = 'facebook' | 'twitter' | 'trustpilot' | 'email';
export type Tone = 'positive' | 'neutral' | 'negative';
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
  // Trustpilot specific metrics
  rating?: number;
  usefulCount?: number;
  dateOfExperience?: string;
  location?: string;
  reviewCount?: number;
  // Email specific metrics
  subject?: string;
  starred?: boolean;
  important?: boolean;
  senderName?: string;
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
    avatar: string;
    isVerified?: boolean;
    location?: string;
    reviewCount?: number;
  };
  timestamp: Date;
  metrics: SocialMetrics;
  productInfo?: string;
}