'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ToolLayout, CodeOutput, TabSwitcher, SliderInput, ColorPicker } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

interface TextShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
}

const defaultLayer: TextShadowLayer = {
  id: '1',
  x: 0,
  y: 2,
  blur: 4,
  color: '#000000',
  opacity: 30,
};

const presets: { name: string; layers: TextShadowLayer[] }[] = [
  { name: 'Subtle', layers: [{ ...defaultLayer, y: 1, blur: 2, opacity: 20 }] },
  { name: 'Medium', layers: [{ ...defaultLayer, y: 2, blur: 4, opacity: 35 }] },
  { name: 'Strong', layers: [{ ...defaultLayer, y: 4, blur: 8, opacity: 50 }] },
  { name: 'Glow', layers: [{ ...defaultLayer, x: 0, y: 0, blur: 12, color: '#00D9FF', opacity: 80 }] },
  {
    name: 'Layered',
    layers: [
      { ...defaultLayer, id: '1', y: 2, blur: 2, opacity: 25 },
      { ...defaultLayer, id: '2', y: 4, blur: 6, opacity: 15 },
    ],
  },
];

function layerToCss(s: TextShadowLayer): string {
  const r = parseInt(s.color.slice(1, 3), 16);
  const g = parseInt(s.color.slice(3, 5), 16);
  const b = parseInt(s.color.slice(5, 7), 16);
  const a = s.opacity / 100;
  return `${s.x}px ${s.y}px ${s.blur}px rgba(${r},${g},${b},${a})`;
}

export default function TextShadowGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [layers, setLayers] = useState<TextShadowLayer[]>([{ ...defaultLayer }]);
  const [outputTab, setOutputTab] = useState('css');

  const shadowCss = useMemo(
    () => layers.map((s) => layerToCss(s)).join(', '),
    [layers]
  );

  const fullCss = `.element {\n  text-shadow: ${shadowCss};\n}`;

  const tailwindArbitrary = useMemo(() => {
    const value = shadowCss.replace(/\s+/g, '_').replace(/,/g, ', ');
    return `className="[text-shadow:${value}]"`;
  }, [shadowCss]);

  const addLayer = () => {
    setLayers((prev) => [
      ...prev,
      { ...defaultLayer, id: Date.now().toString(), y: (prev.length + 1) * 2 },
    ]);
  };

  const removeLayer = (id: string) => {
    setLayers((prev) => prev.filter((s) => s.id !== id));
  };

  const updateLayer = (id: string, updates: Partial<TextShadowLayer>) => {
    setLayers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const applyPreset = (preset: (typeof presets)[0]) => {
    setLayers(
      preset.layers.map((s, i) => ({ ...s, id: i.toString() }))
    );
  };

  return (
    <ToolLayout
      title="Text Shadow Generator"
      description="Create layered text shadows with CSS and Tailwind export. Perfect for headings and hero text."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="aspect-video bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-center p-3 sm:p-6 md:p-8 min-h-[160px] sm:min-h-[200px]">
            <span
              className="text-xl sm:text-2xl md:text-4xl font-bold text-white text-center break-words max-w-full px-1"
              style={{ textShadow: shadowCss }}
            >
              Preview
            </span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Presets</h3>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs sm:text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 lg:space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-300">Layers</h3>
            <button
              onClick={addLayer}
              className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Layer
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4 max-h-[320px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden pr-0.5 sm:pr-1">
            {layers.map((layer, index) => (
              <div
                key={layer.id}
                className="p-3 sm:p-4 bg-slate-800/40 rounded-lg border border-slate-700/60 space-y-3 sm:space-y-4 min-w-0"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-sm font-medium text-slate-300 truncate">Layer {index + 1}</span>
                  {layers.length > 1 && (
                    <button
                      onClick={() => removeLayer(layer.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 min-w-0">
                  <SliderInput
                    label="X Offset"
                    value={layer.x}
                    min={-50}
                    max={50}
                    unit="px"
                    onChange={(x) => updateLayer(layer.id, { x })}
                  />
                  <SliderInput
                    label="Y Offset"
                    value={layer.y}
                    min={-50}
                    max={50}
                    unit="px"
                    onChange={(y) => updateLayer(layer.id, { y })}
                  />
                  <SliderInput
                    label="Blur"
                    value={layer.blur}
                    min={0}
                    max={50}
                    unit="px"
                    onChange={(blur) => updateLayer(layer.id, { blur })}
                  />
                  <SliderInput
                    label="Opacity"
                    value={layer.opacity}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(opacity) => updateLayer(layer.id, { opacity })}
                  />
                </div>
                <ColorPicker
                  color={layer.color}
                  onChange={(color) => updateLayer(layer.id, { color })}
                  label="Color"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 space-y-4 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-medium text-white">Output</h3>
          <TabSwitcher
            options={[
              { id: 'css', label: 'CSS' },
              { id: 'tailwind', label: 'Tailwind' },
            ]}
            activeTab={outputTab}
            onChange={setOutputTab}
          />
        </div>
        <CodeOutput
          code={
            outputTab === 'css'
              ? fullCss
              : `<span ${tailwindArbitrary}>\n  Your text\n</span>`
          }
          language={outputTab === 'css' ? 'css' : 'html'}
        />
      </div>
    </ToolLayout>
  );
}
