'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { tailwindClassesToCss } from '@/lib/tools/tailwind-to-css';

const exampleClasses = 'flex flex-col gap-4 p-6 rounded-lg border max-w-md';

export default function TailwindToCssPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [classInput, setClassInput] = useState(exampleClasses);

  const { css, unknown } = useMemo(
    () => tailwindClassesToCss(classInput),
    [classInput]
  );

  return (
    <ToolLayout
      title="Tailwind to CSS"
      description="Convert Tailwind utility classes to equivalent CSS. Debug and understand Tailwind output. Supports common utilities and arbitrary values."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="tailwind-input" className="block text-sm font-medium text-slate-300 mb-2">
            Tailwind classes (space-separated)
          </label>
          <input
            id="tailwind-input"
            type="text"
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
            placeholder="e.g. flex gap-4 p-4 rounded-lg"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm"
          />
        </div>

        {unknown.length > 0 && (
          <p className="text-sm text-amber-400/90">
            Unrecognized (not converted): {unknown.join(', ')}
          </p>
        )}

        <div>
          <h3 className="text-lg font-medium text-white mb-2">CSS output</h3>
          <CodeOutput code={css} language="css" />
        </div>

        <p className="text-xs text-slate-500">
          Supports: display, flex, grid, spacing (p/m/gap), width/height, border, rounded, and arbitrary values like p-[10px] or rounded-[12px]. Not all Tailwind utilities are covered.
        </p>
      </div>
    </ToolLayout>
  );
}
