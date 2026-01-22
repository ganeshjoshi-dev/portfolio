import { ValidationResult, ImageFormat, FormatRecommendation } from './types';

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

/**
 * Validate uploaded image files
 * @param files - Array of files to validate
 * @returns Object with valid files and error messages
 */
export function validateFiles(files: File[]): ValidationResult {
  const errors: string[] = [];
  const valid: File[] = [];

  // Check count
  if (files.length > MAX_IMAGES) {
    errors.push(`Maximum ${MAX_IMAGES} images allowed. Please select fewer files.`);
    return { valid: [], errors };
  }

  if (files.length === 0) {
    errors.push('Please select at least one image.');
    return { valid: [], errors };
  }

  // Check each file
  files.forEach((file) => {
    // Check format
    if (!SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase())) {
      errors.push(`${file.name}: Unsupported format. Only JPEG, PNG, WebP, and AVIF are supported.`);
      return;
    }

    // Check size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      errors.push(`${file.name}: File too large (${sizeMB}MB). Maximum 10MB per image.`);
      return;
    }

    valid.push(file);
  });

  // Check total size (50MB limit)
  const totalSize = valid.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
    errors.push(`Total size too large (${totalMB}MB). Maximum 50MB for batch processing.`);
    return { valid: [], errors };
  }

  return { valid, errors };
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Generate a unique ID for an image
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Recommend the best format for an image based on its characteristics
 * @param file - The image file to analyze
 * @param hasAlpha - Whether the image has transparency
 * @returns Recommended format and reason
 */
export function recommendFormat(
  file: File,
  hasAlpha: boolean = false
): FormatRecommendation {
  const fileType = file.type.toLowerCase();

  // If image has transparency, preserve it
  if (hasAlpha) {
    return {
      format: 'webp',
      reason: 'WebP preserves transparency with better compression than PNG',
    };
  }

  // For photos/large images, use WebP or JPEG
  if (fileType.includes('jpeg') || fileType.includes('jpg')) {
    return {
      format: 'webp',
      reason: 'WebP offers better compression than JPEG for photos',
    };
  }

  // For PNG without transparency, convert to WebP
  if (fileType.includes('png')) {
    return {
      format: 'webp',
      reason: 'WebP provides smaller file sizes than PNG',
    };
  }

  // Already WebP or AVIF
  if (fileType.includes('webp')) {
    return {
      format: 'webp',
      reason: 'Already in optimal format',
    };
  }

  if (fileType.includes('avif')) {
    return {
      format: 'avif',
      reason: 'Already in optimal format',
    };
  }

  // Default to WebP
  return {
    format: 'webp',
    reason: 'WebP offers the best balance of quality and file size',
  };
}

/**
 * Get file extension for a format
 * @param format - The image format
 * @returns File extension (e.g., "jpg")
 */
export function getFileExtension(format: ImageFormat): string {
  const extensions: Record<ImageFormat, string> = {
    jpeg: 'jpg',
    png: 'png',
    webp: 'webp',
    avif: 'avif',
  };
  return extensions[format];
}

/**
 * Create a download filename for a compressed image
 * @param originalName - Original filename
 * @param format - Target format
 * @param wasConverted - Whether the format was converted
 * @returns New filename
 */
export function createDownloadFilename(
  originalName: string,
  format: ImageFormat,
  wasConverted: boolean = false
): string {
  // Remove extension from original name
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = getFileExtension(format);
  const suffix = wasConverted ? '-compressed-converted' : '-compressed';
  return `${nameWithoutExt}${suffix}.${extension}`;
}

/**
 * Download a blob as a file
 * @param blob - The blob to download
 * @param filename - The filename to use
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create a preview data URL from a file
 * @param file - The file to create a preview for
 * @returns Promise with data URL
 */
export function createPreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
