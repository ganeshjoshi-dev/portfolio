'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const DEFAULT_SCALE = 2; // 2x for sharper images
const PREVIEW_SCALE = 1.5; // scale for extracted-page preview thumbnails

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

type Mode = 'to-image' | 'extract-pages';

export default function PdfToImagePage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [mode, setMode] = useState<Mode>('to-image');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [imageFormat, setImageFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const pdfJsRef = useRef<typeof import('pdfjs-dist') | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageUrlsRef = useRef<string[]>([]);
  imageUrlsRef.current = imageUrls;
  const [extractedPages, setExtractedPages] = useState<
    { pdfUrl: string; previewImageUrl: string; filename: string }[]
  >([]);
  const extractedUrlsRef = useRef<string[]>([]);

  // Dynamically load pdfjs-dist only on client (privacy: no server-side PDF parsing)
  useEffect(() => {
    let cancelled = false;
    import('pdfjs-dist').then((pdfjs) => {
      if (cancelled) return;
      // Worker served from same origin (no CDN); matches the "runs in your browser" promise
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      pdfJsRef.current = pdfjs;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const revokeUrls = useCallback(() => {
    imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    imageUrlsRef.current = [];
    setImageUrls([]);
  }, []);

  const revokeExtractedUrls = useCallback(() => {
    extractedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    extractedUrlsRef.current = [];
    setExtractedPages([]);
  }, []);

  // Revoke blob URLs on unmount only (ref avoids dependency loop)
  useEffect(() => {
    return () => {
      imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      extractedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = '';
      revokeUrls();
      revokeExtractedUrls();
      setError(null);
      setFile(null);
      setImageUrls([]);
      if (!f) return;
      if (f.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }
      if (f.size > MAX_FILE_SIZE) {
        setError(`File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB).`);
        return;
      }
      setFile(f);
    },
    [revokeUrls, revokeExtractedUrls]
  );

  const handlePdfToImage = useCallback(async () => {
    if (!file || !pdfJsRef.current) return;
    setLoading(true);
    setError(null);
    revokeUrls();
    try {
      const pdfjs = pdfJsRef.current;
      const data = await readFileAsArrayBuffer(file);
      const pdf = await pdfjs.getDocument({ data, useWorkerFetch: false }).promise;
      const numPages = pdf.numPages;
      const urls: string[] = [];
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D not available');
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, imageFormat, imageFormat === 'image/jpeg' ? 0.92 : undefined)
        );
        if (blob) urls.push(URL.createObjectURL(blob));
      }
      setImageUrls(urls);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Failed to convert PDF to images.');
    } finally {
      setLoading(false);
    }
  }, [file, scale, imageFormat, revokeUrls]);

  const handleExtractPages = useCallback(async () => {
    if (!file || !pdfJsRef.current) return;
    setLoading(true);
    setError(null);
    revokeExtractedUrls();
    try {
      const pdfjs = pdfJsRef.current;
      const data = await readFileAsArrayBuffer(file);
      const src = await PDFDocument.load(data);
      const numPages = src.getPageCount();
      const base = file.name.replace(/\.pdf$/i, '');
      const pages: { pdfUrl: string; previewImageUrl: string; filename: string }[] = [];
      const urlsToRevoke: string[] = [];
      for (let i = 0; i < numPages; i++) {
        const doc = await PDFDocument.create();
        const [copied] = await doc.copyPages(src, [i]);
        doc.addPage(copied);
        const bytes = await doc.save();
        const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        urlsToRevoke.push(pdfUrl);

        // Render single-page PDF to image for reliable preview
        let previewImageUrl = '';
        try {
          const pdfDoc = await pdfjs.getDocument({ data: bytes, useWorkerFetch: false }).promise;
          const page = await pdfDoc.getPage(1);
          const viewport = page.getViewport({ scale: PREVIEW_SCALE });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await page.render({ canvas, canvasContext: ctx, viewport }).promise;
            const imgBlob = await new Promise<Blob | null>((res) =>
              canvas.toBlob(res, 'image/png', 0.9)
            );
            if (imgBlob) {
              previewImageUrl = URL.createObjectURL(imgBlob);
              urlsToRevoke.push(previewImageUrl);
            }
          }
        } catch {
          // fallback: no preview image
        }

        pages.push({ pdfUrl, previewImageUrl, filename: `${base}_page_${i + 1}.pdf` });
      }
      extractedUrlsRef.current = urlsToRevoke;
      setExtractedPages(pages);
    } catch (e) {
      const err = e as Error;
      setError(err.message || 'Failed to extract pages.');
    } finally {
      setLoading(false);
    }
  }, [file, revokeExtractedUrls]);

  const downloadExtractedPage = (pdfUrl: string, filename: string) => {
    saveAs(pdfUrl, filename);
  };

  const downloadImage = (url: string, index: number) => {
    const ext = imageFormat === 'image/jpeg' ? 'jpg' : 'png';
    const base = file?.name.replace(/\.pdf$/i, '') ?? 'page';
    saveAs(url, `${base}_page_${index + 1}.${ext}`);
  };

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to PNG or JPG, or extract pages as separate PDFs. All processing in your browser—files never leave your device."
      tool={tool}
      category={category}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode('to-image')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'to-image'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
            }`}
          >
            PDF to Image
          </button>
          <button
            type="button"
            onClick={() => setMode('extract-pages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'extract-pages'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600'
            }`}
          >
            Extract pages (PDF)
          </button>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-6 space-y-4">
          <label className="block text-sm font-medium text-slate-300">Select PDF (max 20MB)</label>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-700 file:text-slate-200 file:font-medium hover:file:bg-slate-600"
          />
          {file && (
            <p className="text-sm text-slate-400">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {mode === 'to-image' && file && (
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Scale</span>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
                >
                  <option value={1}>1×</option>
                  <option value={2}>2×</option>
                  <option value={3}>3×</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Format</span>
                <select
                  value={imageFormat}
                  onChange={(e) => setImageFormat(e.target.value as 'image/png' | 'image/jpeg')}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPG</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handlePdfToImage}
                disabled={loading || !pdfJsRef.current}
                className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {loading ? 'Converting…' : 'Convert to images'}
              </button>
            </div>
          )}

          {mode === 'extract-pages' && file && (
            <button
              type="button"
              onClick={handleExtractPages}
              disabled={loading}
              className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/30 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Extracting…' : 'Extract & preview pages'}
            </button>
          )}

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>

        {imageUrls.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Generated images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {imageUrls.map((url, i) => (
                <div key={url} className="rounded-lg border border-slate-700/60 overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob URL from in-browser PDF render */}
                    <img src={url} alt={`Page ${i + 1}`} className="w-full h-auto block" />
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Page {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => downloadImage(url, i)}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'extract-pages' && extractedPages.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">Extracted pages — preview & download</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {extractedPages.map(({ pdfUrl, previewImageUrl, filename }, i) => (
                <div
                  key={pdfUrl}
                  className="rounded-lg border border-slate-700/60 overflow-hidden bg-slate-900 flex flex-col"
                >
                  <div className="relative w-full aspect-[3/4] bg-slate-800/60 min-h-[200px] flex items-center justify-center">
                    {previewImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element -- blob URL from in-browser PDF render */
                      <img
                        src={previewImageUrl}
                        alt={`Page ${i + 1} preview`}
                        className="w-full h-full object-contain block"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Preview unavailable</span>
                    )}
                  </div>
                  <div className="p-2 flex justify-between items-center flex-shrink-0">
                    <span className="text-xs text-slate-400 truncate" title={filename}>
                      Page {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadExtractedPage(pdfUrl, filename)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-500">
          All processing runs in your browser. Your PDF is never uploaded to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
