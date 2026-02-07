'use client';

import { useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { ToolLayout, CodeOutput, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type LayoutType = 'flex' | 'grid';

const flexDirections = [
  { value: 'row', label: 'Row', css: 'row', tailwind: 'flex-row' },
  { value: 'row-reverse', label: 'Row Reverse', css: 'row-reverse', tailwind: 'flex-row-reverse' },
  { value: 'column', label: 'Column', css: 'column', tailwind: 'flex-col' },
  { value: 'column-reverse', label: 'Column Reverse', css: 'column-reverse', tailwind: 'flex-col-reverse' },
];

const justifyOptions = [
  { value: 'flex-start', label: 'Start', tailwind: 'justify-start' },
  { value: 'center', label: 'Center', tailwind: 'justify-center' },
  { value: 'flex-end', label: 'End', tailwind: 'justify-end' },
  { value: 'space-between', label: 'Between', tailwind: 'justify-between' },
  { value: 'space-around', label: 'Around', tailwind: 'justify-around' },
  { value: 'space-evenly', label: 'Evenly', tailwind: 'justify-evenly' },
];

const alignOptions = [
  { value: 'flex-start', label: 'Start', tailwind: 'items-start' },
  { value: 'center', label: 'Center', tailwind: 'items-center' },
  { value: 'flex-end', label: 'End', tailwind: 'items-end' },
  { value: 'stretch', label: 'Stretch', tailwind: 'items-stretch' },
  { value: 'baseline', label: 'Baseline', tailwind: 'items-baseline' },
];

const wrapOptions = [
  { value: 'nowrap', label: 'No Wrap', tailwind: 'flex-nowrap' },
  { value: 'wrap', label: 'Wrap', tailwind: 'flex-wrap' },
  { value: 'wrap-reverse', label: 'Wrap Reverse', tailwind: 'flex-wrap-reverse' },
];

const gapValues = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24];
const gridColsOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12];
const gridRowsOptions = [1, 2, 3, 4, 5, 6];

