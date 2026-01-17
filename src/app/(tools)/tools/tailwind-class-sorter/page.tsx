'use client';

import { useState, useMemo } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { ToolLayout, CodeOutput, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('tailwind-class-sorter')!;
const category = toolCategories[tool.category];

// Tailwind class ordering based on official prettier plugin
const categoryOrder = [
  // Layout
  'container', 'box-', 'block', 'inline', 'flex', 'grid', 'table', 'hidden', 'visible',
  // Flexbox & Grid
  'flex-', 'grow', 'shrink', 'basis-', 'grid-', 'col-', 'row-', 'auto-', 'gap-',
  'justify-', 'content-', 'items-', 'self-', 'place-',
  // Spacing
  'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-', 'ps-', 'pe-',
  'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-', 'ms-', 'me-',
  'space-',
  // Sizing
  'w-', 'min-w-', 'max-w-', 'h-', 'min-h-', 'max-h-', 'size-',
  // Typography
  'font-', 'text-', 'leading-', 'tracking-', 'line-clamp-',
  'list-', 'decoration-', 'underline', 'overline', 'line-through', 'no-underline',
  'uppercase', 'lowercase', 'capitalize', 'normal-case',
  'truncate', 'break-', 'whitespace-',
  // Backgrounds
  'bg-', 'from-', 'via-', 'to-', 'gradient-',
  // Borders
  'rounded', 'border', 'divide-', 'outline-', 'ring-',
  // Effects
  'shadow', 'opacity-', 'mix-blend-', 'bg-blend-',
  // Filters
  'blur-', 'brightness-', 'contrast-', 'grayscale', 'hue-rotate-', 'invert', 'saturate-', 'sepia',
  'backdrop-',
  // Transitions & Animation
  'transition', 'duration-', 'ease-', 'delay-', 'animate-',
  // Transforms
  'scale-', 'rotate-', 'translate-', 'skew-', 'origin-', 'transform',
  // Interactivity
  'cursor-', 'select-', 'resize', 'scroll-', 'snap-', 'touch-',
  'pointer-events-', 'user-select-',
  // Accessibility
  'sr-only', 'not-sr-only',
];

// Get priority for sorting
function getClassPriority(className: string): number {
  // Handle responsive and state prefixes
  const baseName = className.replace(/^(sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|disabled:|dark:|group-hover:|peer-)/g, '');
  
  for (let i = 0; i < categoryOrder.length; i++) {
    const pattern = categoryOrder[i];
    if (baseName.startsWith(pattern) || baseName === pattern.replace(/-$/, '')) {
      return i;
    }
  }
  return categoryOrder.length; // Unknown classes go to end
}

function sortClasses(input: string): string {
  const classes = input.trim().split(/\s+/).filter(Boolean);
  
  // Sort by category, then alphabetically within category
  classes.sort((a, b) => {
    const priorityA = getClassPriority(a);
    const priorityB = getClassPriority(b);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    return a.localeCompare(b);
  });
  
  return classes.join(' ');
}

const sampleInput = `text-white hover:text-cyan-300 px-6 bg-slate-900/70 transition-all py-3 duration-300 border rounded-lg hover:scale-105 flex items-center border-slate-700/70 hover:border-cyan-400/60 space-x-2 hover:bg-cyan-400/15`;

export default function TailwindClassSorterPage() {
  const [input, setInput] = useState(sampleInput);

  const sorted = useMemo(() => sortClasses(input), [input]);

  const handleSort = () => {
    setInput(sorted);
  };

  return (
    <ToolLayout
      title="Tailwind Class Sorter"
      description="Sort Tailwind CSS classes in the recommended order (matches Prettier plugin)."
      tool={tool}
      category={category}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Input Classes</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your Tailwind classes here..."
            className="
              w-full h-32 p-4 bg-slate-900/60 border border-slate-700/60
              rounded-xl text-white font-mono text-sm resize-none
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
          <p className="text-xs text-slate-500">
            {input.trim().split(/\s+/).filter(Boolean).length} classes
          </p>
        </div>

        {/* Sort Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSort}
            className="
              flex items-center gap-2 px-6 py-3
              bg-cyan-400/20 border border-cyan-400/50
              rounded-lg text-cyan-300 font-medium
              hover:bg-cyan-400/30 transition-all duration-300
            "
          >
            <ArrowUpDown className="w-5 h-5" />
            Sort Classes
          </button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Sorted Output</label>
            <CopyButton text={sorted} />
          </div>
          <div className="p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-xl font-mono text-sm text-cyan-300 break-all">
            {sorted || <span className="text-slate-500">Enter classes above...</span>}
          </div>
        </div>

        {/* JSX Output */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">As JSX</label>
          <CodeOutput
            code={`<div className="${sorted}">\n  {/* Content */}\n</div>`}
            language="jsx"
          />
        </div>

        {/* Order Reference */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Sorting Order</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              'Layout',
              'Flexbox/Grid',
              'Spacing',
              'Sizing',
              'Typography',
              'Backgrounds',
              'Borders',
              'Effects',
              'Filters',
              'Transitions',
              'Transforms',
              'Interactivity',
            ].map((category, index) => (
              <div
                key={category}
                className="px-3 py-2 bg-slate-800/60 rounded text-slate-400"
              >
                <span className="text-slate-500 mr-2">{index + 1}.</span>
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
