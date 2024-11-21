import { supabase } from '../lib/supabase';
import type { GeneratedTestimonial, TestimonialForm } from '../types';

export async function saveTestimonial(
  testimonial: GeneratedTestimonial,
  form: TestimonialForm
): Promise<GeneratedTestimonial> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        id: testimonial.id,
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
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return testimonial;
  } catch (error) {
    console.error('Failed to save testimonial:', error);
    // Return the original testimonial even if save fails
    // This allows the UI to still work while we handle the error
    return testimonial;
  }
}

export async function getTestimonials(): Promise<GeneratedTestimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data.map(transformDatabaseTestimonial);
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    return [];
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    throw error;
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
    const { data, error } = await supabase
      .from('payment_notifications')
      .insert({
        platform: formData.platform,
        currency: formData.currency,
        recipients: formData.platform === 'stripe' ? formData.stripeRecipients : formData.paypalRecipients,
        wallpaper: formData.wallpaper,
        custom_background: formData.customBackground
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save payment notification:', error);
    throw error;
  }
}

export async function getPaymentNotifications(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('payment_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Failed to get payment notifications:', error);
    return [];
  }
}

export async function deletePaymentNotification(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('payment_notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete payment notification:', error);
    throw error;
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