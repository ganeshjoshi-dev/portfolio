'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput, ColorPicker, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('tailwind-colors')!;
const category = toolCategories[tool.category];

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateShades(baseColor: string): Record<string, string> {
  const hsl = hexToHsl(baseColor);
  
  // Tailwind-style shade generation
  const shades: Record<string, string> = {};
  const levels = [
    { name: '50', lightness: 97 },
    { name: '100', lightness: 94 },
    { name: '200', lightness: 86 },
    { name: '300', lightness: 77 },
    { name: '400', lightness: 66 },
    { name: '500', lightness: 55 },
    { name: '600', lightness: 45 },
    { name: '700', lightness: 35 },
    { name: '800', lightness: 25 },
    { name: '900', lightness: 18 },
    { name: '950', lightness: 10 },
  ];

  // Adjust saturation based on lightness for more natural look
  levels.forEach(({ name, lightness }) => {
    let adjustedSat = hsl.s;
    if (lightness > 80) adjustedSat = Math.max(hsl.s * 0.8, 10);
    if (lightness < 30) adjustedSat = Math.min(hsl.s * 1.1, 100);
    
    shades[name] = hslToHex(hsl.h, adjustedSat, lightness);
  });

  return shades;
}

export default function TailwindColorsPage() {
  const [baseColor, setBaseColor] = useState('#00D9FF');
  const [colorName, setColorName] = useState('primary');

  const shades = useMemo(() => generateShades(baseColor), [baseColor]);

  const tailwindConfig = useMemo(() => {
    const shadesFormatted = Object.entries(shades)
      .map(([key, value]) => `        ${key}: '${value}',`)
      .join('\n');

    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${colorName}': {
${shadesFormatted}
        },
      },
    },
  },
};`;
  }, [shades, colorName]);

  const cssVariables = useMemo(() => {
    return `:root {\n${Object.entries(shades)
      .map(([key, value]) => `  --${colorName}-${key}: ${value};`)
      .join('\n')}\n}`;
  }, [shades, colorName]);

  return (
    <ToolLayout
      title="Tailwind Color Shades"
      description="Generate a full Tailwind-style color scale (50-950) from any base color."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Base Color</label>
            <ColorPicker color={baseColor} onChange={setBaseColor} />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Color Name</label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="primary"
              className="
                w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60
                rounded-lg text-white
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>

          {/* Color Preview Strip */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Preview</label>
            <div className="flex rounded-xl overflow-hidden">
              {Object.entries(shades).map(([key, value]) => (
                <div
                  key={key}
                  className="flex-1 h-12 transition-all duration-300 hover:flex-[2] group relative"
                  style={{ backgroundColor: value }}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: parseInt(key) >= 500 ? '#fff' : '#000' }}
                  >
                    {key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shade Cards */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Generated Shades</label>
          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {Object.entries(shades).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-700/60 group"
              >
                <div
                  className="w-12 h-12 rounded-lg border border-slate-700/60"
                  style={{ backgroundColor: value }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{key}</div>
                  <div className="text-xs font-mono text-slate-400">{value}</div>
                </div>
                <CopyButton text={value} className="opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">Tailwind Config</h3>
          <CodeOutput code={tailwindConfig} language="javascript" />
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">CSS Variables</h3>
          <CodeOutput code={cssVariables} language="css" />
        </div>
      </div>
    </ToolLayout>
  );
}
