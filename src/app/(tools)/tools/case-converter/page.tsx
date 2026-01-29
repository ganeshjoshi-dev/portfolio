'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import Textarea from '@/components/ui/Textarea';

const tool = getToolById('case-converter')!;
const category = toolCategories[tool.category];

export type CaseType =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'snake'
  | 'kebab'
  | 'swap';

function convertCase(text: string, type: CaseType): string {
  if (!text.trim()) return '';

  switch (type) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title': {
      return text
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    case 'sentence': {
      const segments = text.toLowerCase().split(/(?<=[.!?])\s+/);
      return segments
        .map((s) =>
          s.replace(/^(\s*)(\w)/, (_, spaces, letter) =>
            spaces + letter.toUpperCase()
          )
        )
        .join(' ');
    }
    case 'camel': {
      const words = text
        .trim()
        .split(/[\s_\-]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
      if (words.length === 0) return '';
      return words
        .map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join('');
    }
    case 'snake': {
      const words = text
        .trim()
        .split(/[\s\-]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
      return words.join('_');
    }
    case 'kebab': {
      const words = text
        .trim()
        .split(/[\s_]+/)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
      return words.join('-');
    }
    case 'swap': {
      return text
        .split('')
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join('');
    }
    default:
      return text;
  }
}

const CASE_OPTIONS: { id: CaseType; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'swap', label: 'Swap Case' },
];

export default function CaseConverterPage() {
  const [text, setText] = useState('');
  const [caseType, setCaseType] = useState<CaseType>('title');

  const output = useMemo(() => convertCase(text, caseType), [text, caseType]);

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case, or swap case. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6 px-1 sm:px-0">
        <div className="p-[5px] -m-[5px] sm:mx-0">
          <Textarea
            label="Enter or paste your text"
            id="case-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text here..."
            spellCheck={false}
            className="[&_label]:text-slate-300 [&_label]:mb-2"
            textareaClassName="h-40 rounded-xl bg-slate-900/60 border-slate-700/60 text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="mt-8">
          <span className="block text-sm font-medium text-slate-300 mb-2">
            Convert to
          </span>
          <div className="flex flex-wrap gap-2">
            {CASE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCaseType(opt.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  caseType === opt.id
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label
              htmlFor="case-output"
              className="text-sm font-medium text-slate-300 shrink-0"
            >
              Result
            </label>
            {output && (
              <CopyButton
                text={output}
                className="bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 shrink-0"
              />
            )}
          </div>
          <div className="p-[5px] -m-[5px] sm:mx-0">
            <Textarea
              id="case-output"
              readOnly
              value={output}
              aria-label="Converted text output"
              textareaClassName="h-40 rounded-xl bg-slate-900/60 border-slate-700/60 text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 resize-none"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          All conversion happens in your browser. Your text is never sent to any
          server.
        </p>
      </div>
    </ToolLayout>
  );
}
