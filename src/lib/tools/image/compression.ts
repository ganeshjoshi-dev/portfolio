import imageCompression from 'browser-image-compression';
import { CompressionOptions, CompressionResult, ImageFormat } from './types';
import { isFormatSupported, getFallbackFormat } from './conversion';

/**
 * Compress an image file using browser-image-compression library
 * @param file - The image file to compress
 * @param options - Compression options including quality and target format
 * @returns Promise with compressed blob, preview URL, and size
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  try {
    const compressionOptions: {
      maxSizeMB: number;
      useWebWorker: boolean;
      initialQuality: number;
      fileType?: string;
      exifOrientation?: number;
    } = {
      maxSizeMB: options.maxSizeMB || 10,
      useWebWorker: true,
      initialQuality: options.quality,
    };

    // Add target format if specified and check browser support
    if (options.targetFormat) {
      let targetFormat = options.targetFormat;
      
      // Check if format is supported, use fallback if not
      if (!isFormatSupported(targetFormat)) {
        targetFormat = getFallbackFormat(targetFormat);
        console.warn(`Target format ${options.targetFormat} not supported, using ${targetFormat} instead`);
      }
      
      compressionOptions.fileType = `image/${targetFormat}`;
    }

    // Preserve EXIF data if requested (exifOrientation defaults to 1 when not rotated)
    if (options.preserveExif) {
      compressionOptions.exifOrientation = 1;
    }

    const compressedFile = await imageCompression(file, compressionOptions);

    // Generate preview data URL
    const preview = await imageCompression.getDataUrlFromFile(compressedFile);

    return {
      blob: compressedFile,
      preview,
      size: compressedFile.size,
    };
  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get file format from MIME type
 * @param mimeType - The MIME type string
 * @returns The image format
 */
export function getFormatFromMimeType(mimeType: string): ImageFormat {
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpeg';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('avif')) return 'avif';
  return 'jpeg'; // default
}

/**
 * Get MIME type from format
 * @param format - The image format
 * @returns The MIME type string
 */
export function getMimeTypeFromFormat(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
  };
  return mimeTypes[format];
}

/**
 * Calculate compression ratio as percentage
 * @param originalSize - Original file size in bytes
 * @param compressedSize - Compressed file size in bytes
 * @returns Percentage saved (0-100)
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  if (originalSize === 0) return 0;
  const ratio = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.max(0, Math.min(100, ratio)); // Clamp between 0 and 100
}
