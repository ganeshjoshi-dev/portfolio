'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { HTTP_STATUS_CODES, searchStatusCodes } from '@/lib/tools/http-status-codes';

function StatusGroup({
  title,
  codes,
  range,
}: {
  title: string;
  codes: typeof HTTP_STATUS_CODES;
  range: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
        <span className="text-cyan-400 font-mono text-sm">{range}</span>
        {title}
      </h2>
      <ul className="space-y-2">
        {codes.map((entry) => (
          <li
            key={entry.code}
            className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg"
          >
            <div className="flex flex-wrap items-baseline gap-2 mb-1">
              <span className="font-mono font-semibold text-cyan-300">{entry.code}</span>
              <span className="font-medium text-white">{entry.name}</span>
            </div>
            <p className="text-sm text-slate-400">{entry.description}</p>
            {entry.useCase && (
              <p className="text-xs text-slate-500 mt-1.5">Use case: {entry.useCase}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HttpStatusCodesPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => searchStatusCodes(query), [query]);

  const grouped = useMemo(() => {
    const info = [
      { title: 'Informational', range: '1xx', min: 100, max: 199 },
      { title: 'Success', range: '2xx', min: 200, max: 299 },
      { title: 'Redirection', range: '3xx', min: 300, max: 399 },
      { title: 'Client Error', range: '4xx', min: 400, max: 499 },
      { title: 'Server Error', range: '5xx', min: 500, max: 599 },
    ];
    return info.map(({ title, range, min, max }) => ({
      title,
      range,
      codes: filtered.filter((e) => e.code >= min && e.code <= max),
    })).filter((g) => g.codes.length > 0);
  }, [filtered]);

  return (
    <ToolLayout
      title="HTTP Status Code Reference"
      description="Searchable reference of HTTP status codes with descriptions and typical use cases."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No status codes match your search.</p>
        ) : (
          <div className="space-y-8">
            {grouped.map((g) => (
              <StatusGroup
                key={g.range}
                title={g.title}
                range={g.range}
                codes={g.codes}
              />
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
