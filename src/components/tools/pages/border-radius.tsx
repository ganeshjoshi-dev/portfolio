'use client';

import { useState, useMemo } from 'react';
import { Link2, Link2Off, RotateCcw } from 'lucide-react';
import { ToolLayout, CodeOutput, TabSwitcher, SliderInput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

const presets = [
  { name: 'None', value: { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 } },
  { name: 'Small', value: { topLeft: 4, topRight: 4, bottomRight: 4, bottomLeft: 4 } },
  { name: 'Medium', value: { topLeft: 8, topRight: 8, bottomRight: 8, bottomLeft: 8 } },
  { name: 'Large', value: { topLeft: 16, topRight: 16, bottomRight: 16, bottomLeft: 16 } },
  { name: 'XL', value: { topLeft: 24, topRight: 24, bottomRight: 24, bottomLeft: 24 } },
  { name: 'Full', value: { topLeft: 9999, topRight: 9999, bottomRight: 9999, bottomLeft: 9999 } },
  { name: 'Pill Left', value: { topLeft: 9999, topRight: 0, bottomRight: 0, bottomLeft: 9999 } },
  { name: 'Pill Right', value: { topLeft: 0, topRight: 9999, bottomRight: 9999, bottomLeft: 0 } },
];

export default function BorderRadiusPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [radius, setRadius] = useState<BorderRadius>({
    topLeft: 12,
    topRight: 12,
    bottomRight: 12,
    bottomLeft: 12,
  });
  const [linked, setLinked] = useState(true);
  const [outputTab, setOutputTab] = useState('css');

  const updateRadius = (key: keyof BorderRadius, value: number) => {
    if (linked) {
      setRadius({ topLeft: value, topRight: value, bottomRight: value, bottomLeft: value });
    } else {
      setRadius((prev) => ({ ...prev, [key]: value }));
    }
  };

  const cssValue = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = radius;
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}px`;
    }
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }, [radius]);

  const tailwindClass = useMemo(() => {
    const { topLeft, topRight, bottomRight, bottomLeft } = radius;
    const allSame = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;

    if (allSame) {
      if (topLeft === 0) return 'rounded-none';
      if (topLeft === 2) return 'rounded-sm';
      if (topLeft === 4) return 'rounded';
      if (topLeft === 6) return 'rounded-md';
      if (topLeft === 8) return 'rounded-lg';
      if (topLeft === 12) return 'rounded-xl';
      if (topLeft === 16) return 'rounded-2xl';
      if (topLeft === 24) return 'rounded-3xl';
      if (topLeft >= 9999) return 'rounded-full';
      return `rounded-[${topLeft}px]`;
    }

    return `rounded-tl-[${topLeft}px] rounded-tr-[${topRight}px] rounded-br-[${bottomRight}px] rounded-bl-[${bottomLeft}px]`;
  }, [radius]);

  const fullCSS = `.element {\n  border-radius: ${cssValue};\n}`;

  return (
    <ToolLayout
      title="Border Radius Generator"
      description="Design custom border radius with asymmetric corners. Export to CSS or Tailwind."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Preview */}
        <div className="space-y-4 lg:space-y-6">
          <div className="aspect-video bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-center p-4 sm:p-8 min-h-[200px]">
            <div
              className="w-32 h-24 sm:w-48 sm:h-32 bg-gradient-to-br from-cyan-400 to-blue-500 transition-all duration-300"
              style={{ borderRadius: cssValue }}
            />
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Presets</h3>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setRadius(preset.value)}
                  className="px-3 sm:px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Corner Radius</h3>
            <button
              onClick={() => setLinked(!linked)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                linked
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60'
              }`}
            >
              {linked ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
              {linked ? 'Linked' : 'Unlinked'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <SliderInput
              label="Top Left"
              value={radius.topLeft}
              min={0}
              max={100}
              unit="px"
              onChange={(v) => updateRadius('topLeft', v)}
            />
            <SliderInput
              label="Top Right"
              value={radius.topRight}
              min={0}
              max={100}
              unit="px"
              onChange={(v) => updateRadius('topRight', v)}
            />
            <SliderInput
              label="Bottom Left"
              value={radius.bottomLeft}
              min={0}
              max={100}
              unit="px"
              onChange={(v) => updateRadius('bottomLeft', v)}
            />
            <SliderInput
              label="Bottom Right"
              value={radius.bottomRight}
              min={0}
              max={100}
              unit="px"
              onChange={(v) => updateRadius('bottomRight', v)}
            />
          </div>

          <button
            onClick={() => setRadius({ topLeft: 12, topRight: 12, bottomRight: 12, bottomLeft: 12 })}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-lg text-sm text-slate-400 hover:text-slate-300 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Output</h3>
          <TabSwitcher
            options={[{ id: 'css', label: 'CSS' }, { id: 'tailwind', label: 'Tailwind' }]}
            activeTab={outputTab}
            onChange={setOutputTab}
          />
        </div>
        <CodeOutput
          code={outputTab === 'css' ? fullCSS : `<div className="${tailwindClass}">\n  {/* Content */}\n</div>`}
          language={outputTab === 'css' ? 'css' : 'jsx'}
        />
      </div>
    </ToolLayout>
  );
}
