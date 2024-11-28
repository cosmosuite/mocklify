import { toPng } from 'html-to-image';
import type { HandwrittenTestimonial } from '../types';

const downloadOptions = {
  quality: 0.95,
  pixelRatio: 2,
  skipAutoScale: true,
  cacheBust: true,
  style: {
    margin: '0',
    padding: '0',
    overflow: 'hidden'
  }
};

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.getElementsByTagName('img'));
  const loadPromises = images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', () => {
        console.warn(`Failed to load image: ${img.src}`);
        resolve(); // Don't reject, just continue
      });
    });
  });

  await Promise.all(loadPromises);
}

async function prepareElementForDownload(element: HTMLElement): Promise<() => void> {
  // Store original styles
  const originalStyles = {
    width: element.style.width,
    height: element.style.height,
    transform: element.style.transform,
    transition: element.style.transition,
    margin: element.style.margin,
    padding: element.style.padding,
    overflow: element.style.overflow,
    background: element.style.background,
    backgroundImage: element.style.backgroundImage,
    backgroundSize: element.style.backgroundSize,
    backgroundPosition: element.style.backgroundPosition
  };

  // Wait for any animations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Wait for images to load
  await waitForImages(element);

  // Get computed styles
  const computedStyle = window.getComputedStyle(element);

  // Apply styles for screenshot
  element.style.transform = 'none';
  element.style.transition = 'none';
  element.style.margin = '0';
  element.style.padding = '0';
  element.style.overflow = 'hidden';

  // Preserve background styles
  element.style.background = computedStyle.background;
  element.style.backgroundImage = computedStyle.backgroundImage;
  element.style.backgroundSize = computedStyle.backgroundSize;
  element.style.backgroundPosition = computedStyle.backgroundPosition;

  // Force layout recalculation
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Return cleanup function
  return () => {
    Object.assign(element.style, originalStyles);
  };
}

export async function downloadHandwrittenTestimonial(testimonial: HandwrittenTestimonial): Promise<void> {
  const element = document.getElementById(`handwritten-${testimonial.id}`);
  
  if (!element) {
    throw new Error('Testimonial element not found');
  }

  let cleanup: (() => void) | null = null;
  try {
    cleanup = await prepareElementForDownload(element);

    // Get element dimensions
    const rect = element.getBoundingClientRect();
    const options = {
      ...downloadOptions,
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height)
    };

    const dataUrl = await toPng(element, options);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.download = `handwritten-testimonial-${testimonial.id}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw new Error('Failed to generate image. Please try again.');
  } finally {
    if (cleanup) cleanup();
  }
}