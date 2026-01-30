'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download, GripVertical, Trash2 } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

const MAX_FILES = 20;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

interface PdfEntry {
  id: string;
  file: File;
  name: string;
  size: number;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function PdfMergerPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [entries, setEntries] = useState<PdfEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndAdd = useCallback((files: File[]) => {
    setError(null);
    const toAdd: PdfEntry[] = [];
    let addSize = 0;
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        setError(`${file.name}: Not a PDF file.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name}: File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB per file).`);
        return;
      }
      if (entries.length + toAdd.length >= MAX_FILES) {
        setError(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }
      addSize += file.size;
      toAdd.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
      });
    }
    if (toAdd.length > 0) {
      setEntries((prev) => {
        const currentTotal = prev.reduce((s, e) => s + e.size, 0);
        if (currentTotal + addSize > MAX_TOTAL_SIZE) {
          setError('Total size would exceed 50MB.');
          return prev;
        }
        return [...prev, ...toAdd];
      });
    }
  }, [entries.length]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setError(null);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf'
      );
      if (files.length > 0) validateAndAdd(files);
    },
    [validateAndAdd]
  );

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) validateAndAdd(files);
      e.target.value = '';
    },
    [validateAndAdd]
  );

  const remove = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setError(null);
  };

  const move = (id: string, direction: 'up' | 'down') => {
    setEntries((prev) => {
      const i = prev.findIndex((e) => e.id === id);
      if (i < 0) return prev;
      const j = direction === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragEnd = () => setDraggedId(null);
  const handleDragDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setEntries((prev) => {
      const from = prev.findIndex((e) => e.id === draggedId);
      const to = prev.findIndex((e) => e.id === targetId);
      if (from < 0 || to < 0) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDraggedId(null);
  };

  const handleMerge = useCallback(async () => {
    if (entries.length === 0) return;
    setIsMerging(true);
    setError(null);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const entry of entries) {
        const arrayBuffer = await readFileAsArrayBuffer(entry.file);
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const pageIndices = srcPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const name = entries.length === 1
        ? entries[0].name.replace(/\.pdf$/i, '-merged.pdf')
        : 'merged.pdf';
      saveAs(blob, name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to merge PDFs. The file may be corrupted or password-protected.'
      );
    } finally {
      setIsMerging(false);
    }
  }, [entries]);

  return (
    <ToolLayout
      title="PDF Merger"
      description="Merge multiple PDFs into one file. Drag to reorder. All processing in your browser."
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
          className="min-h-[160px] sm:min-h-[180px] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-xl border-2 border-dashed border-slate-700/60 bg-slate-900/40 hover:border-cyan-400/50 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleSelect}
            className="sr-only"
            aria-label="Choose PDF files"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-3 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <Upload className="w-12 h-12" />
            <span className="text-sm font-medium">
              Drop PDFs here or click to select
            </span>
            <span className="text-xs">
              Max {MAX_FILES} files, 20MB each, 50MB total
            </span>
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        {entries.length > 0 && (
          <>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-300">
                PDFs to merge (drag to reorder)
              </h3>
              <ul className="space-y-2">
                {entries.map((entry, index) => (
                  <li
                    key={entry.id}
                    draggable
                    onDragStart={() => handleDragStart(entry.id)}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={() => handleDragDrop(entry.id)}
                    className={`flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border bg-slate-900/60 transition-colors ${
                      draggedId === entry.id
                        ? 'border-cyan-400/50 opacity-80'
                        : 'border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-slate-500 flex-shrink-0" aria-hidden />
                      <span className="text-xs text-slate-500 w-5 sm:w-6 flex-shrink-0 tabular-nums">
                        {index + 1}
                      </span>
                      <span className="min-w-0 truncate text-slate-200 text-sm">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-slate-500 tabular-nums">
                        {(entry.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => move(entry.id, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-slate-500 hover:text-cyan-400 disabled:opacity-30 rounded focus:ring-2 focus:ring-cyan-400"
                        aria-label="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(entry.id, 'down')}
                        disabled={index === entries.length - 1}
                        className="p-1.5 text-slate-500 hover:text-cyan-400 disabled:opacity-30 rounded focus:ring-2 focus:ring-cyan-400"
                        aria-label="Move down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(entry.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded focus:ring-2 focus:ring-cyan-400"
                        aria-label={`Remove ${entry.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleMerge}
              disabled={isMerging}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded-lg font-medium hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              {isMerging ? 'Merging…' : 'Merge & download'}
            </button>
          </>
        )}

        <p className="text-xs text-slate-500">
          All merging is done in your browser. Your PDFs are never uploaded.
        </p>
      </div>
    </ToolLayout>
  );
}
