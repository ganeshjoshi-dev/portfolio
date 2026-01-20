import { ImageFormat } from './types';

/**
 * Convert image blob to a different format using Canvas API
 * @param blob - The image blob to convert
 * @param targetFormat - The target image format
 * @param quality - Quality setting (0.1 to 1.0)
 * @returns Promise with the converted blob
 */
export async function convertFormat(
  blob: Blob,
  targetFormat: ImageFormat,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      try {
        // Create canvas with image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to target format
        canvas.toBlob(
          (convertedBlob) => {
            URL.revokeObjectURL(url);
            if (convertedBlob) {
              resolve(convertedBlob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          `image/${targetFormat}`,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Check if a format conversion is supported by the browser
 * @param format - The image format to check
 * @returns Whether the format is supported
 */
export function isFormatSupported(format: ImageFormat): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  // Test if toBlob supports the format
  const mimeType = `image/${format}`;
  
  // WebP and AVIF support varies by browser
  if (format === 'webp') {
    return canvas.toDataURL(mimeType).indexOf('data:image/webp') === 0;
  }
  
  if (format === 'avif') {
    return canvas.toDataURL(mimeType).indexOf('data:image/avif') === 0;
  }

  // JPEG and PNG are universally supported
  return true;
}

/**
 * Get a fallback format if the requested format is not supported
 * @param format - The requested format
 * @returns A supported fallback format
 */
export function getFallbackFormat(format: ImageFormat): ImageFormat {
  if (!isFormatSupported(format)) {
    // Fall back to JPEG for photos, PNG for others
    if (format === 'avif' || format === 'webp') {
      return 'jpeg';
    }
  }
  return format;
}

/**
 * Detect if an image has transparency
 * @param blob - The image blob to check
 * @returns Promise resolving to true if image has transparency
 */
export async function hasTransparency(blob: Blob): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Check for any pixel with alpha < 255
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            URL.revokeObjectURL(url);
            resolve(true);
            return;
          }
        }

        URL.revokeObjectURL(url);
        resolve(false);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
