'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const formatUuid = useCallback(
    (uuid: string) => {
      let result = uuid;
      if (noDashes) result = result.replace(/-/g, '');
      if (uppercase) result = result.toUpperCase();
      return result;
    },
    [uppercase, noDashes]
  );

  const addUuid = useCallback(() => {
    setUuids((prev) => [...prev, generateUUID()]);
  }, []);

  const regenerateAll = useCallback(() => {
    setUuids((prev) => prev.map(() => generateUUID()));
  }, []);

  const regenerateOne = useCallback((index: number) => {
    setUuids((prev) => prev.map((uuid, i) => (i === index ? generateUUID() : uuid)));
  }, []);

  const removeUuid = useCallback((index: number) => {
    setUuids((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setUuids([generateUUID()]);
  }, []);

  const bulkGenerate = useCallback((count: number) => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids(newUuids);
  }, []);

  const copyAll = useCallback(() => {
    const text = uuids.map(formatUuid).join('\n');
    navigator.clipboard.writeText(text);
  }, [uuids, formatUuid]);

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random UUIDs (v4) in bulk. Copy individual or all at once."
      tool={tool}
      category={category}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
            />
            Uppercase
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={noDashes}
              onChange={(e) => setNoDashes(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
            />
            No Dashes
          </label>
        </div>

        {/* Bulk Generate */}
        <div className="flex flex-wrap gap-2">
          {[5, 10, 25, 50].map((count) => (
            <button
              key={count}
              onClick={() => bulkGenerate(count)}
              className="px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
            >
              Generate {count}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addUuid}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-sm text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              onClick={regenerateAll}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Regenerate All</span>
              <span className="sm:hidden">Regenerate</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyAll}
              className="px-3 sm:px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
            >
              Copy All
            </button>
            {uuids.length > 1 && (
              <button
                onClick={clearAll}
                className="px-3 sm:px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-red-400/50 rounded-lg text-sm text-slate-400 hover:text-red-300 transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* UUID List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {uuids.map((uuid, index) => (
            <div
              key={`${uuid}-${index}`}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 group"
            >
              <span className="text-xs text-slate-500 w-4 sm:w-6 flex-shrink-0">{index + 1}</span>
              <code className="flex-1 min-w-0 font-mono text-cyan-300 text-xs sm:text-sm break-all">
                {formatUuid(uuid)}
              </code>
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => regenerateOne(index)}
                  className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors"
                  aria-label="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <CopyButton text={formatUuid(uuid)} />
                {uuids.length > 1 && (
                  <button
                    onClick={() => removeUuid(index)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Count */}
        <p className="text-center text-sm text-slate-500">
          {uuids.length} UUID{uuids.length !== 1 ? 's' : ''} generated
        </p>
      </div>
    </ToolLayout>
  );
}
