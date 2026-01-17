'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ToolLayout, CopyButton, SliderInput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('px-to-rem')!;
const category = toolCategories[tool.category];

const commonValues = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

export default function PxToRemPage() {
  const [pxValue, setPxValue] = useState(16);
  const [baseSize, setBaseSize] = useState(16);
  const [mode, setMode] = useState<'px-to-rem' | 'rem-to-px'>('px-to-rem');

  const result = useMemo(() => {
    if (mode === 'px-to-rem') {
      return (pxValue / baseSize).toFixed(4).replace(/\.?0+$/, '');
    }
    return (pxValue * baseSize).toString();
  }, [pxValue, baseSize, mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'px-to-rem' ? 'rem-to-px' : 'px-to-rem'));
  };

  return (
    <ToolLayout
      title="Pixels to REM Converter"
      description="Convert between pixels and REM units with customizable base font size."
      tool={tool}
      category={category}
    >
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Base Size */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <SliderInput
            label="Base Font Size"
            value={baseSize}
            min={10}
            max={24}
            unit="px"
            onChange={setBaseSize}
          />
          <p className="mt-2 text-xs text-slate-500">
            Default browser font size is 16px
          </p>
        </div>

        {/* Converter */}
        <div className="flex items-center gap-4">
          {/* Input */}
          <div className="flex-1 p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
            <label className="block text-sm text-slate-400 mb-2">
              {mode === 'px-to-rem' ? 'Pixels' : 'REM'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pxValue}
                onChange={(e) => setPxValue(Number(e.target.value) || 0)}
                className="
                  flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/60
                  rounded-lg text-white text-2xl font-mono text-center
                  focus:border-cyan-400/50 focus:outline-none
                  transition-all duration-300
                "
              />
              <span className="text-slate-400 text-lg">
                {mode === 'px-to-rem' ? 'px' : 'rem'}
              </span>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={toggleMode}
            className="
              p-4 bg-slate-800/60 border border-slate-700/60
              hover:border-cyan-400/50 rounded-xl
              text-slate-400 hover:text-cyan-300
              transition-all duration-300
            "
            aria-label="Toggle conversion direction"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>

          {/* Output */}
          <div className="flex-1 p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
            <label className="block text-sm text-slate-400 mb-2">
              {mode === 'px-to-rem' ? 'REM' : 'Pixels'}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-2xl font-mono text-center">
                {result}
              </div>
              <span className="text-slate-400 text-lg">
                {mode === 'px-to-rem' ? 'rem' : 'px'}
              </span>
            </div>
            <div className="mt-2 flex justify-end">
              <CopyButton text={`${result}${mode === 'px-to-rem' ? 'rem' : 'px'}`} />
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Quick Reference</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {commonValues.map((px) => (
              <button
                key={px}
                onClick={() => setPxValue(px)}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300
                  ${pxValue === px
                    ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <div className="text-sm font-medium">{px}px</div>
                <div className="text-xs opacity-70">
                  {(px / baseSize).toFixed(3).replace(/\.?0+$/, '')}rem
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tailwind Spacing Scale */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Tailwind Spacing Scale</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-xs">
            {[
              { name: '0.5', px: 2 },
              { name: '1', px: 4 },
              { name: '2', px: 8 },
              { name: '3', px: 12 },
              { name: '4', px: 16 },
              { name: '5', px: 20 },
              { name: '6', px: 24 },
              { name: '8', px: 32 },
              { name: '10', px: 40 },
              { name: '12', px: 48 },
              { name: '16', px: 64 },
              { name: '20', px: 80 },
              { name: '24', px: 96 },
              { name: '32', px: 128 },
              { name: '40', px: 160 },
              { name: '48', px: 192 },
            ].map((item) => (
              <div
                key={item.name}
                className="p-2 bg-slate-800/60 rounded text-center text-slate-400"
              >
                <div className="font-medium">{item.name}</div>
                <div className="opacity-70">{item.px}px</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
