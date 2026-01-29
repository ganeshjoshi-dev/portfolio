'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const tool = getToolById('favicon-generator')!;
const category = toolCategories[tool.category];

const DEFAULT_SIZES = [16, 32, 48, 180];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 2048;
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

function resizeToPngBlob(
  img: HTMLImageElement,
  size: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, size, size);
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to export'))),
      'image/png',
      1
    );
  });
}

export default function FaviconGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<number[]>(DEFAULT_SIZES);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSize = (size: number) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const handleFile = useCallback((f: File | null) => {
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(f);
    if (f) {
      const accepted = ACCEPT_TYPES.split(',').map((t) => t.trim());
      if (!accepted.includes(f.type)) {
        setError('Please select an image file (JPEG, PNG, WebP, or GIF).');
        setFile(null);
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        setFile(null);
        return;
      }
      const url = URL.createObjectURL(f);
      setPreview(url);
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

  const generateAndDownload = useCallback(async () => {
    if (!file || sizes.length === 0) return;
    setIsGenerating(true);
    setError(null);
    try {
      const img = await loadImage(file);
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
        setError(`Image dimensions must not exceed ${MAX_DIMENSION}px.`);
        setIsGenerating(false);
        return;
      }
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'favicon';
      const zip = new JSZip();
      for (const size of sizes) {
        const blob = await resizeToPngBlob(img, size);
        zip.file(`${baseName}-${size}x${size}.png`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${baseName}-favicons.zip`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate favicons.');
    } finally {
      setIsGenerating(false);
    }
  }, [file, sizes]);

  const downloadSingle = useCallback(
    async (size: number) => {
      if (!file) return;
      setIsGenerating(true);
      setError(null);
      try {
        const img = await loadImage(file);
        const blob = await resizeToPngBlob(img, size);
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'favicon';
        saveAs(blob, `${baseName}-${size}x${size}.png`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate.');
      } finally {
        setIsGenerating(false);
      }
    },
    [file]
  );

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
      title="Favicon Generator"
      description="Generate favicons in 16x16, 32x32, 48x48, and 180x180 from one image. Download as PNG or ZIP. All in your browser."
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
          className="min-h-[180px] sm:min-h-[220px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-xl border-2 border-dashed border-slate-700/60 bg-slate-900/40 hover:border-cyan-400/50 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_TYPES}
            onChange={handleSelect}
            className="sr-only"
            aria-label="Choose image file"
          />
          {!file ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-3 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <Upload className="w-12 h-12" />
              <span className="text-sm font-medium">
                Drop an image here or click to select
              </span>
              <span className="text-xs">Max 5MB, JPEG, PNG, WebP, GIF</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <div className="flex-shrink-0">
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element -- blob URL preview
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-contain rounded-lg border border-slate-700/60"
                />
              )}
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <p className="text-sm text-slate-300 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Sizes to generate
          </label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SIZES.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 cursor-pointer hover:border-slate-600"
              >
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="rounded border-slate-600 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-sm text-slate-300">
                  {size}×{size}
                  {size === 180 && ' (Apple touch)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {file && sizes.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={generateAndDownload}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded-lg font-medium hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download all as ZIP
            </button>
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => downloadSingle(size)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/60 text-slate-300 border border-slate-700/60 rounded-lg text-sm font-medium hover:border-cyan-400/50 disabled:opacity-50 transition-colors"
              >
                {size}×{size} PNG
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500">
          All processing is done in your browser. Your image is never uploaded.
        </p>
      </div>
    </ToolLayout>
  );
}
