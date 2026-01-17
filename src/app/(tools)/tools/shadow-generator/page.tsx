'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ToolLayout, CodeOutput, TabSwitcher, SliderInput, ColorPicker } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('shadow-generator')!;
const category = toolCategories[tool.category];

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

const defaultShadow: ShadowLayer = {
  id: '1',
  x: 0,
  y: 4,
  blur: 6,
  spread: -1,
  color: '#000000',
  opacity: 10,
  inset: false,
};

const presets = [
  { name: 'Subtle', shadows: [{ ...defaultShadow, y: 1, blur: 2, spread: 0, opacity: 5 }] },
  { name: 'Medium', shadows: [{ ...defaultShadow, y: 4, blur: 6, spread: -1, opacity: 10 }] },
  { name: 'Large', shadows: [{ ...defaultShadow, y: 10, blur: 15, spread: -3, opacity: 10 }, { ...defaultShadow, id: '2', y: 4, blur: 6, spread: -2, opacity: 10 }] },
  { name: 'Glow', shadows: [{ ...defaultShadow, x: 0, y: 0, blur: 20, spread: 0, color: '#00D9FF', opacity: 50 }] },
];

export default function ShadowGeneratorPage() {
  const [shadows, setShadows] = useState<ShadowLayer[]>([{ ...defaultShadow }]);
  const [outputTab, setOutputTab] = useState('css');

  const shadowCSS = useMemo(() => {
    return shadows
      .map((s) => {
        const rgba = `rgba(${parseInt(s.color.slice(1, 3), 16)}, ${parseInt(s.color.slice(3, 5), 16)}, ${parseInt(s.color.slice(5, 7), 16)}, ${s.opacity / 100})`;
        return `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
      })
      .join(',\n    ');
  }, [shadows]);

  const fullCSS = `.element {\n  box-shadow: ${shadowCSS};\n}`;

  const tailwindClass = useMemo(() => {
    if (shadows.length === 1) {
      const s = shadows[0];
      if (s.x === 0 && s.y === 1 && s.blur === 2 && s.spread === 0) return 'shadow-sm';
      if (s.x === 0 && s.y === 1 && s.blur === 3 && s.spread === 0) return 'shadow';
      if (s.x === 0 && s.y === 4 && s.blur === 6) return 'shadow-md';
      if (s.x === 0 && s.y === 10 && s.blur === 15) return 'shadow-lg';
      if (s.x === 0 && s.y === 20 && s.blur === 25) return 'shadow-xl';
      if (s.x === 0 && s.y === 25 && s.blur === 50) return 'shadow-2xl';
    }
    return `shadow-[${shadowCSS.replace(/\n\s*/g, '_').replace(/,_/g, ',')}]`;
  }, [shadows, shadowCSS]);

  const addLayer = () => {
    setShadows((prev) => [
      ...prev,
      { ...defaultShadow, id: Date.now().toString(), y: prev.length * 4 + 4 },
    ]);
  };

  const removeLayer = (id: string) => {
    setShadows((prev) => prev.filter((s) => s.id !== id));
  };

  const updateLayer = (id: string, updates: Partial<ShadowLayer>) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setShadows(preset.shadows.map((s, i) => ({ ...s, id: i.toString() })));
  };

  return (
    <ToolLayout
      title="Shadow Generator"
      description="Create beautiful layered box shadows with CSS and Tailwind output."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-6">
          <div className="aspect-video bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-center p-8">
            <div
              className="w-48 h-32 bg-slate-700 rounded-xl transition-shadow duration-300"
              style={{ boxShadow: shadowCSS }}
            />
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Presets</h3>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Shadow Layers</h3>
            <button
              onClick={addLayer}
              className="flex items-center gap-1 px-3 py-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Layer
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {shadows.map((shadow, index) => (
              <div
                key={shadow.id}
                className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Layer {index + 1}</span>
                  {shadows.length > 1 && (
                    <button
                      onClick={() => removeLayer(shadow.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SliderInput label="X Offset" value={shadow.x} min={-50} max={50} unit="px" onChange={(x) => updateLayer(shadow.id, { x })} />
                  <SliderInput label="Y Offset" value={shadow.y} min={-50} max={50} unit="px" onChange={(y) => updateLayer(shadow.id, { y })} />
                  <SliderInput label="Blur" value={shadow.blur} min={0} max={100} unit="px" onChange={(blur) => updateLayer(shadow.id, { blur })} />
                  <SliderInput label="Spread" value={shadow.spread} min={-50} max={50} unit="px" onChange={(spread) => updateLayer(shadow.id, { spread })} />
                </div>

                <div className="flex items-center gap-4">
                  <ColorPicker color={shadow.color} onChange={(color) => updateLayer(shadow.id, { color })} label="Color" />
                  <SliderInput label="Opacity" value={shadow.opacity} min={0} max={100} unit="%" onChange={(opacity) => updateLayer(shadow.id, { opacity })} />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={shadow.inset}
                    onChange={(e) => updateLayer(shadow.id, { inset: e.target.checked })}
                    className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
                  />
                  Inset Shadow
                </label>
              </div>
            ))}
          </div>
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
