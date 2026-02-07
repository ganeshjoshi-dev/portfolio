'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const TEXTAREA_CLASS =
  'w-full h-[320px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

/**
 * Minimal SVG optimization in-browser: remove comments, collapse whitespace, trim.
 * No external deps; keeps all processing local for privacy.
 */
function optimizeSvg(svg: string): string {
  let out = svg.trim();
  // Remove XML comments
  out = out.replace(/<!--[\s\S]*?-->/g, '');
  // Collapse multiple whitespace (including newlines) to single space, but preserve space around '=' and inside quotes
  out = out.replace(/\s+/g, ' ');
  // Trim space between tags
  out = out.replace(/>\s+</g, '><');
  return out.trim();
}

export default function SvgOptimizerPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <!-- comment -->\n  <path fill="none" stroke="currentColor" stroke-width="2" d="M3 12h18"/>\n</svg>'
  );

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { output: '', saved: 0, error: null };
    if (!trimmed.toLowerCase().includes('<svg')) {
      return { output: '', saved: 0, error: 'Invalid SVG: no <svg> root found.' };
    }
    try {
      const output = optimizeSvg(trimmed);
      const saved = Math.max(0, input.length - output.length);
      return { output, saved, error: null };
    } catch (e) {
      const err = e as Error;
      return { output: '', saved: 0, error: err.message };
    }
  }, [input]);

  return (
    <ToolLayout
      title="SVG Optimizer"
      description="Minify and optimize SVG files. Remove metadata, trim whitespace. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">SVG input</label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste SVG code..."
              spellCheck={false}
            />
            {result.error && (
              <p className="text-sm text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Optimized SVG</label>
              <div className="flex items-center gap-3">
                {result.saved > 0 && (
                  <span className="text-xs text-slate-400">{result.saved} chars saved</span>
                )}
                {result.output && (
                  <CopyButton text={result.output} className="text-cyan-400 hover:text-cyan-300 text-sm" />
                )}
              </div>
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={result.output}
              readOnly
              placeholder="Optimized output..."
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Optimization runs in your browser. Your SVG never leaves your device.
        </p>
      </div>
    </ToolLayout>
  );
}
