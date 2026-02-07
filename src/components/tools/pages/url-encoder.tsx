'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type TabId = 'encode' | 'decode' | 'parse';

function encodeUrlComponent(value: string): string {
  try {
    return encodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeUrlComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

interface ParsedUrl {
  valid: boolean;
  href?: string;
  protocol?: string;
  host?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  searchParams?: Array<{ key: string; value: string }>;
  error?: string;
}

function parseUrl(input: string): ParsedUrl {
  const trimmed = input.trim();
  if (!trimmed) return { valid: false, error: 'Enter a URL to parse.' };
  try {
    const url = new URL(trimmed);
    const searchParams: Array<{ key: string; value: string }> = [];
    url.searchParams.forEach((value, key) => searchParams.push({ key, value }));
    return {
      valid: true,
      href: url.href,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: url.pathname,
      search: url.search || undefined,
      hash: url.hash || undefined,
      searchParams,
    };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : 'Invalid URL.',
    };
  }
}

export default function UrlEncoderPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [activeTab, setActiveTab] = useState<TabId>('encode');
  const [encodeInput, setEncodeInput] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [parseInput, setParseInput] = useState('');

  const encoded = useMemo(() => (activeTab === 'encode' ? encodeUrlComponent(encodeInput) : ''), [activeTab, encodeInput]);
  const decoded = useMemo(() => (activeTab === 'decode' ? decodeUrlComponent(decodeInput) : ''), [activeTab, decodeInput]);
  const parsed = useMemo(() => (activeTab === 'parse' ? parseUrl(parseInput) : null), [activeTab, parseInput]);

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Encode and decode URL components and full URLs. Parse query strings and path segments."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <TabSwitcher
          options={[
            { id: 'encode', label: 'Encode' },
            { id: 'decode', label: 'Decode' },
            { id: 'parse', label: 'Parse URL' },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />

        {activeTab === 'encode' && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 min-w-0">
              <div className="min-h-[2.5rem] flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Plain text</label>
                <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
              </div>
              <textarea
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="Text to encode (e.g. hello world, key=value)"
                className="w-full h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
                spellCheck={false}
              />
            </div>
            <div className="space-y-3 min-w-0">
              <div className="min-h-[2.5rem] flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Encoded (component)</label>
                <CopyButton text={encoded} />
              </div>
              <div className="h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl font-mono text-sm text-slate-300 overflow-auto break-all">
                {encoded || '—'}
              </div>
              <p className="text-xs text-slate-400">
                Uses encodeURIComponent() — safe for query values and path segments.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'decode' && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 min-w-0">
              <div className="min-h-[2.5rem] flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Encoded URL / component</label>
                <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
              </div>
              <textarea
                value={decodeInput}
                onChange={(e) => setDecodeInput(e.target.value)}
                placeholder="Encoded string (e.g. hello%20world)"
                className="w-full h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
                spellCheck={false}
              />
            </div>
            <div className="space-y-3 min-w-0">
              <div className="min-h-[2.5rem] flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">Decoded</label>
                <CopyButton text={decoded} />
              </div>
              <div className="h-40 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl font-mono text-sm text-slate-300 overflow-auto break-all whitespace-pre-wrap">
                {decoded || '—'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parse' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Full URL</label>
              <input
                type="text"
                value={parseInput}
                onChange={(e) => setParseInput(e.target.value)}
                placeholder="https://example.com/path?key=value&foo=bar#section"
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 font-mono text-sm"
              />
            </div>
            {parsed && !parsed.valid && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                {parsed.error}
              </div>
            )}
            {parsed && parsed.valid && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {parsed.protocol != null && (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                      <p className="text-xs text-slate-400">Protocol</p>
                      <p className="text-sm font-mono text-slate-200">{parsed.protocol}</p>
                    </div>
                  )}
                  {parsed.host != null && (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                      <p className="text-xs text-slate-400">Host</p>
                      <p className="text-sm font-mono text-slate-200 break-all">{parsed.host}</p>
                    </div>
                  )}
                  {parsed.pathname != null && (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg sm:col-span-2">
                      <p className="text-xs text-slate-400">Pathname</p>
                      <p className="text-sm font-mono text-slate-200 break-all">{parsed.pathname}</p>
                    </div>
                  )}
                  {parsed.search != null && (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg sm:col-span-2">
                      <p className="text-xs text-slate-400">Query string</p>
                      <p className="text-sm font-mono text-slate-200 break-all">{parsed.search}</p>
                    </div>
                  )}
                  {parsed.hash != null && (
                    <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg sm:col-span-2">
                      <p className="text-xs text-slate-400">Hash</p>
                      <p className="text-sm font-mono text-slate-200 break-all">{parsed.hash}</p>
                    </div>
                  )}
                </div>
                {parsed.searchParams && parsed.searchParams.length > 0 && (
                  <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl">
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Query parameters</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-400 border-b border-slate-700/60">
                            <th className="pb-2 pr-4">Key</th>
                            <th className="pb-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsed.searchParams.map(({ key, value }, i) => (
                            <tr key={i} className="border-b border-slate-700/40">
                              <td className="py-2 pr-4 font-mono text-slate-200">{decodeUrlComponent(key)}</td>
                              <td className="py-2 font-mono text-slate-300 break-all">{decodeUrlComponent(value)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Usage</h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Encode: use for query values and path segments (encodeURIComponent).</li>
            <li>• Decode: paste an encoded string to get plain text.</li>
            <li>• Parse: paste a full URL to see protocol, host, path, query, and hash.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
