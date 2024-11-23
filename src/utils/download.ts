import JSZip from 'jszip';
import { toPng } from 'html-to-image';
import type { GeneratedTestimonial } from '../types';

const downloadOptions = {
  quality: 0.95,
  pixelRatio: 2,
  skipAutoScale: true,
  cacheBust: true,
  style: {
    margin: '0',
    padding: '24px',
    overflow: 'hidden',
    backgroundColor: '#000000'
  },
  filter: (node: HTMLElement) => {
    // Keep everything except loading spinners or temporary UI elements
    return !node.classList?.contains('loading-element');
  }
};

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.getElementsByTagName('img'));
  const loadPromises = images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
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
    backgroundColor: element.style.backgroundColor
  };

  // Wait for any animations to complete
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Wait for images to load
  await waitForImages(element);

  // Apply styles for screenshot
  element.style.transform = 'none';
  element.style.transition = 'none';
  element.style.margin = '0';
  element.style.padding = '24px';
  element.style.overflow = 'hidden';
  element.style.backgroundColor = '#000000';

  // Force layout recalculation
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Return cleanup function
  return () => {
    Object.assign(element.style, originalStyles);
  };
}

export async function downloadSingleTestimonial(testimonial: GeneratedTestimonial): Promise<void> {
  const element = document.getElementById(`${testimonial.platform}-${testimonial.id}`);
  
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
      width: Math.ceil(rect.width + 48), // Add padding to width
      height: Math.ceil(rect.height + 48) // Add padding to height
    };

    const dataUrl = await toPng(element, options);
    
    // Create and trigger download
    const link = document.createElement('a');
    link.download = `${testimonial.platform}-testimonial-${testimonial.id}.png`;
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

export async function downloadAllTestimonials(testimonials: GeneratedTestimonial[]): Promise<void> {
  const zip = new JSZip();
  const images = zip.folder('testimonials');

  if (!images) {
    throw new Error('Failed to create zip folder');
  }

  try {
    // Process testimonials sequentially to avoid memory issues
    const results = [];
    for (const testimonial of testimonials) {
      const element = document.getElementById(`${testimonial.platform}-${testimonial.id}`);
      
      if (!element) {
        console.warn(`Element not found for testimonial ${testimonial.id}`);
        continue;
      }

      let cleanup: (() => void) | null = null;
      try {
        cleanup = await prepareElementForDownload(element);
        
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        const options = {
          ...downloadOptions,
          width: Math.ceil(rect.width + 48), // Add padding to width
          height: Math.ceil(rect.height + 48) // Add padding to height
        };

        const dataUrl = await toPng(element, options);
        const base64Data = dataUrl.split(',')[1];
        
        results.push({
          id: testimonial.id,
          platform: testimonial.platform,
          data: base64Data
        });
      } catch (error) {
        console.error(`Failed to convert testimonial ${testimonial.id}:`, error);
      } finally {
        if (cleanup) cleanup();
      }
    }

    if (results.length === 0) {
      throw new Error('No testimonials could be converted to images');
    }

    // Add all successful conversions to zip
    results.forEach((result) => {
      images.file(
        `${result.platform}-testimonial-${result.id}.png`,
        result.data,
        { base64: true }
      );
    });

    // Generate and download zip
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    const link = document.createElement('a');
    link.download = 'testimonials.zip';
    link.href = URL.createObjectURL(content);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to create zip file:', error);
    throw new Error('Failed to create download package. Please try again.');
  }
}