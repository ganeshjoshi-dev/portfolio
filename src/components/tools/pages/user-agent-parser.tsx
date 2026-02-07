'use client';

import { useState, useMemo } from 'react';
import { UAParser } from 'ua-parser-js';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const defaultUA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const TEXTAREA_CLASS =
  'w-full min-h-[100px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

function formatValue(v: string | undefined): string {
  return v?.trim() ? v : '—';
}

export default function UserAgentParserPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [ua, setUa] = useState(defaultUA);

  const parsed = useMemo(() => {
    const trimmed = ua.trim();
    if (!trimmed) return null;
    try {
      const p = new UAParser(trimmed);
      const browser = p.getBrowser();
      const os = p.getOS();
      const device = p.getDevice();
      const engine = p.getEngine();
      return {
        browser: `${formatValue(browser.name)} ${formatValue(browser.version)}`.trim() || '—',
        os: `${formatValue(os.name)} ${formatValue(os.version)}`.trim() || '—',
        device: device.type ? `${formatValue(device.vendor)} ${formatValue(device.model)}`.trim() || '—' : '—',
        deviceType: formatValue(device.type || 'Desktop'),
        engine: `${formatValue(engine.name)} ${formatValue(engine.version)}`.trim() || '—',
        cpu: formatValue(p.getCPU().architecture),
      };
    } catch {
      return null;
    }
  }, [ua]);

  const jsonOutput = useMemo(() => {
    const trimmed = ua.trim();
    if (!trimmed) return '';
    try {
      const p = new UAParser(trimmed);
      const result = p.getResult();
      return JSON.stringify(result, null, 2);
    } catch {
      return '';
    }
  }, [ua]);

  return (
    <ToolLayout
      title="User-Agent Parser"
      description="Parse User-Agent strings to see browser, OS, and device. All parsing in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">User-Agent string</label>
          <textarea
            className={TEXTAREA_CLASS}
            value={ua}
            onChange={(e) => setUa(e.target.value)}
            placeholder="Paste User-Agent string..."
            spellCheck={false}
            rows={3}
          />
        </div>

        {parsed && (
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Parsed result</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">Browser</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.browser}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">OS</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.os}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">Device type</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.deviceType}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">Device</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.device}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">Engine</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.engine}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wider">CPU</dt>
                <dd className="text-slate-200 font-mono text-sm mt-0.5">{parsed.cpu}</dd>
              </div>
            </dl>
            {jsonOutput && (
              <div className="mt-4 pt-4 border-t border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">Full result (JSON)</span>
                  <CopyButton text={jsonOutput} className="text-cyan-400 hover:text-cyan-300 text-sm" />
                </div>
                <pre className="p-4 bg-slate-950 rounded-lg text-slate-300 text-xs overflow-auto max-h-48">
                  {jsonOutput}
                </pre>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">
          Parsing runs entirely in your browser. No User-Agent string is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
