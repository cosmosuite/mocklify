import { supabase } from '../lib/supabase';
import type { GeneratedTestimonial, TestimonialForm } from '../types';
import type { Database } from '../types/database';

// Fallback to localStorage if Supabase is not available
const STORAGE_KEYS = {
  TESTIMONIALS: 'testimonials_history',
  PAYMENTS: 'payment_history'
} as const;

export async function saveTestimonial(
  testimonial: GeneratedTestimonial,
  form: TestimonialForm
): Promise<GeneratedTestimonial> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          id: testimonial.id,
          user_id: userId,
          platform: testimonial.platform,
          content: testimonial.content,
          title: testimonial.title,
          author_name: testimonial.author.name,
          author_handle: testimonial.author.handle,
          author_avatar: testimonial.author.avatar,
          author_location: testimonial.author.location,
          author_verified: testimonial.author.isVerified,
          author_review_count: testimonial.author.reviewCount,
          metrics: testimonial.metrics,
          tone: form.tone,
          product_info: form.productInfo
        } satisfies Database['public']['Tables']['testimonials']['Insert']);

      if (error) {
        console.warn('Supabase save failed, falling back to localStorage:', error);
      } else {
        return testimonial;
      }
    }

    // Fallback to localStorage
    const key = userId ? `${STORAGE_KEYS.TESTIMONIALS}_${userId}` : STORAGE_KEYS.TESTIMONIALS;
    const savedTestimonials = JSON.parse(localStorage.getItem(key) || '[]');
    savedTestimonials.unshift(testimonial);
    localStorage.setItem(key, JSON.stringify(savedTestimonials));
    return testimonial;

  } catch (error) {
    console.error('Failed to save testimonial:', error);
    // Always fallback to localStorage on error
    const savedTestimonials = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
    savedTestimonials.unshift(testimonial);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(savedTestimonials));
    return testimonial;
  }
}

export async function getTestimonials(): Promise<GeneratedTestimonial[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(transformDatabaseTestimonial);
      }
    }

    // Fallback to localStorage
    const key = userId ? `${STORAGE_KEYS.TESTIMONIALS}_${userId}` : STORAGE_KEYS.TESTIMONIALS;
    const savedTestimonials = localStorage.getItem(key);
    return savedTestimonials ? JSON.parse(savedTestimonials) : [];

  } catch (error) {
    console.error('Failed to get testimonials:', error);
    // Fallback to localStorage
    const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    return savedTestimonials ? JSON.parse(savedTestimonials) : [];
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) {
        return;
      }
    }

    // Fallback to localStorage
    const key = userId ? `${STORAGE_KEYS.TESTIMONIALS}_${userId}` : STORAGE_KEYS.TESTIMONIALS;
    const savedTestimonials = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = savedTestimonials.filter((t: GeneratedTestimonial) => t.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));

  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    // Fallback to localStorage
    const savedTestimonials = JSON.parse(localStorage.getItem(STORAGE_KEYS.TESTIMONIALS) || '[]');
    const filtered = savedTestimonials.filter((t: GeneratedTestimonial) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(filtered));
  }
}

export async function savePaymentNotification(formData: {
  platform: 'stripe' | 'paypal';
  stripeRecipients: Array<{ identifier: string; amount: string; timestamp: string; }>;
  paypalRecipients: Array<{ identifier: string; amount: string; timestamp: string; }>;
  currency: string;
  wallpaper: string;
  customBackground: string | null;
}): Promise<any> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { data, error } = await supabase
        .from('payment_notifications')
        .insert({
          user_id: userId,
          platform: formData.platform,
          currency: formData.currency,
          recipients: formData.platform === 'stripe' ? formData.stripeRecipients : formData.paypalRecipients,
          wallpaper: formData.wallpaper,
          custom_background: formData.customBackground
        } satisfies Database['public']['Tables']['payment_notifications']['Insert'])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    }

    // Fallback to localStorage
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      created_at: new Date().toISOString()
    };
    const key = userId ? `${STORAGE_KEYS.PAYMENTS}_${userId}` : STORAGE_KEYS.PAYMENTS;
    const savedNotifications = JSON.parse(localStorage.getItem(key) || '[]');
    savedNotifications.unshift(notification);
    localStorage.setItem(key, JSON.stringify(savedNotifications));
    return notification;

  } catch (error) {
    console.error('Failed to save payment notification:', error);
    // Fallback to localStorage
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      created_at: new Date().toISOString()
    };
    const savedNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    savedNotifications.unshift(notification);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(savedNotifications));
    return notification;
  }
}

export async function getPaymentNotifications(): Promise<any[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { data, error } = await supabase
        .from('payment_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data;
      }
    }

    // Fallback to localStorage
    const key = userId ? `${STORAGE_KEYS.PAYMENTS}_${userId}` : STORAGE_KEYS.PAYMENTS;
    const savedNotifications = localStorage.getItem(key);
    return savedNotifications ? JSON.parse(savedNotifications) : [];

  } catch (error) {
    console.error('Failed to get payment notifications:', error);
    // Fallback to localStorage
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  }
}

export async function deletePaymentNotification(id: string): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Try Supabase first
    if (userId) {
      const { error } = await supabase
        .from('payment_notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) {
        return;
      }
    }

    // Fallback to localStorage
    const key = userId ? `${STORAGE_KEYS.PAYMENTS}_${userId}` : STORAGE_KEYS.PAYMENTS;
    const savedNotifications = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = savedNotifications.filter((n: any) => n.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));

  } catch (error) {
    console.error('Failed to delete payment notification:', error);
    // Fallback to localStorage
    const savedNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
    const filtered = savedNotifications.filter((n: any) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(filtered));
  }
}

function transformDatabaseTestimonial(dbTestimonial: any): GeneratedTestimonial {
  return {
    id: dbTestimonial.id,
    platform: dbTestimonial.platform,
    content: dbTestimonial.content,
    title: dbTestimonial.title,
    author: {
      name: dbTestimonial.author_name,
      handle: dbTestimonial.author_handle,
      avatar: dbTestimonial.author_avatar,
      location: dbTestimonial.author_location,
      isVerified: dbTestimonial.author_verified,
      reviewCount: dbTestimonial.author_review_count
    },
    timestamp: new Date(dbTestimonial.created_at),
    metrics: dbTestimonial.metrics,
    productInfo: dbTestimonial.product_info
  };
}