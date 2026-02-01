'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { Checkbox } from '@/components/ui';
import { getToolById, toolCategories } from '@/config/tools';

type OutputMode = 'prettify' | 'minify';

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

export default function JsonFormatterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(exampleJson);
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [outputMode, setOutputMode] = useState<OutputMode>('prettify');

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
      output: raw,
      lines: raw.split(/\n/).length,
      characters: raw.length,
    };
  }, [input, indentSize, sortKeys, outputMode]);

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

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">JSON Input</h3>
              <button
                type="button"
                onClick={() => setInput(exampleJson)}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              >
                Reset to example
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              className="w-full h-[320px] lg:h-[400px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span>Lines: {input.trim() ? input.trim().split(/\n/).length : 0}</span>
              <span>Characters: {input.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-slate-300">Output</h3>
              {result.valid && result.output && <CopyButton text={result.output} />}
            </div>
            {outputMode === 'prettify' && (
              <div className="flex flex-wrap items-center gap-4 p-3 bg-slate-900/40 border border-slate-700/60 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-slate-400">Indent:</span>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="px-2 py-1 bg-slate-800/60 border border-slate-700/60 rounded text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                  </select>
                </label>
                <Checkbox
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  label="Sort keys"
                  labelClassName="text-slate-400"
                />
              </div>
            )}
            {result.valid ? (
              <>
                <CodeOutput
                  code={result.output}
                  language="json"
                  title="Formatted JSON"
                  showLineNumbers={outputMode === 'prettify' && result.lines <= 100}
                />
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>Lines: {result.lines}</span>
                  <span>Characters: {result.characters}</span>
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
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
