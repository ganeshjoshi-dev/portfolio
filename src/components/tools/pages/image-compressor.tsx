'use client';

import { useState, useCallback } from 'react';
import { Download, Trash2, Zap } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import ImageUploadZone from '@/components/tools/image-compressor/ImageUploadZone';
import ImagePreviewCard from '@/components/tools/image-compressor/ImagePreviewCard';
import CompressionSettings from '@/components/tools/image-compressor/CompressionSettings';
import BatchProgressBar from '@/components/tools/image-compressor/BatchProgressBar';
import {
  ImageFile,
  CompressionOptions,
  validateFiles,
  generateId,
  createPreview,
  compressImage,
  calculateCompressionRatio,
  getFormatFromMimeType,
  downloadBlob,
  createDownloadFilename,
  formatFileSize,
} from '@/lib/tools/image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ImageCompressorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [images, setImages] = useState<ImageFile[]>([]);
  const [options, setOptions] = useState<CompressionOptions>({
    quality: 0.8,
    maxSizeMB: 10,
    autoConvert: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Update target format for pending images when settings change
  const handleOptionsChange = useCallback((newOptions: CompressionOptions) => {
    setOptions(newOptions);
    
    // Update targetFormat for all pending images
    setImages((prev) =>
      prev.map((img) => {
        if (img.status === 'pending') {
          return {
            ...img,
            targetFormat: newOptions.autoConvert && newOptions.targetFormat 
              ? newOptions.targetFormat 
              : undefined,
          };
        }
        return img;
      })
    );
  }, []);

  const handleFilesAdded = useCallback(async (files: File[]) => {
    setErrors([]);
    
    // Validate files
    const validation = validateFiles(files);
    
    if (validation.errors.length > 0) {
      setErrors(validation.errors);
      return;
    }

    // Create ImageFile objects with previews
    const newImages: ImageFile[] = await Promise.all(
      validation.valid.map(async (file) => {
        const preview = await createPreview(file);
        const format = getFormatFromMimeType(file.type);
        
        return {
          id: generateId(),
          file,
          preview,
          originalSize: file.size,
          format,
          status: 'pending' as const,
          // Only set targetFormat if autoConvert is enabled AND a format is selected
          targetFormat: options.autoConvert && options.targetFormat ? options.targetFormat : undefined,
        };
      })
    );

    setImages((prev) => [...prev, ...newImages]);
  }, [options.autoConvert, options.targetFormat]);

  const handleCompress = useCallback(async () => {
    if (isCompressing) return;
    
    setIsCompressing(true);
    const imagesToCompress = images.filter((img) => img.status === 'pending');

    // Process images sequentially to avoid overwhelming the browser
    for (const image of imagesToCompress) {
      try {
        // Update status to processing
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: 'processing' as const } : img
          )
        );

        // Compress the image - use the image's targetFormat, not global options
        const compressionOptions: CompressionOptions = {
          ...options,
          targetFormat: image.targetFormat, // Use the specific image's target format
        };

        const result = await compressImage(image.file, compressionOptions);

        // Calculate compression ratio
        const ratio = calculateCompressionRatio(image.originalSize, result.size);

        // Get actual output format from the blob
        const actualFormat = getFormatFromMimeType(result.blob.type);

        // Update with compressed result
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'completed' as const,
                  compressedBlob: result.blob,
                  compressedPreview: result.preview,
                  compressedSize: result.size,
                  compressionRatio: ratio,
                  actualFormat: actualFormat,
                }
              : img
          )
        );
      } catch (error) {
        // Update with error
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? {
                  ...img,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Compression failed',
                }
              : img
          )
        );
      }
    }

    setIsCompressing(false);
  }, [images, options, isCompressing]);

  const handleDownloadSingle = useCallback((image: ImageFile) => {
    if (!image.compressedBlob) return;

    // Use actual format if available, otherwise fall back to target or original
    const finalFormat = image.actualFormat || image.targetFormat || image.format;
    const wasConverted = image.actualFormat !== undefined && image.actualFormat !== image.format;
    const filename = createDownloadFilename(
      image.file.name,
      finalFormat,
      wasConverted
    );
    downloadBlob(image.compressedBlob, filename);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.compressedBlob);
    
    if (completedImages.length === 0) return;

    if (completedImages.length === 1) {
      // Download single file directly
      handleDownloadSingle(completedImages[0]);
      return;
    }

    // Create ZIP file
    const zip = new JSZip();
    
    completedImages.forEach((image) => {
      if (image.compressedBlob) {
        // Use actual format if available, otherwise fall back to target or original
        const finalFormat = image.actualFormat || image.targetFormat || image.format;
        const wasConverted = image.actualFormat !== undefined && image.actualFormat !== image.format;
        const filename = createDownloadFilename(
          image.file.name,
          finalFormat,
          wasConverted
        );
        zip.file(filename, image.compressedBlob);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'compressed-images.zip');
  }, [images, handleDownloadSingle]);

  const handleRemove = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setImages([]);
    setErrors([]);
  }, []);

  // Calculate total stats
  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce(
    (sum, img) => sum + (img.compressedSize || 0),
    0
  );
  const totalSaved = totalOriginalSize > 0 
    ? calculateCompressionRatio(totalOriginalSize, totalCompressedSize)
    : 0;
  const completedCount = images.filter((img) => img.status === 'completed').length;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress JPEG, PNG, WebP, and AVIF images with smart optimization. Reduce file sizes by up to 80%."
      tool={tool}
      category={category}
    >
      <div className="space-y-8">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ))}
          </div>
        )}

        {/* Format Conversion Info */}
        {images.length > 0 && options.autoConvert && options.targetFormat && (
          <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-cyan-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-300 mb-1">
                  Format Conversion Enabled
                </p>
                <p className="text-xs text-cyan-400/80">
                  All images will be converted to <span className="font-semibold uppercase">{options.targetFormat}</span> format during compression.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Zone */}
        {images.length === 0 && (
          <ImageUploadZone onFilesAdded={handleFilesAdded} disabled={isCompressing} />
        )}

        {/* Main Content */}
        {images.length > 0 && (
          <>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Settings Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <CompressionSettings options={options} onChange={handleOptionsChange} />
                  
                  {/* Add More Images */}
                  <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
                    <p className="text-sm text-slate-400 mb-3">Add more images</p>
                    <ImageUploadZone 
                      onFilesAdded={handleFilesAdded} 
                      disabled={isCompressing}
                    />
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress */}
                <BatchProgressBar images={images} />

                {/* Images */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {images.map((image) => (
                    <ImagePreviewCard
                      key={image.id}
                      image={image}
                      onDownload={handleDownloadSingle}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Batch Actions Bar */}
            <div className="sticky bottom-0 left-0 right-0 pt-8 pb-4">
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm justify-center sm:justify-start">
                    <span className="text-slate-400 whitespace-nowrap">
                      {images.length} image{images.length !== 1 ? 's' : ''}
                    </span>
                    {completedCount > 0 && (
                      <>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-slate-400 whitespace-nowrap">
                          {formatFileSize(totalOriginalSize)} → {formatFileSize(totalCompressedSize)}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">•</span>
                        <span className="text-emerald-400 font-medium whitespace-nowrap">
                          {totalSaved.toFixed(0)}% saved
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleCompress}
                      disabled={isCompressing || images.every((img) => img.status !== 'pending')}
                      className={`
                        flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-300 whitespace-nowrap
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]
                        ${
                          isCompressing || images.every((img) => img.status !== 'pending')
                            ? 'bg-slate-800/40 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                            : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-400/30'
                        }
                      `}
                    >
                      <Zap className="w-4 h-4" />
                      {isCompressing ? 'Compressing...' : 'Compress All'}
                    </button>

                    <button
                      onClick={handleDownloadAll}
                      disabled={completedCount === 0}
                      className={`
                        flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-300 whitespace-nowrap
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]
                        ${
                          completedCount === 0
                            ? 'bg-slate-800/40 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                            : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/50 hover:text-cyan-300'
                        }
                      `}
                    >
                      <Download className="w-4 h-4" />
                      Download {completedCount > 1 ? 'All' : ''}
                    </button>

                    <button
                      onClick={handleClearAll}
                      className="
                        px-4 py-2.5 rounded-lg text-sm font-medium
                        bg-slate-800/60 text-slate-400 border border-slate-700/60
                        hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10
                        transition-all duration-300
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0e27]
                      "
                      aria-label="Clear all images"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
