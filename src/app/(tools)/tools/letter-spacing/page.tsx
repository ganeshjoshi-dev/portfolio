'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('letter-spacing')!;
const category = toolCategories[tool.category];

const commonFontSizes = [12, 14, 16, 18, 20, 24, 32, 48];
const commonLetterSpacing = [-5, -2, 0, 2, 5, 10];

type Unit = 'px' | 'em' | 'rem' | 'ch' | 'vw' | 'vh';

// Convert value to the selected unit
const convertToUnit = (pxValue: number, targetUnit: Unit, fontSize: number): number => {
  switch (targetUnit) {
    case 'px':
      return pxValue;
    case 'em':
    case 'rem':
      return pxValue / fontSize;
    case 'ch':
      // Approximate: 1ch ≈ 0.5em for monospace, 0.5 * fontSize
      return pxValue / (fontSize * 0.5);
    case 'vw':
      // Approximate: assuming 1vw = 1% of viewport width (typically ~1920px / 100 = 19.2px)
      return pxValue / 19.2;
    case 'vh':
      // Approximate: assuming 1vh = 1% of viewport height (typically ~1080px / 100 = 10.8px)
      return pxValue / 10.8;
    default:
      return pxValue;
  }
};

const formatValue = (value: number): string => {
  return value.toFixed(4).replace(/\.?0+$/, '');
};

