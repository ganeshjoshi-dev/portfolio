'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, RotateCcw, Shuffle } from 'lucide-react';
import { ToolLayout, CodeOutput, TabSwitcher, SliderInput, ColorPicker } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import {
  GradientConfig,
  GradientType,
  ColorStop,
  defaultColorStops,
  gradientPresets,
  generateCSSGradient,
  generateTailwindGradient,
  generateFullCSS,
  createColorStop,
  generateRandomColor,
} from '@/lib/tools/gradient';

// Get tool config for structured data
const tool = getToolById('gradient-generator')!;
const category = toolCategories[tool.category];

const gradientTypes: { id: GradientType; label: string }[] = [
  { id: 'linear', label: 'Linear' },
  { id: 'radial', label: 'Radial' },
  { id: 'conic', label: 'Conic' },
];

const outputTabs = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
];

export default function GradientGeneratorPage() {
  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 135,
    colorStops: defaultColorStops,
  });
  const [outputTab, setOutputTab] = useState('css');

  const gradientCSS = generateCSSGradient(config);
  const tailwindClass = generateTailwindGradient(config);
  const fullCSS = generateFullCSS(config);

  const updateConfig = useCallback((updates: Partial<GradientConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const addColorStop = useCallback(() => {
    const newPosition = 50;
    const newColor = generateRandomColor();
    const newStop = createColorStop(newColor, newPosition);
    
    setConfig((prev) => ({
      ...prev,
      colorStops: [...prev.colorStops, newStop].sort((a, b) => a.position - b.position),
    }));
  }, []);

  const removeColorStop = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      colorStops: prev.colorStops.filter((stop) => stop.id !== id),
    }));
  }, []);

  const updateColorStop = useCallback((id: string, updates: Partial<ColorStop>) => {
    setConfig((prev) => ({
      ...prev,
      colorStops: prev.colorStops.map((stop) =>
        stop.id === id ? { ...stop, ...updates } : stop
      ),
    }));
  }, []);

  const applyPreset = useCallback((preset: typeof gradientPresets[0]) => {
    setConfig(preset.config);
  }, []);

  const randomize = useCallback(() => {
    const numStops = Math.floor(Math.random() * 2) + 2;
    const newStops: ColorStop[] = [];
    
    for (let i = 0; i < numStops; i++) {
      newStops.push(createColorStop(
        generateRandomColor(),
        Math.round((i / (numStops - 1)) * 100)
      ));
    }
    
    setConfig({
      type: 'linear',
      angle: Math.floor(Math.random() * 360),
      colorStops: newStops,
    });
  }, []);

  const reset = useCallback(() => {
    setConfig({
      type: 'linear',
      angle: 135,
      colorStops: defaultColorStops,
    });
  }, []);

  return (
    <ToolLayout
      title="Gradient Generator"
      description="Create beautiful CSS gradients with live preview. Export to CSS or Tailwind classes."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Gradient Preview */}
          <div
            className="aspect-video rounded-xl border border-slate-700/60 overflow-hidden"
            style={{ background: gradientCSS }}
          />

          {/* Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Presets</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="
                    aspect-square rounded-lg border border-slate-700/60
                    hover:border-cyan-400/50 transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                  "
                  style={{ background: generateCSSGradient(preset.config) }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={randomize}
              className="
                flex items-center gap-2 px-4 py-2
                bg-slate-800/60 border border-slate-700/60
                hover:border-cyan-400/50 rounded-lg text-sm text-slate-300
                hover:text-cyan-300 transition-all duration-300
              "
            >
              <Shuffle className="w-4 h-4" />
              Randomize
            </button>
            <button
              onClick={reset}
              className="
                flex items-center gap-2 px-4 py-2
                bg-slate-800/60 border border-slate-700/60
                hover:border-slate-600 rounded-lg text-sm text-slate-400
                hover:text-slate-300 transition-all duration-300
              "
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Gradient Type */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Gradient Type</h3>
            <div className="flex gap-2">
              {gradientTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateConfig({ type: type.id })}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${
                      config.type === type.id
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:border-slate-600'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Angle (for linear and conic) */}
          {(config.type === 'linear' || config.type === 'conic') && (
            <SliderInput
              label="Angle"
              value={config.angle}
              min={0}
              max={360}
              unit="°"
              onChange={(angle) => updateConfig({ angle })}
            />
          )}

          {/* Color Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Color Stops</h3>
              <button
                onClick={addColorStop}
                className="
                  flex items-center gap-1 px-3 py-1 text-sm
                  text-cyan-400 hover:text-cyan-300 transition-colors
                "
              >
                <Plus className="w-4 h-4" />
                Add Stop
              </button>
            </div>

            <div className="space-y-3">
              {config.colorStops.map((stop) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/60"
                >
                  <ColorPicker
                    color={stop.color}
                    onChange={(color) => updateColorStop(stop.id, { color })}
                  />
                  <div className="flex-1">
                    <SliderInput
                      label="Position"
                      value={stop.position}
                      min={0}
                      max={100}
                      unit="%"
                      onChange={(position) => updateColorStop(stop.id, { position })}
                    />
                  </div>
                  {config.colorStops.length > 2 && (
                    <button
                      onClick={() => removeColorStop(stop.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      aria-label="Remove color stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Output</h3>
          <TabSwitcher
            options={outputTabs}
            activeTab={outputTab}
            onChange={setOutputTab}
          />
        </div>

        {outputTab === 'css' ? (
          <CodeOutput code={fullCSS} language="css" />
        ) : (
          <CodeOutput
            code={`<div className="${tailwindClass}">\n  {/* Your content */}\n</div>`}
            language="jsx"
            title="Tailwind CSS"
          />
        )}
      </div>
    </ToolLayout>
  );
}
