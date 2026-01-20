// Types
export type {
  ImageFormat,
  CompressionOptions,
  ImageFile,
  ValidationResult,
  CompressionResult,
  FormatRecommendation,
} from './types';

// Compression
export {
  compressImage,
  getFormatFromMimeType,
  getMimeTypeFromFormat,
  calculateCompressionRatio,
} from './compression';

// Conversion
export {
  convertFormat,
  isFormatSupported,
  getFallbackFormat,
  hasTransparency,
} from './conversion';

// Utils
export {
  validateFiles,
  formatFileSize,
  generateId,
  recommendFormat,
  getFileExtension,
  createDownloadFilename,
  downloadBlob,
  createPreview,
} from './utils';
