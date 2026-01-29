'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { saveAs } from 'file-saver';

const tool = getToolById('image-resizer')!;
const category = toolCategories[tool.category];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 4096;
const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function resizeImage(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  crop: boolean,
  mimeType: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }

    const sw = img.naturalWidth;
    const sh = img.naturalHeight;
    let sx = 0;
    let sy = 0;
    let sWidth = sw;
    let sHeight = sh;

    if (crop && (sw / sh !== targetWidth / targetHeight)) {
      const targetRatio = targetWidth / targetHeight;
      const sourceRatio = sw / sh;
      if (sourceRatio > targetRatio) {
        sWidth = Math.round(sh * targetRatio);
        sx = Math.round((sw - sWidth) / 2);
      } else {
        sHeight = Math.round(sw / targetRatio);
        sy = Math.round((sh - sHeight) / 2);
      }
    } else if (!crop) {
      const scale = Math.min(targetWidth / sw, targetHeight / sh);
      canvas.width = Math.round(sw * scale);
      canvas.height = Math.round(sh * scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
        mimeType,
        0.92
      );
      return;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
      mimeType,
      0.92
    );
  });
}

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [scalePercent, setScalePercent] = useState(100);
  const [crop, setCrop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const origSizeRef = useRef<{ w: number; h: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatio = origSizeRef.current
    ? origSizeRef.current.w / origSizeRef.current.h
    : 1;

  const handleFile = useCallback((f: File | null) => {
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(f);
    origSizeRef.current = null;
    if (f) {
      const accepted = ACCEPT_TYPES.split(',').map((t) => t.trim());
      if (!accepted.includes(f.type)) {
        setError('Please select an image file (JPEG, PNG, WebP, or GIF).');
        setFile(null);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError(`File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        setFile(null);
        return;
      }
      const url = URL.createObjectURL(f);
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > MAX_DIMENSION || img.naturalHeight > MAX_DIMENSION) {
          setError(`Image dimensions must not exceed ${MAX_DIMENSION}px.`);
          setFile(null);
          URL.revokeObjectURL(url);
          setPreview(null);
          return;
        }
        origSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight };
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setScalePercent(100);
      };
      img.onerror = () => {
        setError('Failed to load image.');
        setFile(null);
        URL.revokeObjectURL(url);
        setPreview(null);
      };
      img.src = url;
    }
  }, [preview]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith('image/')) handleFile(f);
    },
    [handleFile]
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = '';
    },
    [handleFile]
  );

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (lockAspect && origSizeRef.current) {
      const newHeight = Math.round(w / aspectRatio);
      setHeight(newHeight);
      setScalePercent(Math.round((w / origSizeRef.current.w) * 100));
    }
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (lockAspect && origSizeRef.current) {
      const newWidth = Math.round(h * aspectRatio);
      setWidth(newWidth);
      setScalePercent(Math.round((h / origSizeRef.current.h) * 100));
    }
  };

  const handleScaleChange = (p: number) => {
    setScalePercent(p);
    if (origSizeRef.current) {
      const w = Math.round((origSizeRef.current.w * p) / 100);
      const h = Math.round((origSizeRef.current.h * p) / 100);
      setWidth(w);
      setHeight(h);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!file || width < 1 || height < 1) return;
    setIsProcessing(true);
    setError(null);
    try {
      const img = await loadImage(file);
      const mime = file.type.startsWith('image/') ? file.type : 'image/png';
      const blob = await resizeImage(img, width, height, crop, mime);
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
      const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
      saveAs(blob, `${baseName}-${width}x${height}.${ext}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resize.');
    } finally {
      setIsProcessing(false);
    }
  }, [file, width, height, crop]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images by pixels or scale. Lock aspect ratio, optional center crop. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-2xl mx-auto w-full space-y-6 px-1 sm:px-0">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDrop}
          className="min-h-[160px] sm:min-h-[200px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-xl border-2 border-dashed border-slate-700/60 bg-slate-900/40 hover:border-cyan-400/50 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_TYPES}
            onChange={handleSelect}
            className="sr-only"
            aria-label="Choose image"
          />
          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-3 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <Upload className="w-12 h-12" />
              <span className="text-sm font-medium">
                Drop an image or click to select
              </span>
              <span className="text-xs">Max 10MB, JPEG, PNG, WebP, GIF</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL preview
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-contain rounded-lg border border-slate-700/60 bg-slate-900/80"
                />
              )}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm text-slate-300 truncate">{file.name}</p>
                {origSizeRef.current && (
                  <p className="text-xs text-slate-500">
                    Original: {origSizeRef.current.w}×{origSizeRef.current.h}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Choose another
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {file && origSizeRef.current && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={MAX_DIMENSION}
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 font-mono focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min={1}
                  max={MAX_DIMENSION}
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 font-mono focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-sm text-slate-300">Lock aspect ratio</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crop}
                  onChange={(e) => setCrop(e.target.checked)}
                  className="rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-sm text-slate-300">Center crop to exact size</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Scale (%)
              </label>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={scalePercent}
                  onChange={(e) => handleScaleChange(parseInt(e.target.value, 10))}
                  className="flex-1 min-w-0 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="text-sm font-mono text-slate-300 w-10 sm:w-12 shrink-0 tabular-nums">
                  {scalePercent}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded-lg font-medium hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download {width}×{height}
            </button>
          </>
        )}

        <p className="text-xs text-slate-500">
          All resizing is done in your browser. Your image is never uploaded.
        </p>
      </div>
    </ToolLayout>
  );
}
