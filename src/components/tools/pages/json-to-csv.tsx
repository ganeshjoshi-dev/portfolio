'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { jsonToCsv } from '@/lib/tools/json';
import { saveAs } from 'file-saver';

const exampleJson = `[
  {"name": "Alice", "age": 30, "role": "Developer"},
  {"name": "Bob", "age": 25, "role": "Designer"}
]`;

const TEXTAREA_CLASS =
  'w-full h-[280px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

export default function JsonToCsvPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(exampleJson);
  const [delimiter, setDelimiter] = useState(',');

  const delim = delimiter === 'tab' ? '\t' : delimiter;

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { success: true as const, csv: '', error: null };
    try {
      const data = JSON.parse(trimmed);
      const csv = jsonToCsv(data, delim);
      return { success: true, csv, error: null };
    } catch (e) {
      const err = e as Error;
      return { success: false as const, csv: '', error: err.message };
    }
  }, [input, delim]);

  const handleDownload = () => {
    if (!result.success || !result.csv) return;
    const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'export.csv');
  };

  return (
    <ToolLayout
      title="JSON to CSV"
      description="Convert JSON to CSV for spreadsheets and data export. Paste JSON, get CSV. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">JSON input</label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON array or object..."
              spellCheck={false}
            />
            {!result.success && result.error && (
              <p className="text-sm text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">CSV output</label>
              <div className="flex items-center gap-2">
                {result.success && result.csv && (
                  <>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      Download CSV
                    </button>
                    <CopyButton text={result.csv} className="text-cyan-400 hover:text-cyan-300 text-sm" />
                  </>
                )}
              </div>
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={result.csv}
              readOnly
              placeholder={result.success ? '' : 'Invalid JSON'}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">CSV delimiter</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-cyan-400"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="tab">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <p className="text-xs text-slate-500">
          Conversion runs in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
