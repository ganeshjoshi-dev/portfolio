'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('css-unit-converter')!;
const category = toolCategories[tool.category];

type Unit = 'px' | 'rem' | 'em' | 'pt' | 'cm' | 'mm' | 'in' | 'pc' | 'vh' | 'vw' | '%';

const units: { value: Unit; label: string; description: string }[] = [
  { value: 'px', label: 'px', description: 'Pixels' },
  { value: 'rem', label: 'rem', description: 'Root EM' },
  { value: 'em', label: 'em', description: 'Relative to font-size' },
  { value: 'pt', label: 'pt', description: 'Points (1/72 inch)' },
  { value: 'cm', label: 'cm', description: 'Centimeters' },
  { value: 'mm', label: 'mm', description: 'Millimeters' },
  { value: 'in', label: 'in', description: 'Inches' },
  { value: 'pc', label: 'pc', description: 'Picas (12 points)' },
  { value: 'vh', label: 'vh', description: 'Viewport Height' },
  { value: 'vw', label: 'vw', description: 'Viewport Width' },
  { value: '%', label: '%', description: 'Percentage' },
];

const commonValues = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

// Conversion factors (all relative to pixels)
const conversionFactors: Record<Unit, number> = {
  px: 1,
  rem: 16, // Default base size
  em: 16, // Default base size
  pt: 1.333333, // 1pt = 1.333px
  cm: 37.795276, // 1cm = 37.795px
  mm: 3.7795276, // 1mm = 3.78px
  in: 96, // 1in = 96px
  pc: 16, // 1pc = 16px
  vh: 1, // Depends on viewport, using 1:1 for calculation
  vw: 1, // Depends on viewport, using 1:1 for calculation
  '%': 1, // Relative, using 1:1 for calculation
};

export default function PxToRemPage() {
  const [inputValue, setInputValue] = useState('16');
  const [inputUnit, setInputUnit] = useState<Unit>('px');
  const [outputUnit, setOutputUnit] = useState<Unit>('rem');
  const [baseSize, setBaseSize] = useState('16');

  const result = useMemo(() => {
    const input = parseFloat(inputValue) || 0;
    const base = parseFloat(baseSize) || 16;

    // Update conversion factors for rem/em based on base size
    const factors = { ...conversionFactors, rem: base, em: base };

    // Convert input to pixels first
    const inPixels = input * factors[inputUnit];
    
    // Convert pixels to output unit
    const output = inPixels / factors[outputUnit];
    
    // Format the result
    return output.toFixed(6).replace(/\.?0+$/, '');
  }, [inputValue, inputUnit, outputUnit, baseSize]);

  const swapUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
    setInputValue(result);
  };

  const showBaseSize = inputUnit === 'rem' || inputUnit === 'em' || outputUnit === 'rem' || outputUnit === 'em';

  return (
    <ToolLayout
      title="CSS Unit Converter"
      description="Convert between CSS units: px, rem, em, pt, cm, mm, in, pc, vh, vw, and %."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Converter */}
        <div className="space-y-4">
          {/* Base Size Configuration - Compact inline version */}
          {showBaseSize && (
            <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-lg border border-slate-700/60">
              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-400 whitespace-nowrap">
                  Base Font Size:
                </label>
                <input
                  type="number"
                  value={baseSize}
                  onChange={(e) => setBaseSize(e.target.value)}
                  className="
                    w-20 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white font-mono text-sm
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300
                  "
                  min="1"
                  step="0.1"
                />
                <span className="text-slate-400 text-sm">px</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Default: 16px
              </p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-stretch gap-4">
            {/* Input */}
            <div className="flex-1 p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <label className="block text-sm text-slate-400 mb-3">From</label>
              <div className="space-y-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="
                    w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white text-2xl font-mono text-center
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300
                  "
                  placeholder="Enter value"
                  step="any"
                />
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as Unit)}
                  className="
                    w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white font-medium
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300 cursor-pointer
                  "
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label} - {unit.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex lg:items-center justify-center">
              <button
                onClick={swapUnits}
                className="
                  p-4 bg-slate-800/60 border border-slate-700/60
                  hover:border-cyan-400/50 rounded-xl
                  text-slate-400 hover:text-cyan-300
                  transition-all duration-300
                  lg:rotate-0 rotate-90
                "
                aria-label="Swap units"
              >
                <ArrowRightLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Output */}
            <div className="flex-1 p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
              <label className="block text-sm text-slate-400 mb-3">To</label>
              <div className="space-y-3">
                <div className="px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-2xl font-mono text-center min-h-[52px] flex items-center justify-center">
                  {result}
                </div>
                <select
                  value={outputUnit}
                  onChange={(e) => setOutputUnit(e.target.value as Unit)}
                  className="
                    w-full px-4 py-2 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white font-medium
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300 cursor-pointer
                  "
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label} - {unit.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex justify-end">
                <CopyButton text={`${result}${outputUnit}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Quick Reference (px to {outputUnit})
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {commonValues.map((px) => {
              const base = parseFloat(baseSize) || 16;
              const factors = { ...conversionFactors, rem: base, em: base };
              const converted = (px / factors[outputUnit]).toFixed(4).replace(/\.?0+$/, '');
              
              return (
                <button
                  key={px}
                  onClick={() => {
                    setInputValue(px.toString());
                    setInputUnit('px');
                  }}
                  className="
                    p-3 rounded-lg text-center transition-all duration-300
                    bg-slate-800/60 border border-slate-700/60 text-slate-400 
                    hover:border-cyan-400/50 hover:text-cyan-300
                  "
                >
                  <div className="text-sm font-medium">{px}px</div>
                  <div className="text-xs opacity-70">
                    {converted}{outputUnit}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversion Table */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">
            Common Unit Conversions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/60">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Unit</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Equals (in px)</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1px</td>
                  <td className="py-2 px-3">1px</td>
                  <td className="py-2 px-3 text-slate-400">Pixel (absolute)</td>
                </tr>
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1rem</td>
                  <td className="py-2 px-3">{baseSize}px</td>
                  <td className="py-2 px-3 text-slate-400">Root element font-size</td>
                </tr>
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1em</td>
                  <td className="py-2 px-3">{baseSize}px</td>
                  <td className="py-2 px-3 text-slate-400">Parent element font-size</td>
                </tr>
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1pt</td>
                  <td className="py-2 px-3">1.33px</td>
                  <td className="py-2 px-3 text-slate-400">Point (1/72 inch)</td>
                </tr>
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1in</td>
                  <td className="py-2 px-3">96px</td>
                  <td className="py-2 px-3 text-slate-400">Inch</td>
                </tr>
                <tr className="border-b border-slate-700/30">
                  <td className="py-2 px-3 font-mono">1cm</td>
                  <td className="py-2 px-3">37.8px</td>
                  <td className="py-2 px-3 text-slate-400">Centimeter</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono">1vh/vw</td>
                  <td className="py-2 px-3">Varies</td>
                  <td className="py-2 px-3 text-slate-400">1% of viewport height/width</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
