'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { decodeHtmlEntities, encodeToNumeric, encodeToNamed } from '@/lib/tools/html-entities';

type TabId = 'decode' | 'encode-named' | 'encode-numeric';

const TEXTAREA_CLASS =
  'w-full h-[260px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

export default function HtmlEntitiesPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [tab, setTab] = useState<TabId>('decode');
  const [decodeInput, setDecodeInput] = useState('Hello &amp; welcome &lt;world&gt;');
  const [encodeInput, setEncodeInput] = useState('Café & "quotes" <tag>');
  const [useHex, setUseHex] = useState(false);

  const decoded = useMemo(
    () => (tab === 'decode' ? decodeHtmlEntities(decodeInput) : ''),
    [tab, decodeInput]
  );
  const encodedNamed = useMemo(
    () => (tab === 'encode-named' ? encodeToNamed(encodeInput) : ''),
    [tab, encodeInput]
  );
  const encodedNumeric = useMemo(
    () => (tab === 'encode-numeric' ? encodeToNumeric(encodeInput, useHex) : ''),
    [tab, encodeInput, useHex]
  );

  const output =
    tab === 'decode' ? decoded : tab === 'encode-named' ? encodedNamed : encodedNumeric;

  return (
    <ToolLayout
      title="HTML Entity Encoder/Decoder"
      description="Encode and decode HTML entities: named and numeric. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <TabSwitcher
          options={[
            { id: 'decode', label: 'Decode' },
            { id: 'encode-named', label: 'Encode (named)' },
            { id: 'encode-numeric', label: 'Encode (numeric)' },
          ]}
          activeTab={tab}
          onChange={(id) => setTab(id as TabId)}
        />

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {tab === 'decode' ? 'Text with entities' : 'Plain text'}
              </label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={tab === 'decode' ? decodeInput : encodeInput}
              onChange={(e) =>
                tab === 'decode' ? setDecodeInput(e.target.value) : setEncodeInput(e.target.value)
              }
              placeholder={tab === 'decode' ? 'e.g. &amp; &lt; &nbsp; &#160;' : 'Enter text...'}
              spellCheck={false}
            />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {tab === 'decode' ? 'Decoded text' : 'Encoded output'}
              </label>
              {output && <CopyButton text={output} className="text-cyan-400 hover:text-cyan-300 text-sm" />}
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={output}
              readOnly
              placeholder="Result..."
            />
          </div>
        </div>

        {tab === 'encode-numeric' && (
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={useHex}
              onChange={(e) => setUseHex(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
            />
            Use hex (&#x20; style) for numeric entities
          </label>
        )}

        <p className="text-xs text-slate-500">
          All encoding and decoding runs in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
