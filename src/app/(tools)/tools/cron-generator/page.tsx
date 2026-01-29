'use client';

import { useState, useMemo, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import {
  parseCronExpression,
  getNextRunTimes,
  describeCron,
  CRON_PRESETS,
} from '@/lib/tools/cron';

const tool = getToolById('cron-generator')!;
const category = toolCategories[tool.category];

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

export default function CronGeneratorPage() {
  const [cronExpr, setCronExpr] = useState('0 9 * * 1-5');
  const [pasteInput, setPasteInput] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const parsed = useMemo(() => parseCronExpression(cronExpr), [cronExpr]);
  const description = useMemo(() => describeCron(cronExpr), [cronExpr]);
  const nextRuns = useMemo(
    () => (parsed.valid ? getNextRunTimes(cronExpr, 5, now) : []),
    [cronExpr, parsed.valid, now]
  );

  const applyPreset = (expr: string) => {
    setCronExpr(expr);
    setPasteInput('');
  };

  const applyPaste = () => {
    const trimmed = pasteInput.trim();
    if (trimmed) setCronExpr(trimmed);
  };

  return (
    <ToolLayout
      title="Cron Expression Generator"
      description="Build cron expressions visually. See human-readable description and next run times. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 px-1 sm:px-0">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {CRON_PRESETS.map(({ name, expr }) => (
              <button
                key={expr}
                type="button"
                onClick={() => applyPreset(expr)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  cronExpr === expr
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="cron-paste" className="block text-sm font-medium text-slate-300 mb-2">
            Or paste a cron expression (5 fields)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="cron-paste"
              type="text"
              value={pasteInput}
              onChange={(e) => setPasteInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyPaste()}
              placeholder="e.g. 0 9 * * 1-5"
              className="w-full min-w-0 sm:flex-1 px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm"
            />
            <button
              type="button"
              onClick={applyPaste}
              className="w-full sm:w-auto shrink-0 px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3 sm:p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <label className="text-sm font-medium text-slate-300 shrink-0">
              Cron expression
            </label>
            <CopyButton
              text={cronExpr}
              className="bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 w-fit"
            />
          </div>
          <code className="block px-3 sm:px-4 py-3 bg-slate-800/60 rounded-lg font-mono text-cyan-300 text-base sm:text-lg break-all overflow-x-auto">
            {cronExpr}
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
          All parsing and next-run calculation happens in your browser. No data
          is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