export default function LetterSpacingPage() {
  const [fontSize, setFontSize] = useState(16);
  const [letterSpacingPercent, setLetterSpacingPercent] = useState(0);
  const [mode, setMode] = useState<'percent-to-px' | 'px-to-percent'>('percent-to-px');
  const [pxValue, setPxValue] = useState(0);
  const [unit, setUnit] = useState<Unit>('px');

  const calculatedPx = useMemo(() => {
    if (mode === 'percent-to-px') {
      return (fontSize * letterSpacingPercent) / 100;
    }
    return pxValue;
  }, [fontSize, letterSpacingPercent, pxValue, mode]);

  const result = useMemo(() => {
    if (mode === 'percent-to-px') {
      const pxResult = (fontSize * letterSpacingPercent) / 100;
      return formatValue(convertToUnit(pxResult, unit, fontSize));
    } else {
      // px to percent
      if (fontSize === 0) return '0';
      const result = (pxValue / fontSize) * 100;
      return result.toFixed(2).replace(/\.?0+$/, '');
    }
  }, [fontSize, letterSpacingPercent, pxValue, mode, unit]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'percent-to-px' ? 'px-to-percent' : 'percent-to-px'));
    if (mode === 'percent-to-px') {
      // When switching to px-to-percent, set pxValue to current calculated value
      setPxValue((fontSize * letterSpacingPercent) / 100);
    } else {
      // When switching to percent-to-px, set percent to current calculated value
      if (fontSize > 0) {
        setLetterSpacingPercent((pxValue / fontSize) * 100);
      }
    }
  };

  const cssOutput = `letter-spacing: ${formatValue(convertToUnit(calculatedPx, unit, fontSize))}${unit};`;

  return (
    <ToolLayout
      title="Letter Spacing Calculator"
      description="Convert between percentage and CSS unit values for letter-spacing. Supports px, em, rem, ch, vw, and vh units."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Font Size & Output Unit */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Font Size */}
            <div>
              <label className="block text-sm text-slate-400 mb-3">Font Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formatValue(convertToUnit(fontSize, unit, fontSize))}
                  onChange={(e) => {
                    const inputValue = Number(e.target.value) || 1;
                    // Convert back to px for internal storage
                    let pxValue = inputValue;
                    switch (unit) {
                      case 'px':
                        pxValue = inputValue;
                        break;
                      case 'em':
                      case 'rem':
                        pxValue = inputValue * 16; // Assuming 16px base
                        break;
                      case 'ch':
                        pxValue = inputValue * 16 * 0.5;
                        break;
                      case 'vw':
                        pxValue = inputValue * 19.2;
                        break;
                      case 'vh':
                        pxValue = inputValue * 10.8;
                        break;
                    }
                    setFontSize(Math.max(1, pxValue));
                  }}
                  min={0.1}
                  step={unit === 'px' ? '1' : '0.1'}
                  className="
                    flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white text-xl font-mono text-center
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300
                  "
                />
                <span className="text-slate-400 text-lg">{unit}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                The font size used in your design
              </p>
            </div>

            {/* Output Unit */}
            <div>
              <label className="block text-sm text-slate-400 mb-3">Output Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                className="
                  w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60
                  rounded-lg text-white text-base
                  focus:border-cyan-400/50 focus:outline-none
                  transition-all duration-300
                "
              >
                <option value="px">Pixels (px)</option>
                <option value="em">Em (em) - Relative to font size</option>
                <option value="rem">Rem (rem) - Relative to root font size</option>
                <option value="ch">Character (ch) - Relative to character width</option>
                <option value="vw">Viewport Width (vw)</option>
                <option value="vh">Viewport Height (vh)</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Applied to all values in the tool
              </p>
            </div>
          </div>
        </div>

        {/* Converter */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Input */}
          <div className="flex-1 w-full p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
            <label className="block text-sm text-slate-400 mb-3">
              {mode === 'percent-to-px' ? 'Letter Spacing (%)' : 'Letter Spacing (px)'}
            </label>
            {mode === 'percent-to-px' ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={letterSpacingPercent}
                  onChange={(e) => setLetterSpacingPercent(Number(e.target.value) || 0)}
                  step="0.1"
                  className="
                    flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white text-xl font-mono text-center
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300
                  "
                />
                <span className="text-slate-400 text-lg">%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pxValue}
                  onChange={(e) => setPxValue(Number(e.target.value) || 0)}
                  step="0.01"
                  className="
                    flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/60
                    rounded-lg text-white text-xl font-mono text-center
                    focus:border-cyan-400/50 focus:outline-none
                    transition-all duration-300
                  "
                />
                <span className="text-slate-400 text-lg">px</span>
              </div>
            )}
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
          <div className="flex-1 w-full p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
            <label className="block text-sm text-slate-400 mb-3">
              {mode === 'percent-to-px' ? `Letter Spacing (${unit})` : 'Letter Spacing (%)'}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-cyan-300 text-xl font-mono text-center">
                {result}
              </div>
              <span className="text-slate-400 text-lg">
                {mode === 'percent-to-px' ? unit : '%'}
              </span>
            </div>
          </div>
        </div>

        {/* CSS Output */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-300">CSS Output</h3>
            <CopyButton text={cssOutput} />
          </div>
          <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/60">
            <code className="text-cyan-300 font-mono text-sm">{cssOutput}</code>
          </div>
        </div>

        {/* Live Preview */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Live Preview</h3>
          <div
            className="
              p-6 bg-slate-800/40 rounded-lg border border-slate-700/40
              text-white text-center
            "
            style={{
              fontSize: `${fontSize}px`,
              letterSpacing: `${calculatedPx}px`,
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <p className="mt-2 text-xs text-slate-500 text-center">
            Font size: {fontSize}px • Letter spacing: {formatValue(convertToUnit(calculatedPx, unit, fontSize))}{unit}
          </p>
        </div>

        {/* Quick Reference - Font Sizes */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Quick Reference - Font Sizes</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {commonFontSizes.map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300
                  ${fontSize === size
                    ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <div className="text-sm font-medium">{size}px</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Reference - Letter Spacing Presets */}
        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <h3 className="text-sm font-medium text-slate-300 mb-4">Quick Reference - Letter Spacing</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {commonLetterSpacing.map((spacing) => (
              <button
                key={spacing}
                onClick={() => {
                  setLetterSpacingPercent(spacing);
                  setMode('percent-to-px');
                }}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300
                  ${letterSpacingPercent === spacing && mode === 'percent-to-px'
                    ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }
                `}
              >
                <div className="text-sm font-medium">{spacing > 0 ? `+${spacing}%` : `${spacing}%`}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatValue(convertToUnit((fontSize * spacing) / 100, unit, fontSize))}{unit}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
