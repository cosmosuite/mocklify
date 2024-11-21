import { toPng, toJpeg, toSvg } from 'html-to-image';

const downloadOptions = {
  quality: 0.95,
  width: 800,
  height: 600,
  pixelRatio: 2,
  skipAutoScale: true,
  cacheBust: true,
  style: {
    borderRadius: '0.75rem',
    overflow: 'hidden'
  }
};

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.getElementsByTagName('img'));
  const canvases = Array.from(element.getElementsByTagName('canvas'));
  
  const loadPromises = [
    ...images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve, reject) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', () => reject(new Error(`Failed to load image: ${img.src}`)));
      });
    }),
    ...canvases.map(canvas => Promise.resolve()) // Canvas elements are already rendered
  ];

  try {
    await Promise.all(loadPromises);
  } catch (error) {
    console.warn('Some images failed to load:', error);
  }
}

async function prepareElementForDownload(element: HTMLElement): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  await waitForImages(element);
  await new Promise(resolve => requestAnimationFrame(resolve));
}

export async function downloadDashboard(
  dashboardData: any,
  format: 'png' | 'jpg' | 'svg' = 'png'
): Promise<void> {
  const element = document.getElementById('mrr-dashboard-preview');
  
  if (!element) {
    throw new Error('Dashboard preview element not found');
  }

  try {
    await prepareElementForDownload(element);

    let dataUrl: string;
    switch (format) {
      case 'jpg':
        dataUrl = await toJpeg(element, downloadOptions);
        break;
      case 'svg':
        dataUrl = await toSvg(element, downloadOptions);
        break;
      default:
        dataUrl = await toPng(element, downloadOptions);
    }
    
    const link = document.createElement('a');
    link.download = `mrr-dashboard.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download dashboard:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
}