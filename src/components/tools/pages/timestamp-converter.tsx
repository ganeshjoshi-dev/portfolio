'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Calendar, RefreshCw } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

export default function TimestampConverterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTimestampToDate = useCallback((timestamp: string) => {
    if (!timestamp) return null;
    const ts = parseFloat(timestamp);
    if (isNaN(ts)) return null;

    const date = new Date(unit === 'seconds' ? ts * 1000 : ts);
    if (isNaN(date.getTime())) return null;

    return date;
  }, [unit]);

  const convertDateToTimestamp = useCallback((dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    return unit === 'seconds' 
      ? Math.floor(date.getTime() / 1000)
      : date.getTime();
  }, [unit]);

  const timestampDate = convertTimestampToDate(inputTimestamp);
  const dateTimestamp = convertDateToTimestamp(inputDate);

  const formatDate = (date: Date) => ({
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  });

  const currentFormats = formatDate(new Date(currentTimestamp));
  const inputFormats = timestampDate ? formatDate(timestampDate) : null;

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert between Unix timestamps and human-readable dates. Support for seconds and milliseconds with multiple format outputs."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Timestamp */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-slate-200">Current Timestamp</h3>
            </div>
            <button
              onClick={() => setCurrentTimestamp(Date.now())}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/40 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Seconds</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-cyan-300">
                  {Math.floor(currentTimestamp / 1000)}
                </code>
                <CopyButton text={Math.floor(currentTimestamp / 1000).toString()} />
              </div>
            </div>
            <div className="bg-slate-900/40 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Milliseconds</p>
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-cyan-300">{currentTimestamp}</code>
                <CopyButton text={currentTimestamp.toString()} />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {Object.entries(currentFormats).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-3 p-2 bg-slate-900/40 rounded-lg">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase">{key}</p>
                  <p className="text-sm text-slate-300 font-mono">{value}</p>
                </div>
                <CopyButton text={value} />
              </div>
            ))}
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setUnit('seconds')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              unit === 'seconds'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
            }`}
          >
            Seconds
          </button>
          <button
            onClick={() => setUnit('milliseconds')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              unit === 'milliseconds'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
            }`}
          >
            Milliseconds
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Timestamp to Date */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-slate-200">Timestamp → Date</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter Timestamp ({unit})
              </label>
              <input
                type="text"
                value={inputTimestamp}
                onChange={(e) => setInputTimestamp(e.target.value)}
                placeholder={unit === 'seconds' ? '1640000000' : '1640000000000'}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 font-mono"
              />
            </div>

            {inputFormats && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">Converted Dates</p>
                {Object.entries(inputFormats).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-3 p-3 bg-slate-800/60 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase">{key}</p>
                      <p className="text-sm text-slate-300 font-mono truncate">{value}</p>
                    </div>
                    <CopyButton text={value} />
                  </div>
                ))}
              </div>
            )}

            {inputTimestamp && !inputFormats && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300">Invalid timestamp format</p>
              </div>
            )}
          </div>

          {/* Date to Timestamp */}
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-slate-200">Date → Timestamp</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Enter Date & Time
              </label>
              <input
                type="datetime-local"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              />
            </div>

            {dateTimestamp !== null && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">Converted Timestamp</p>
                <div className="flex items-center justify-between gap-3 p-4 bg-slate-800/60 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      {unit === 'seconds' ? 'Seconds' : 'Milliseconds'}
                    </p>
                    <code className="text-xl font-mono text-emerald-300">{dateTimestamp}</code>
                  </div>
                  <CopyButton text={dateTimestamp.toString()} />
                </div>
              </div>
            )}

            {inputDate && dateTimestamp === null && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs text-red-300">Invalid date format</p>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">📅 What is Unix Time?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unix time (also known as Epoch time) is the number of seconds that have elapsed since
              00:00:00 UTC on January 1, 1970 (the Unix epoch), excluding leap seconds.
            </p>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">⚡ Common Uses</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Database timestamps</li>
              <li>• API responses</li>
              <li>• Log files</li>
              <li>• Cache expiration</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
