'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ToolLayout,
  ColorPicker,
  CopyButton,
} from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import {
  parseColor,
  toHex,
  toHex8,
  toRgb,
  toRgba,
  toHsl,
  toHsla,
  toCssRgba,
} from '@/lib/tools/color/converter';

const inputStyles =
  'w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-lg text-white font-mono text-sm placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300';

const cardStyles =
  'p-4 sm:p-6 bg-slate-900/60 rounded-xl border border-slate-700/60';

function OutputRow({
  label,
  value,
  disabled,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-slate-700/40 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <code className="text-sm text-slate-200 font-mono truncate max-w-[220px] sm:max-w-none">
          {value}
        </code>
        <CopyButton text={value} className="shrink-0" />
      </div>
    </div>
  );
}

export default function ColorConverterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [inputValue, setInputValue] = useState('#3b82f6');
  const parsed = useMemo(() => parseColor(inputValue), [inputValue]);
  const error = parsed === null && inputValue.trim() !== '';

  const handlePickerChange = useCallback((hex: string) => {
    setInputValue(hex);
  }, []);

  const pickerColor = useMemo(
    () => (parsed ? toHex(parsed) : '#000000'),
    [parsed]
  );

  const outputs = useMemo(() => {
    if (!parsed) return null;
    return {
      hex: toHex(parsed),
      hex8: toHex8(parsed),
      rgb: toRgb(parsed),
      rgba: toRgba(parsed),
      hsl: toHsl(parsed),
      hsla: toHsla(parsed),
    };
  }, [parsed]);

  const cssSnippets = useMemo(() => {
    if (!parsed || !outputs) return null;
    const value = outputs.hex;
    return {
      color: `color: ${value};`,
      backgroundColor: `background-color: ${value};`,
      borderColor: `border-color: ${value};`,
      cssVar: `--color: ${value};`,
      tailwindText: `text-[${value}]`,
      tailwindBg: `bg-[${value}]`,
    };
  }, [parsed, outputs]);

  const previewStyle = useMemo(
    () => ({ backgroundColor: parsed ? toCssRgba(parsed) : 'var(--slate-800)' }),
    [parsed]
  );

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert between HEX, RGB, RGBA, HSL, HSLA and more. Paste any format, see all equivalents and copy CSS snippets."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Input + Preview */}
        <div className={cardStyles}>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Paste or type any color
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="#3b82f6, rgb(59, 130, 246), hsl(217, 91%, 60%)..."
                  className={inputStyles}
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'color-error' : undefined}
                />
                {error && (
                  <p id="color-error" className="text-sm text-red-400">
                    Invalid color. Use HEX, RGB, RGBA, HSL, or HSLA.
                  </p>
                )}
              </div>
              <ColorPicker
                color={pickerColor}
                onChange={handlePickerChange}
                label="Or pick a color"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Preview
              </label>
              <div
                className="rounded-xl border border-slate-700/60 min-h-[140px] flex items-center justify-center p-4"
                style={previewStyle}
              >
                {parsed && (
                  <span className="text-sm font-medium text-white/90 drop-shadow-md">
                    Sample text
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Format outputs */}
        <div className={cardStyles}>
          <h2 className="text-lg font-semibold text-white mb-4">
            All formats
          </h2>
          {outputs ? (
            <div className="space-y-0">
              <OutputRow label="HEX" value={outputs.hex} />
              <OutputRow label="HEX (8-digit with alpha)" value={outputs.hex8} />
              <OutputRow label="RGB" value={outputs.rgb} />
              <OutputRow label="RGBA" value={outputs.rgba} />
              <OutputRow label="HSL" value={outputs.hsl} />
              <OutputRow label="HSLA" value={outputs.hsla} />
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-2">
              Enter or pick a color to see all formats.
            </p>
          )}
        </div>

        {/* CSS export */}
        <div className={cardStyles}>
          <h2 className="text-lg font-semibold text-white mb-4">
            CSS snippets
          </h2>
          {cssSnippets ? (
            <div className="space-y-0">
              <OutputRow label="color" value={cssSnippets.color} />
              <OutputRow
                label="background-color"
                value={cssSnippets.backgroundColor}
              />
              <OutputRow
                label="border-color"
                value={cssSnippets.borderColor}
              />
              <OutputRow label="CSS variable" value={cssSnippets.cssVar} />
              <OutputRow
                label="Tailwind (text)"
                value={cssSnippets.tailwindText}
              />
              <OutputRow
                label="Tailwind (background)"
                value={cssSnippets.tailwindBg}
              />
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-2">
              Enter or pick a color to see CSS snippets.
            </p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
