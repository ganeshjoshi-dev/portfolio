'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { Checkbox } from '@/components/ui';
import { getToolById, toolCategories } from '@/config/tools';
import { jsonToXml, jsonToCsv, jsonToYaml } from '@/lib/tools/json';
import { saveAs } from 'file-saver';
import { Upload, Download, Maximize2, Minimize2 } from 'lucide-react';

type ExpandedPanel = 'none' | 'input' | 'output';

type OutputMode = 'prettify' | 'minify';
type OutputFormat = 'json' | 'xml' | 'csv' | 'yaml';

function sortObjectKeys(obj: unknown): unknown {
  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
          return acc;
        },
        {} as Record<string, unknown>
      );
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  return obj;
}

interface ParseError {
  message: string;
  line?: number;
  column?: number;
}

function tryParseJson(input: string): { success: true; data: unknown } | { success: false; error: ParseError } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { success: false, error: { message: 'Input is empty' } };
  }
  try {
    const data = JSON.parse(trimmed);
    return { success: true, data };
  } catch (e) {
    const err = e as Error;
    let line: number | undefined;
    let column: number | undefined;
    const match = err.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const before = trimmed.slice(0, pos);
      const lineMatch = before.match(/\n/g);
      line = lineMatch ? lineMatch.length + 1 : 1;
      const lastNewline = before.lastIndexOf('\n');
      column = lastNewline === -1 ? pos + 1 : pos - lastNewline;
    }
    return {
      success: false,
      error: {
        message: err.message,
        line,
        column,
      },
    };
  }
}

const exampleJson = `{"name":"John Doe","age":30,"active":true,"address":{"street":"123 Main St","city":"New York","zip":"10001"},"tags":["developer","designer"]}`;

const TEXTAREA_CLASS =
  'w-full h-[320px] lg:h-[400px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed overflow-auto';

export default function JsonFormatterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(exampleJson);
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('prettify');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [outputText, setOutputText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      setUploadedFileName(file.name);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const result = useMemo(() => {
    const parsed = tryParseJson(input);
    if (!parsed.success) {
      return {
        valid: false as const,
        error: parsed.error,
        output: '',
        lines: 0,
        characters: 0,
      };
    }
    let data = parsed.data;
    if (sortKeys) {
      data = sortObjectKeys(data);
    }
    const raw = outputMode === 'minify' ? JSON.stringify(data) : JSON.stringify(data, null, indentSize);
    return {
      valid: true as const,
      data,
      output: raw,
      lines: raw.split(/\n/).length,
      characters: raw.length,
    };
  }, [input, indentSize, sortKeys, outputMode]);

  const computedOutput = useMemo(() => {
    if (!result.valid || !('data' in result)) return '';
    const data = (result as { data: unknown }).data;
    switch (outputFormat) {
      case 'xml':
        return jsonToXml(data, 'root');
      case 'csv':
        return jsonToCsv(data);
      case 'yaml':
        return jsonToYaml(data);
      default:
        return result.output;
    }
  }, [result, outputFormat]);

  useEffect(() => {
    setOutputText(computedOutput);
  }, [computedOutput]);

  const outputLines = outputText.trim() ? outputText.trim().split(/\n/).length : 0;
  const outputCharacters = outputText.length;

  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const mimeTypes: Record<OutputFormat, string> = {
      json: 'application/json',
      xml: 'text/xml',
      csv: 'text/csv',
      yaml: 'application/x-yaml',
    };
    const base = uploadedFileName ? uploadedFileName.replace(/\.[^.]+$/, '') || 'output' : 'formatted';
    const ext = { json: 'json', xml: 'xml', csv: 'csv', yaml: 'yaml' }[outputFormat];
    const blob = new Blob([outputText], { type: mimeTypes[outputFormat] });
    saveAs(blob, `${base}.${ext}`);
  }, [outputText, outputFormat, uploadedFileName]);

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format and validate JSON with syntax highlighting. Minify, prettify, and sort keys. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <TabSwitcher
          options={[
            { id: 'prettify', label: 'Prettify' },
            { id: 'minify', label: 'Minify' },
          ]}
          activeTab={outputMode}
          onChange={(id) => setOutputMode(id as OutputMode)}
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">Convert to:</span>
          <TabSwitcher
            options={[
              { id: 'json', label: 'JSON' },
              { id: 'xml', label: 'XML' },
              { id: 'csv', label: 'CSV' },
              { id: 'yaml', label: 'YAML' },
            ]}
            activeTab={outputFormat}
            onChange={(id) => setOutputFormat(id as OutputFormat)}
          />
        </div>

        <div
          className={`grid gap-6 ${expandedPanel === 'none' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
        >
          <div
            className={`space-y-3 ${expandedPanel === 'output' ? 'hidden' : ''}`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-slate-300">JSON Input</h3>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.txt,application/json,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload JSON file"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-2 py-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setInput(exampleJson)}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                >
                  Reset to example
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPanel(expandedPanel === 'input' ? 'none' : 'input')
                  }
                  className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                  title={expandedPanel === 'input' ? 'Exit full width' : 'Full width'}
                  aria-label={expandedPanel === 'input' ? 'Exit full width' : 'Expand to full width'}
                >
                  {expandedPanel === 'input' ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className={TEXTAREA_CLASS}
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span>Lines: {input.trim() ? input.trim().split(/\n/).length : 0}</span>
              <span>Characters: {input.length}</span>
            </div>
          </div>

          <div
            className={`space-y-3 ${expandedPanel === 'input' ? 'hidden' : ''}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-slate-300">Output</h3>
                {result.valid && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Valid JSON
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {result.valid && outputText && (
                  <>
                    <CopyButton text={outputText} />
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded border border-slate-600/60 hover:border-cyan-400/50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPanel(expandedPanel === 'output' ? 'none' : 'output')
                  }
                  className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
                  title={expandedPanel === 'output' ? 'Exit full width' : 'Full width'}
                  aria-label={expandedPanel === 'output' ? 'Exit full width' : 'Expand to full width'}
                >
                  {expandedPanel === 'output' ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {outputMode === 'prettify' && outputFormat === 'json' && (
              <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-900/40 border border-slate-700/60 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-slate-400">Indent:</span>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="px-2 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={3}>3 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </label>
                <Checkbox
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  label="Sort keys"
                  labelClassName="text-slate-400"
                  className="!items-center"
                />
              </div>
            )}
            {result.valid ? (
              <>
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 overflow-hidden">
                  <textarea
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                    className="w-full h-[320px] lg:h-[400px] p-4 bg-slate-900/60 text-slate-300 font-mono text-sm leading-relaxed border-0 focus:outline-none focus:ring-0 resize-none block rounded-b-xl"
                    spellCheck={false}
                    aria-label="Formatted output"
                  />
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Lines: {outputLines}</span>
                  <span>Characters: {outputCharacters}</span>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm font-medium text-red-400 mb-1">Invalid JSON</p>
                <p className="text-sm text-slate-300 font-mono">{result.error.message}</p>
                {(result.error.line != null || result.error.column != null) && (
                  <p className="text-xs text-slate-400 mt-2">
                    {result.error.line != null && `Line ${result.error.line}`}
                    {result.error.line != null && result.error.column != null && ', '}
                    {result.error.column != null && `Column ${result.error.column}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Tips</h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• All processing runs in your browser; your JSON never leaves your device.</li>
            <li>• Use Prettify to format minified JSON with optional key sorting.</li>
            <li>• Use Minify to remove whitespace and reduce size.</li>
            <li>• Convert to XML, CSV, or YAML; CSV works best with an array of objects.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