export default function FlexboxGridGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [layoutType, setLayoutType] = useState<LayoutType>('flex');
  const [outputTab, setOutputTab] = useState<'css' | 'tailwind'>('css');

  const [flexDirection, setFlexDirection] = useState(0);
  const [justify, setJustify] = useState(0);
  const [align, setAlign] = useState(1);
  const [wrap, setWrap] = useState(1);
  const [gap, setGap] = useState(4);

  const [gridCols, setGridCols] = useState(3);
  const [gridRows, setGridRows] = useState(2);

  const containerStyle = useMemo((): CSSProperties => {
    if (layoutType === 'flex') {
      const dir = flexDirections[flexDirection];
      const j = justifyOptions[justify];
      const a = alignOptions[align];
      const w = wrapOptions[wrap];
      const g = gapValues[gap];
      return {
        display: 'flex',
        flexDirection: (dir?.css ?? 'row') as CSSProperties['flexDirection'],
        justifyContent: (j?.value ?? 'flex-start') as CSSProperties['justifyContent'],
        alignItems: (a?.value ?? 'stretch') as CSSProperties['alignItems'],
        flexWrap: (w?.value ?? 'wrap') as CSSProperties['flexWrap'],
        gap: g ? `${g * 4}px` : '0',
      };
    }
    const g = gapValues[gap];
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
      gap: g ? `${g * 4}px` : '0',
      justifyContent: justifyOptions[justify].value as CSSProperties['justifyContent'],
      alignItems: alignOptions[align].value as CSSProperties['alignItems'],
    };
  }, [layoutType, flexDirection, justify, align, wrap, gap, gridCols, gridRows]);

  const cssCode = useMemo(() => {
    const lines: string[] = [];
    if (layoutType === 'flex') {
      lines.push('display: flex;');
      lines.push(`flex-direction: ${flexDirections[flexDirection]?.css ?? 'row'};`);
      lines.push(`justify-content: ${justifyOptions[justify]?.value ?? 'flex-start'};`);
      lines.push(`align-items: ${alignOptions[align]?.value ?? 'stretch'};`);
      lines.push(`flex-wrap: ${wrapOptions[wrap]?.value ?? 'wrap'};`);
      if (gapValues[gap] > 0) lines.push(`gap: ${gapValues[gap] * 4}px;`);
    } else {
      lines.push('display: grid;');
      lines.push(`grid-template-columns: repeat(${gridCols}, minmax(0, 1fr));`);
      lines.push(`grid-template-rows: repeat(${gridRows}, minmax(0, 1fr));`);
      if (gapValues[gap] > 0) lines.push(`gap: ${gapValues[gap] * 4}px;`);
      lines.push(`justify-content: ${justifyOptions[justify].value};`);
      lines.push(`align-items: ${alignOptions[align].value};`);
    }
    return `.container {\n  ${lines.join('\n  ')}\n}`;
  }, [layoutType, flexDirection, justify, align, wrap, gap, gridCols, gridRows]);

  const tailwindClasses = useMemo(() => {
    if (layoutType === 'flex') {
      const parts = [
        'flex',
        flexDirections[flexDirection]?.tailwind ?? 'flex-row',
        justifyOptions[justify]?.tailwind ?? 'justify-start',
        alignOptions[align]?.tailwind ?? 'items-stretch',
        wrapOptions[wrap]?.tailwind ?? 'flex-wrap',
      ];
      if (gapValues[gap] > 0) parts.push(`gap-${gapValues[gap]}`);
      return parts.join(' ');
    }
    const parts = [
      'grid',
      `grid-cols-${gridCols}`,
      `grid-rows-${gridRows}`,
      justifyOptions[justify].tailwind,
      alignOptions[align].tailwind,
    ];
    if (gapValues[gap] > 0) parts.push(`gap-${gapValues[gap]}`);
    return parts.join(' ');
  }, [layoutType, flexDirection, justify, align, wrap, gap, gridCols, gridRows]);

  const itemCount = layoutType === 'grid' ? gridCols * gridRows : 6;

  return (
    <ToolLayout
      title="Flexbox & Grid Generator"
      description="Visual layout builder for Flexbox and CSS Grid. Export CSS or Tailwind."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLayoutType('flex')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all ${
                layoutType === 'flex'
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
              }`}
            >
              Flexbox
            </button>
            <button
              type="button"
              onClick={() => setLayoutType('grid')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-all ${
                layoutType === 'grid'
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                  : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-300'
              }`}
            >
              Grid
            </button>
          </div>

          <div className="aspect-video bg-slate-800/40 rounded-xl border border-slate-700/60 p-3 sm:p-6 min-h-[200px] sm:min-h-[220px] overflow-auto min-w-0">
            <div
              className="w-full h-full min-h-[160px] rounded-lg min-w-0"
              style={containerStyle}
            >
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  className="bg-cyan-500/25 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center text-white font-semibold text-sm sm:text-base font-mono shrink-0 min-w-[44px] min-h-[44px] sm:min-w-[52px] sm:min-h-[52px] shadow-sm"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div className="flex flex-wrap gap-2">
            <label className="text-sm text-slate-400 w-full">Justify</label>
            {justifyOptions.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setJustify(i)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  justify === i ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="text-sm text-slate-400 w-full">Align</label>
            {alignOptions.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAlign(i)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  align === i ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-sm text-slate-400">Gap</label>
            <select
              value={gapValues[gap]}
              onChange={(e) => setGap(gapValues.indexOf(Number(e.target.value)))}
              className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm"
            >
              {gapValues.map((v) => (
                <option key={v} value={v}>
                  {v === 0 ? '0' : `${v * 4}px`}
                </option>
              ))}
            </select>
          </div>

          {layoutType === 'flex' && (
            <>
              <div className="flex flex-wrap gap-2">
                <label className="text-sm text-slate-400 w-full">Direction</label>
                {flexDirections.map((opt, i) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFlexDirection(i)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      flexDirection === i ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="text-sm text-slate-400 w-full">Wrap</label>
                {wrapOptions.map((opt, i) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setWrap(i)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      wrap === i ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {layoutType === 'grid' && (
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Columns</label>
                <select
                  value={gridCols}
                  onChange={(e) => setGridCols(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm"
                >
                  {gridColsOptions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Rows</label>
                <select
                  value={gridRows}
                  onChange={(e) => setGridRows(Number(e.target.value))}
                  className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm"
                >
                  {gridRowsOptions.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Output</h3>
          <TabSwitcher
            options={[
              { id: 'css', label: 'CSS' },
              { id: 'tailwind', label: 'Tailwind' },
            ]}
            activeTab={outputTab}
            onChange={(tab) => setOutputTab(tab as 'css' | 'tailwind')}
          />
        </div>
        <CodeOutput
          code={
            outputTab === 'css'
              ? cssCode
              : `<div className="${tailwindClasses}">\n  {/* items */}\n</div>`
          }
          language={outputTab === 'css' ? 'css' : 'html'}
        />
      </div>
    </ToolLayout>
  );
}
