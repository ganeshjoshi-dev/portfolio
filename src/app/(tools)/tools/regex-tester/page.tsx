'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('regex-tester')!;
const category = toolCategories[tool.category];

const commonPatterns = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Hex Color', pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
  { name: 'Username', pattern: '^[a-zA-Z0-9_]{3,16}$' },
  { name: 'Password (Strong)', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' },
];

interface Match {
  text: string;
  index: number;
  groups?: string[];
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello world! Test your regex patterns here.\nemail@example.com\n192.168.1.1');
  const [error, setError] = useState('');

  const { matches } = useMemo(() => {
    if (!pattern) {
      return { matches: [] };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matchList: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          matchList.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchList.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setError('');
      
      return { matches: matchList };
    } catch (e) {
      setError((e as Error).message);
      return { matches: [] };
    }
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regular expressions with live matching, common patterns, and flag options."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        {/* Pattern Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Regular Expression</label>
            <div className="flex gap-2">
              {['g', 'i', 'm', 's'].map((flag) => (
                <button
                  key={flag}
                  onClick={() => toggleFlag(flag)}
                  className={`
                    w-8 h-8 rounded text-sm font-mono transition-all duration-300
                    ${flags.includes(flag)
                      ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/60 border border-slate-700/60 text-slate-500 hover:text-slate-300'
                    }
                  `}
                  title={
                    flag === 'g' ? 'Global' :
                    flag === 'i' ? 'Case insensitive' :
                    flag === 'm' ? 'Multiline' :
                    'Dot matches newline'
                  }
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-lg">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className="
                flex-1 px-4 py-3 bg-slate-900/60 border border-slate-700/60
                rounded-lg text-white font-mono
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
            <span className="text-slate-500 text-lg">/{flags}</span>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {/* Common Patterns */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Common Patterns</label>
          <div className="flex flex-wrap gap-2">
            {commonPatterns.map((p) => (
              <button
                key={p.name}
                onClick={() => setPattern(p.pattern)}
                className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all duration-300"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test String */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              className="
                w-full h-[300px] p-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white font-mono text-sm resize-none
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>

          {/* Matches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Matches ({matches.length})
              </label>
            </div>
            <div className="h-[300px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl overflow-y-auto">
              {matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500">
                          Match {index + 1} at index {match.index}
                        </span>
                        <CopyButton text={match.text} />
                      </div>
                      <code className="text-cyan-300 font-mono text-sm break-all">
                        {match.text}
                      </code>
                      {match.groups && match.groups.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/60">
                          <span className="text-xs text-slate-500">Groups:</span>
                          {match.groups.map((group, i) => (
                            <span key={i} className="ml-2 text-xs text-amber-400">
                              ${i + 1}: {group}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  {pattern ? 'No matches found' : 'Enter a pattern to start matching'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
