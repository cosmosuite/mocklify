import { supabase } from '../lib/supabase';
import type { GeneratedTestimonial, TestimonialForm, HandwrittenTestimonial } from '../types';

export async function saveTestimonial(
  testimonial: GeneratedTestimonial,
  form: TestimonialForm
): Promise<GeneratedTestimonial> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Handle handwritten testimonials separately
    if (form.platform === 'handwritten') {
      const { error } = await supabase
        .from('handwritten_testimonials')
        .insert({
          id: testimonial.id,
          user_id: user.id,
          content: testimonial.content,
          author_name: testimonial.author.name,
          product_info: form.productInfo,
          tone: form.tone,
          font: form.metrics.font,
          background_style: form.metrics.background?.style,
          background_color: form.metrics.background?.color,
          text_color: form.metrics.text?.color,
          text_size: form.metrics.text?.size,
          line_height: form.metrics.text?.lineHeight,
          include_signature: form.metrics.text?.includeSignature
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return testimonial;
    }

    // Save to Supabase
    const { error } = await supabase
      .from('testimonials')
      .insert({
        id: testimonial.id,
        user_id: user.id,
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
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return testimonial;
  } catch (error) {
    console.error('Failed to save testimonial:', error);
    throw error;
  }
}

export async function saveHandwrittenTestimonial(testimonial: HandwrittenTestimonial): Promise<HandwrittenTestimonial> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('handwritten_testimonials')
      .insert({
        id: testimonial.id,
        user_id: user.id,
        content: testimonial.content,
        author_name: testimonial.author.name,
        product_info: testimonial.productInfo,
        tone: testimonial.tone,
        font: testimonial.style.font,
        background_style: testimonial.style.background.style,
        background_color: testimonial.style.background.color,
        text_color: testimonial.style.text.color,
        text_size: testimonial.style.text.size,
        line_height: testimonial.style.text.lineHeight,
        include_signature: true
      });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return testimonial;
  } catch (error) {
    console.error('Failed to save handwritten testimonial:', error);
    throw error;
  }
}

export async function getTestimonials(): Promise<GeneratedTestimonial[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data.map(transformDatabaseTestimonial);
  } catch (error) {
    console.error('Failed to get testimonials:', error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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
  stripeRecipients: Array<{
    identifier: string;
    amount: string;
    timestamp: string;
  }>;
  paypalRecipients: Array<{
    identifier: string;
    amount: string;
    timestamp: string;
  }>;
  currency: string;
  wallpaper: string;
  customBackground?: string | null;
}): Promise<any> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('payment_notifications')
      .insert({
        user_id: user.id,
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
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('payment_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to get payment notifications:', error);
    throw error;
  }
}

export async function deletePaymentNotification(id: string): Promise<void> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('payment_notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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

export async function getHandwrittenTestimonials(): Promise<HandwrittenTestimonial[]> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('handwritten_testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data.map(transformHandwrittenTestimonial);
  } catch (error) {
    console.error('Failed to get handwritten testimonials:', error);
    throw error;
  }
}

function transformHandwrittenTestimonial(dbTestimonial: any): HandwrittenTestimonial {
  return {
    id: dbTestimonial.id,
    platform: 'handwritten',
    content: dbTestimonial.content,
    author: {
      name: dbTestimonial.author_name
    },
    timestamp: new Date(dbTestimonial.created_at),
    style: {
      font: dbTestimonial.font,
      background: {
        style: dbTestimonial.background_style,
        color: dbTestimonial.background_color
      },
      text: {
        color: dbTestimonial.text_color,
        size: dbTestimonial.text_size,
        lineHeight: dbTestimonial.line_height
      }
    }
  };
}