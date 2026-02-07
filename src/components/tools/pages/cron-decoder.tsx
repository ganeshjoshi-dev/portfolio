'use client';

import { useState, useMemo, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import {
  parseCronExpression,
  getNextRunTimes,
  describeCron,
} from '@/lib/tools/cron';

function formatNextRun(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CronDecoderPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [cronInput, setCronInput] = useState('0 9 * * 1-5');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const parsed = useMemo(() => parseCronExpression(cronInput.trim()), [cronInput]);
  const description = useMemo(() => describeCron(cronInput.trim()), [cronInput]);
  const nextRuns = useMemo(
    () => (parsed.valid ? getNextRunTimes(cronInput.trim(), 5, now) : []),
    [cronInput, parsed.valid, now]
  );

  return (
    <ToolLayout
      title="Cron Expression Decoder"
      description="Decode cron expressions. See human-readable description and next run times. Paste any 5-field cron. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 px-1 sm:px-0">
        <div>
          <label htmlFor="cron-decode-input" className="block text-sm font-medium text-slate-300 mb-2">
            Paste a cron expression (5 fields: minute hour day month weekday)
          </label>
          <input
            id="cron-decode-input"
            type="text"
            value={cronInput}
            onChange={(e) => setCronInput(e.target.value)}
            placeholder="e.g. 0 9 * * 1-5"
            className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm"
          />
        </div>

        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 sm:p-4 space-y-4">
          <h3 className="text-sm font-medium text-slate-300">Expression</h3>
          <code className="block px-3 sm:px-4 py-3 bg-slate-800/60 rounded-lg font-mono text-cyan-300 text-base sm:text-lg break-all overflow-x-auto">
            {cronInput.trim() || '(empty)'}
          </code>
          {!parsed.valid && parsed.error && (
            <p className="text-sm text-red-400" role="alert">
              {parsed.error}
            </p>
          )}
        </div>

        {parsed.valid && (
          <>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 sm:p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">
                Human-readable description
              </h3>
              <p className="text-slate-200 text-sm sm:text-base break-words">{description}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <h3 className="text-sm font-medium text-slate-300">
                  Next 5 run times (local time)
                </h3>
              </div>
              <ul className="space-y-2">
                {nextRuns.map((date, i) => (
                  <li
                    key={i}
                    className="font-mono text-sm text-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 min-w-0"
                  >
                    <span className="break-words">{formatNextRun(date)}</span>
                    <span className="text-slate-500 text-xs truncate sm:max-w-[200px]" title={date.toISOString()}>
                      {date.toISOString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <p className="text-xs text-slate-500">
          All parsing and next-run calculation happens in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
