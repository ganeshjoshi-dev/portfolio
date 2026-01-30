'use client';

import { CodeOutputProps } from '@/types/tools';
import CopyButton from './CopyButton';

const languageLabels: Record<string, string> = {
  css: 'CSS',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  html: 'HTML',
  json: 'JSON',
  jsx: 'JSX',
  tsx: 'TSX',
  text: 'Output',
};

export default function CodeOutput({
  code,
  language,
  title,
  showLineNumbers = false,
}: CodeOutputProps) {
  const lines = code.split('\n');

  return (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/60 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-sm text-slate-400">
            {title || languageLabels[language] || language.toUpperCase()}
          </span>
        </div>
        <CopyButton text={code} />
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono">
          <code className="text-slate-300 block">
            {showLineNumbers
              ? lines.map((line, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span
                      className="select-none text-slate-500 shrink-0 w-6 tabular-nums text-right"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <span className="break-all">{line || ' '}</span>
                  </div>
                ))
              : code}
          </code>
        </pre>
      </div>
    </div>
  );
}
