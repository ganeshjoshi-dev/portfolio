'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const defaultCsv = `name,age,role
Alice,30,Developer
Bob,25,Designer
Carol,28,PM`;

function parseCsv(
  text: string,
  delimiter: string,
  firstRowIsHeader: boolean
): { data: Record<string, string>[]; error: string | null } {
  const trimmed = text.trim();
  if (!trimmed) return { data: [], error: null };

  const lines = trimmed.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length === 0) return { data: [], error: null };

  const delim = delimiter === 'tab' ? '\t' : delimiter;
  const rows = lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (!inQuotes && c === delim) {
        result.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    result.push(current.trim());
    return result;
  });

  if (firstRowIsHeader && rows.length > 0) {
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h || `column_${i}`] = row[i] ?? '';
      });
      return obj;
    });
    return { data, error: null };
  }

  const maxCols = Math.max(...rows.map((r) => r.length));
  const data = rows.map((row) => {
    const obj: Record<string, string> = {};
    row.forEach((cell, i) => {
      obj[`column_${i}`] = cell;
    });
    for (let i = row.length; i < maxCols; i++) {
      obj[`column_${i}`] = '';
    }
    return obj;
  });
  return { data, error: null };
}

export default function CsvToJsonPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [csvInput, setCsvInput] = useState(defaultCsv);
  const [delimiter, setDelimiter] = useState(',');
  const [firstRowIsHeader, setFirstRowIsHeader] = useState(true);
  const [jsonIndent, setJsonIndent] = useState(2);

  const { data, error } = useMemo(
    () => parseCsv(csvInput, delimiter, firstRowIsHeader),
    [csvInput, delimiter, firstRowIsHeader]
  );

  const jsonOutput = useMemo(() => {
    return jsonIndent > 0 ? JSON.stringify(data, null, jsonIndent) : JSON.stringify(data);
  }, [data, jsonIndent]);

  const TEXTAREA_CLASS =
    'w-full h-[280px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

  return (
    <ToolLayout
      title="CSV to JSON"
      description="Convert CSV to JSON (array of objects). Custom delimiter and headers. For APIs and mock data."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={firstRowIsHeader}
              onChange={(e) => setFirstRowIsHeader(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
            />
            First row is header
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Delimiter</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="tab">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">JSON indent</span>
            <select
              value={jsonIndent}
              onChange={(e) => setJsonIndent(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm"
            >
              <option value={0}>Minified</option>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">CSV input</label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="Paste CSV..."
              spellCheck={false}
            />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">JSON output</label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <CodeOutput code={jsonOutput} language="json" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <p className="text-xs text-slate-500">
          Parsing runs in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
