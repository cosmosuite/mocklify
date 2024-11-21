import { toPng } from 'html-to-image';

const downloadOptions = {
  quality: 0.95,
  width: 398,
  height: 862,
  pixelRatio: 2,
  skipAutoScale: true,
  cacheBust: true,
  style: {
    borderRadius: '2.5rem',
    backgroundColor: 'transparent',
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
    background: element.style.background,
    backgroundImage: element.style.backgroundImage,
    backgroundSize: element.style.backgroundSize,
    backgroundPosition: element.style.backgroundPosition,
    backgroundRepeat: element.style.backgroundRepeat,
    margin: element.style.margin,
    padding: element.style.padding,
    overflow: element.style.overflow
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
  element.style.backgroundRepeat = computedStyle.backgroundRepeat;

  // Force layout recalculation
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Return cleanup function
  return () => {
    Object.assign(element.style, originalStyles);
  };
}

export async function downloadScreenshot(platform: string): Promise<void> {
  const element = document.getElementById('payment-screenshot-preview');
  
  if (!element) {
    throw new Error('Preview element not found');
  }

  let cleanup: (() => void) | null = null;

  try {
    cleanup = await prepareElementForDownload(element);

    const dataUrl = await toPng(element, downloadOptions);
    
    const link = document.createElement('a');
    link.download = `${platform}-payment-notification.png`;
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