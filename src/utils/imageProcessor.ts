import imageCompression from 'browser-image-compression';

const TARGET_DIMENSIONS = {
  width: 1290,
  height: 2796
};

const TOLERANCE = 0.05; // 5% tolerance

interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  error?: string;
}

export async function processBackgroundImage(file: File): Promise<ProcessedImage> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Compress image before processing
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: Math.max(TARGET_DIMENSIONS.width, TARGET_DIMENSIONS.height),
      useWebWorker: true
    });

    // Create image object to get dimensions
    const img = new Image();
    const imageUrl = URL.createObjectURL(compressedFile);

    return new Promise((resolve) => {
      img.onload = () => {
        // Calculate aspect ratio tolerance
        const targetRatio = TARGET_DIMENSIONS.width / TARGET_DIMENSIONS.height;
        const imageRatio = img.width / img.height;
        const ratioDifference = Math.abs(targetRatio - imageRatio);
        const maxRatioDifference = targetRatio * TOLERANCE;

        if (ratioDifference > maxRatioDifference) {
          URL.revokeObjectURL(imageUrl);
          resolve({
            url: '',
            width: img.width,
            height: img.height,
            error: `Image dimensions should be close to ${TARGET_DIMENSIONS.width}×${TARGET_DIMENSIONS.height} (5% tolerance). Please resize the image or choose another one.`
          });
          return;
        }

        resolve({
          url: imageUrl,
          width: img.width,
          height: img.height
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        resolve({
          url: '',
          width: 0,
          height: 0,
          error: 'Failed to load image. Please try another one.'
        });
      };

      img.src = imageUrl;
    });
  } catch (error) {
    return {
      url: '',
      width: 0,
      height: 0,
      error: error instanceof Error ? error.message : 'Failed to process image'
    };
  }
}