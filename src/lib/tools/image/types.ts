export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0
  maxSizeMB: number; // Optional max file size
  targetFormat?: ImageFormat; // Convert to this format
  preserveExif?: boolean; // Keep metadata
  autoConvert?: boolean; // Auto-convert to optimal format
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string; // Base64 data URL
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number; // Percentage saved
  format: ImageFormat;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  compressedBlob?: Blob;
  compressedPreview?: string;
  targetFormat?: ImageFormat;
}

export interface ValidationResult {
  valid: File[];
  errors: string[];
}

export interface CompressionResult {
  blob: Blob;
  preview: string;
  size: number;
}

export interface FormatRecommendation {
  format: ImageFormat;
  reason: string;
}
