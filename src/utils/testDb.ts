import { saveTestimonial, getTestimonials, deleteTestimonial, savePaymentNotification, getPaymentNotifications, deletePaymentNotification } from './db';
import type { GeneratedTestimonial, TestimonialForm } from '../types';

// Test data
const mockTestimonial: GeneratedTestimonial = {
  id: 'test-' + Date.now(),
  platform: 'twitter',
  content: 'This is a test testimonial',
  title: 'Test Title',
  author: {
    name: 'Test User',
    handle: 'testuser',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    isVerified: true
  },
  timestamp: new Date(),
  metrics: {
    likes: 42,
    comments: 5,
    retweets: 3,
    timeAgo: '2h'
  },
  productInfo: 'Test product info'
};

const mockForm: TestimonialForm = {
  platform: 'twitter',
  productInfo: 'Test product info',
  tone: 'positive',
  metrics: {
    likes: 42,
    comments: 5,
    retweets: 3,
    timeAgo: '2h'
  }
};

const mockPaymentNotification = {
  platform: 'stripe' as const,
  stripeRecipients: [{
    identifier: 'test@example.com',
    amount: '100.00',
    timestamp: '2m ago'
  }],
  paypalRecipients: [],
  currency: 'USD',
  wallpaper: 'https://example.com/bg.jpg'
};

export async function testSaveTestimonial() {
  console.log('Testing saveTestimonial...');
  try {
    const saved = await saveTestimonial(mockTestimonial, mockForm);
    console.log('✅ Testimonial saved successfully:', saved.id);
    return saved;
  } catch (error) {
    console.error('❌ Failed to save testimonial:', error);
    throw error;
  }
}

export async function testGetTestimonials() {
  console.log('Testing getTestimonials...');
  try {
    const testimonials = await getTestimonials();
    console.log('✅ Retrieved testimonials:', testimonials.length);
    return testimonials;
  } catch (error) {
    console.error('❌ Failed to get testimonials:', error);
    throw error;
  }
}

export async function testDeleteTestimonial(id: string) {
  console.log('Testing deleteTestimonial...');
  try {
    await deleteTestimonial(id);
    console.log('✅ Testimonial deleted successfully:', id);
  } catch (error) {
    console.error('❌ Failed to delete testimonial:', error);
    throw error;
  }
}

export async function testSavePaymentNotification() {
  console.log('Testing savePaymentNotification...');
  try {
    const saved = await savePaymentNotification(mockPaymentNotification);
    console.log('✅ Payment notification saved successfully:', saved.id);
    return saved;
  } catch (error) {
    console.error('❌ Failed to save payment notification:', error);
    throw error;
  }
}

export async function testGetPaymentNotifications() {
  console.log('Testing getPaymentNotifications...');
  try {
    const notifications = await getPaymentNotifications();
    console.log('✅ Retrieved payment notifications:', notifications.length);
    return notifications;
  } catch (error) {
    console.error('❌ Failed to get payment notifications:', error);
    throw error;
  }
}

export async function testDeletePaymentNotification(id: string) {
  console.log('Testing deletePaymentNotification...');
  try {
    await deletePaymentNotification(id);
    console.log('✅ Payment notification deleted successfully:', id);
  } catch (error) {
    console.error('❌ Failed to delete payment notification:', error);
    throw error;
  }
}

export async function runAllTests() {
  try {
    // Test testimonial operations
    const savedTestimonial = await testSaveTestimonial();
    await testGetTestimonials();
    if (savedTestimonial) {
      await testDeleteTestimonial(savedTestimonial.id);
    }

    // Test payment notification operations
    const savedNotification = await testSavePaymentNotification();
    await testGetPaymentNotifications();
    if (savedNotification) {
      await testDeletePaymentNotification(savedNotification.id);
    }

    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}