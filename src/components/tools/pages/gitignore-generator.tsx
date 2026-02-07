'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton, CodeOutput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { GITIGNORE_GROUPS } from '@/lib/tools/gitignore-data';

type Selection = Record<string, boolean>;

function buildInitialSelection(): Selection {
  const sel: Selection = {};
  GITIGNORE_GROUPS.forEach((g) => {
    g.entries.forEach((e) => {
      sel[`${g.id}:${e.pattern}`] = false;
    });
  });
  return sel;
}

export default function GitignoreGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [selection, setSelection] = useState<Selection>(buildInitialSelection);
  const [customLines, setCustomLines] = useState('');

  const output = useMemo(() => {
    const lines: string[] = [];
    GITIGNORE_GROUPS.forEach((group) => {
      const selected = group.entries.filter((e) => selection[`${group.id}:${e.pattern}`]);
      if (selected.length > 0) {
        lines.push(`# ${group.name}`);
        selected.forEach((e) => {
          if (e.comment) {
            lines.push(`${e.pattern}  # ${e.comment}`);
          } else {
            lines.push(e.pattern);
          }
        });
        lines.push('');
      }
    });
    const custom = customLines
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (custom.length > 0) {
      lines.push('# Custom');
      custom.forEach((l) => lines.push(l));
    }
    return lines.join('\n').trim() || '# Add patterns above or select groups below';
  }, [selection, customLines]);

  const toggle = (key: string) => {
    setSelection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGroup = (groupId: string) => {
    const group = GITIGNORE_GROUPS.find((g) => g.id === groupId);
    if (!group) return;
    const allSelected = group.entries.every((e) => selection[`${groupId}:${e.pattern}`]);
    setSelection((prev) => {
      const next = { ...prev };
      group.entries.forEach((e) => {
        next[`${groupId}:${e.pattern}`] = !allSelected;
      });
      return next;
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.gitignore';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title=".gitignore Generator"
      description="Generate .gitignore files with checkboxes for OS, editors, languages, and frameworks."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-3 sm:space-y-4 max-h-[70vh] overflow-y-auto overflow-x-hidden pr-0.5 sm:pr-1 min-w-0">
          {GITIGNORE_GROUPS.map((group) => (
            <div
              key={group.id}
              className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 min-w-0"
            >
              <label className="flex items-center gap-2 cursor-pointer min-w-0">
                <input
                  type="checkbox"
                  checked={group.entries.every((e) => selection[`${group.id}:${e.pattern}`])}
                  onChange={() => toggleGroup(group.id)}
                  className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400 shrink-0 mt-0.5"
                />
                <span className="font-medium text-slate-200 break-words">{group.name}</span>
              </label>
              <ul className="pl-5 sm:pl-6 space-y-1.5 min-w-0">
                {group.entries.map((e) => {
                  const key = `${group.id}:${e.pattern}`;
                  return (
                    <li key={key} className="flex items-start gap-2 min-w-0">
                      <input
                        type="checkbox"
                        id={key}
                        checked={selection[key] ?? false}
                        onChange={() => toggle(key)}
                        className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400 shrink-0 mt-0.5"
                      />
                      <label htmlFor={key} className="text-sm text-slate-400 font-mono cursor-pointer break-words min-w-0">
                        {e.pattern}
                        {e.comment && <span className="text-slate-500 ml-1"># {e.comment}</span>}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="p-3 sm:p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2 min-w-0">
            <label className="block text-sm font-medium text-slate-300">Custom lines (one per line)</label>
            <textarea
              value={customLines}
              onChange={(e) => setCustomLines(e.target.value)}
              placeholder="# custom pattern"
              className="w-full h-24 p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none"
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-medium text-white">.gitignore</h3>
            <div className="flex flex-wrap gap-2">
              <CopyButton
                text={output}
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 rounded-lg text-sm font-medium hover:bg-cyan-500/30 shrink-0"
              />
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 bg-slate-700/60 text-slate-300 border border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-600/60 shrink-0"
              >
                Download
              </button>
            </div>
          </div>
          <CodeOutput code={output} language="text" />
        </div>
      </div>
    </ToolLayout>
  );
}
