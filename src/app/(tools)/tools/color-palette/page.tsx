'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shuffle, Lock, Unlock } from 'lucide-react';
import { ToolLayout, CodeOutput, ColorPicker, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('color-palette')!;
const category = toolCategories[tool.category];
import {
  HarmonyType,
  colorHarmonies,
  generateHarmony,
  generateTailwindConfig,
  hexToHsl,
} from '@/lib/tools/color';

function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export default function ColorPalettePage() {
  const [baseColor, setBaseColor] = useState('#00D9FF');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());

  const paletteColors = useMemo(() => {
    return generateHarmony(baseColor, harmonyType);
  }, [baseColor, harmonyType]);

  const tailwindConfig = useMemo(() => {
    return generateTailwindConfig(paletteColors, 'palette');
  }, [paletteColors]);

  const toggleLock = useCallback((index: number) => {
    setLockedColors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  const randomize = useCallback(() => {
    if (!lockedColors.has(0)) {
      setBaseColor(generateRandomColor());
    }
  }, [lockedColors]);

  const getContrastColor = (hex: string): string => {
    const hsl = hexToHsl(hex);
    return hsl.l > 50 ? '#000000' : '#ffffff';
  };

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Generate harmonious color palettes based on color theory. Export to Tailwind CSS config."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Base Color */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Base Color</h3>
            <ColorPicker
              color={baseColor}
              onChange={setBaseColor}
            />
          </div>

          {/* Harmony Type */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Color Harmony</h3>
            <div className="space-y-2">
              {colorHarmonies.map((harmony) => (
                <button
                  key={harmony.id}
                  onClick={() => setHarmonyType(harmony.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg transition-all duration-300
                    ${
                      harmonyType === harmony.id
                        ? 'bg-cyan-400/20 border border-cyan-400/50 text-white'
                        : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }
                  `}
                >
                  <div className="font-medium">{harmony.name}</div>
                  <div className="text-xs opacity-70">{harmony.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={randomize}
            className="
              w-full flex items-center justify-center gap-2 px-4 py-3
              bg-slate-800/60 border border-slate-700/60
              hover:border-cyan-400/50 rounded-lg text-slate-300
              hover:text-cyan-300 transition-all duration-300
            "
          >
            <Shuffle className="w-4 h-4" />
            Randomize Base Color
          </button>
        </div>

        {/* Palette Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Color Swatches */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Generated Palette</h3>
            <div className="grid gap-3">
              {paletteColors.map((color, index) => (
                <div
                  key={index}
                  className="
                    group flex items-center rounded-xl overflow-hidden
                    border border-slate-700/60 hover:border-cyan-400/50
                    transition-all duration-300
                  "
                >
                  {/* Color Swatch */}
                  <div
                    className="w-24 h-20 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <button
                      onClick={() => toggleLock(index)}
                      className="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: getContrastColor(color) }}
                    >
                      {lockedColors.has(index) ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Color Info */}
                  <div className="flex-1 px-4 py-3 bg-slate-900/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-white">{color.toUpperCase()}</div>
                        <div className="text-xs text-slate-500">
                          HSL: {hexToHsl(color).h}°, {hexToHsl(color).s}%, {hexToHsl(color).l}%
                        </div>
                      </div>
                      <CopyButton text={color} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Palette Strip */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Palette Strip</h3>
            <div className="h-16 rounded-xl overflow-hidden flex">
              {paletteColors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 transition-all duration-300 hover:flex-[2]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* CSS Variables */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">CSS Variables</h3>
            <CodeOutput
              code={`:root {\n${paletteColors
                .map((color, i) => `  --color-${i + 1}: ${color};`)
                .join('\n')}\n}`}
              language="css"
            />
          </div>
        </div>
      </div>

      {/* Tailwind Config */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-white">Tailwind CSS Config</h3>
        <CodeOutput code={tailwindConfig} language="javascript" />
      </div>
    </ToolLayout>
  );
}
