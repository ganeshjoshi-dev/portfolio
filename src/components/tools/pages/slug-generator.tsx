'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { Checkbox } from '@/components/ui';
import { getToolById, toolCategories } from '@/config/tools';

type SlugStyle = 'kebab' | 'snake' | 'camel' | 'pascal' | 'dot';

interface SlugConfig {
  style: SlugStyle;
  lowercase: boolean;
  removeNumbers: boolean;
  maxLength: number;
}

function generateSlug(text: string, config: SlugConfig): string {
  if (!text.trim()) return '';

  let result = text
    // Normalize unicode characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove special characters except spaces and hyphens
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces/hyphens with single space
    .replace(/[\s-]+/g, ' ')
    .trim();

  if (config.removeNumbers) {
    result = result.replace(/\d/g, '');
  }

  const words = result.split(' ').filter(Boolean);

  switch (config.style) {
    case 'kebab':
      result = words.join('-');
      break;
    case 'snake':
      result = words.join('_');
      break;
    case 'camel':
      result = words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
      break;
    case 'pascal':
      result = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
      break;
    case 'dot':
      result = words.join('.');
      break;
  }

  if (config.lowercase && config.style !== 'camel' && config.style !== 'pascal') {
    result = result.toLowerCase();
  }

  if (config.maxLength > 0 && result.length > config.maxLength) {
    result = result.slice(0, config.maxLength);
    // Clean up trailing separator
    result = result.replace(/[-_.]$/, '');
  }

  return result;
}

const styles: { id: SlugStyle; name: string; example: string }[] = [
  { id: 'kebab', name: 'Kebab Case', example: 'my-slug-example' },
  { id: 'snake', name: 'Snake Case', example: 'my_slug_example' },
  { id: 'camel', name: 'Camel Case', example: 'mySlugExample' },
  { id: 'pascal', name: 'Pascal Case', example: 'MySlugExample' },
  { id: 'dot', name: 'Dot Case', example: 'my.slug.example' },
];

export default function SlugGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState('My Awesome Blog Post Title!');
  const [config, setConfig] = useState<SlugConfig>({
    style: 'kebab',
    lowercase: true,
    removeNumbers: false,
    maxLength: 0,
  });

  const generatedSlug = useMemo(() => generateSlug(input, config), [input, config]);

  return (
    <ToolLayout
      title="Slug Generator"
      description="Generate URL-safe slugs in multiple formats (kebab, snake, camel, pascal)."
      tool={tool}
      category={category}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Input Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text..."
            className="
              w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60
              rounded-xl text-white text-lg
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
        </div>

        {/* Style Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Slug Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setConfig((prev) => ({ ...prev, style: style.id }))}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300
                  ${config.style === style.id
                    ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <div className="text-sm font-medium">{style.name}</div>
                <div className="text-xs opacity-70 font-mono mt-1">{style.example}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <Checkbox
            checked={config.lowercase}
            onChange={(e) => setConfig((prev) => ({ ...prev, lowercase: e.target.checked }))}
            label="Force Lowercase"
          />
          <Checkbox
            checked={config.removeNumbers}
            onChange={(e) => setConfig((prev) => ({ ...prev, removeNumbers: e.target.checked }))}
            label="Remove Numbers"
          />
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span>Max Length:</span>
            <input
              type="number"
              min="0"
              max="200"
              value={config.maxLength || ''}
              onChange={(e) => setConfig((prev) => ({ ...prev, maxLength: Number(e.target.value) || 0 }))}
              placeholder="None"
              className="
                w-20 px-2 py-1 bg-slate-800/60 border border-slate-700/60
                rounded text-white text-sm
                focus:border-cyan-400/50 focus:outline-none
              "
            />
          </div>
        </div>

        {/* Output */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Generated Slug</label>
            <CopyButton text={generatedSlug} />
          </div>
          <div className="px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg font-mono text-cyan-300 text-lg break-all">
            {generatedSlug || <span className="text-slate-500">Enter text above...</span>}
          </div>
          {generatedSlug && (
            <p className="mt-2 text-xs text-slate-500">
              {generatedSlug.length} characters
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
