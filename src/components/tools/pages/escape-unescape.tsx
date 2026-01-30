'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type FormatId = 'json' | 'html' | 'url';

function escapeJson(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

function unescapeJson(s: string): string {
  return s.replace(/\\(.)/g, (_, c) => {
    if (c === 'n') return '\n';
    if (c === 'r') return '\r';
    if (c === 't') return '\t';
    if (c === '"' || c === '\\') return c;
    return '\\' + c;
  });
}

const htmlMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => htmlMap[c] ?? c);
}

const htmlUnescapeMap: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
};

function unescapeHtml(s: string): string {
  return s
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x27;/g, (m) => htmlUnescapeMap[m] ?? m);
}

function escapeUrl(s: string): string {
  try {
    return encodeURIComponent(s);
  } catch {
    return s;
  }
}

function unescapeUrl(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default function EscapeUnescapePage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [format, setFormat] = useState<FormatId>('html');
  const [plain, setPlain] = useState('');
  const [escaped, setEscaped] = useState('');

  const escapedFromPlain = useMemo(() => {
    if (format === 'json') return escapeJson(plain);
    if (format === 'html') return escapeHtml(plain);
    return escapeUrl(plain);
  }, [format, plain]);

  const plainFromEscaped = useMemo(() => {
    if (format === 'json') return unescapeJson(escaped);
    if (format === 'html') return unescapeHtml(escaped);
    return unescapeUrl(escaped);
  }, [format, escaped]);

  return (
    <ToolLayout
      title="Escape / Unescape"
      description="Escape and unescape text for JSON, HTML, and URL. Handle special characters correctly."
      tool={tool}
      category={category}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <TabSwitcher
          options={[
            { id: 'json', label: 'JSON' },
            { id: 'html', label: 'HTML' },
            { id: 'url', label: 'URL' },
          ]}
          activeTab={format}
          onChange={(id) => setFormat(id as FormatId)}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                {format === 'json' && 'Plain text → escaped'}
                {format === 'html' && 'Plain text → HTML entities'}
                {format === 'url' && 'Plain text → encoded'}
              </label>
              <CopyButton text={escapedFromPlain} />
            </div>
            <textarea
              value={plain}
              onChange={(e) => setPlain(e.target.value)}
              placeholder={
                format === 'json'
                  ? 'Text to escape for JSON string'
                  : format === 'html'
                    ? 'Text to escape for HTML'
                    : 'Text to encode for URL'
              }
              className="w-full h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
              spellCheck={false}
            />
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg font-mono text-sm text-slate-300 break-all whitespace-pre-wrap min-h-[2.5rem]">
              {escapedFromPlain || '—'}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300">
                {format === 'json' && 'Escaped → plain'}
                {format === 'html' && 'HTML entities → plain'}
                {format === 'url' && 'Encoded → decoded'}
              </label>
              <CopyButton text={plainFromEscaped} />
            </div>
            <textarea
              value={escaped}
              onChange={(e) => setEscaped(e.target.value)}
              placeholder={
                format === 'json'
                  ? 'Escaped JSON string'
                  : format === 'html'
                    ? 'HTML entities to unescape'
                    : 'URL-encoded string'
              }
              className="w-full h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
              spellCheck={false}
            />
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg font-mono text-sm text-slate-300 break-all whitespace-pre-wrap min-h-[2.5rem]">
              {plainFromEscaped || '—'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2">What gets escaped</h3>
          <ul className="text-xs text-slate-400 space-y-1">
            {format === 'json' && (
              <>
                <li>• Backslash (\), double quote (&quot;), newline (\\n), carriage return (\\r), tab (\\t)</li>
              </>
            )}
            {format === 'html' && (
              <>
                <li>• &amp; → &amp;amp;, &lt; → &amp;lt;, &gt; → &amp;gt;, &quot; → &amp;quot;, &#39; → &amp;#39;</li>
              </>
            )}
            {format === 'url' && (
              <>
                <li>• Uses encodeURIComponent / decodeURIComponent for query and path segments.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
