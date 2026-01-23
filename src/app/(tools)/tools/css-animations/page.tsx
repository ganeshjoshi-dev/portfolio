'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Play, Pause, RotateCcw, Search } from 'lucide-react';
import {
  animationPresets,
  animationCategories,
  timingFunctions,
  getPresetById,
} from '@/lib/tools/animations/presets';
import type { AnimationConfig, AnimationCategory, AnimationPreset } from '@/lib/tools/animations/types';
import {
  generateCSSCode,
  generateTailwindConfig,
  generateClassExamples,
} from '@/lib/tools/animations/generators';

const tool = getToolById('css-animations')!;
const category = toolCategories[tool.category];

const defaultPreset = animationPresets[0];

export default function CSSAnimationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<AnimationCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset>(defaultPreset);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  // Animation configuration
  const [duration, setDuration] = useState(defaultPreset.defaultDuration);
  const [delay, setDelay] = useState(0);
  const [timingFunction, setTimingFunction] = useState(defaultPreset.defaultTimingFunction);
  const [iterationCount, setIterationCount] = useState<number | 'infinite'>(1);
  const [direction, setDirection] = useState<AnimationConfig['direction']>('normal');
  const [fillMode, setFillMode] = useState<AnimationConfig['fillMode']>('forwards');
  const [outputFormat, setOutputFormat] = useState<'css' | 'tailwind' | 'classes'>('css');

  // Animation config object
  const animationConfig: AnimationConfig = useMemo(
    () => ({
      preset: selectedPreset,
      duration,
      delay,
      timingFunction,
      iterationCount,
      direction,
      fillMode,
      playState: isPlaying ? 'running' : 'paused',
    }),
    [selectedPreset, duration, delay, timingFunction, iterationCount, direction, fillMode, isPlaying]
  );

  // Generate animation CSS dynamically
  const animationCSS = useMemo(() => {
    let keyframes = '@keyframes preview-animation {\n';
    selectedPreset.keyframes.forEach((keyframe) => {
      const percent = keyframe.offset === 0 ? 'from' : keyframe.offset === 100 ? 'to' : `${keyframe.offset}%`;
      keyframes += `  ${percent} { `;
      Object.entries(keyframe.properties).forEach(([prop, value]) => {
        keyframes += `${prop}: ${value}; `;
      });
      keyframes += `}\n`;
    });
    keyframes += '}';
    return keyframes;
  }, [selectedPreset]);

  const animationStyle = useMemo(() => {
    const parts = [
      'preview-animation',
      `${duration}s`,
      timingFunction,
      delay > 0 ? `${delay}s` : '',
      iterationCount !== 1 ? iterationCount : '',
      direction !== 'normal' ? direction : '',
      fillMode !== 'none' ? fillMode : '',
      isPlaying ? 'running' : 'paused',
    ].filter(Boolean).join(' ');
    
    return parts;
  }, [duration, delay, timingFunction, iterationCount, direction, fillMode, isPlaying]);

  // Filter animations
  const filteredAnimations = useMemo(() => {
    let animations = animationPresets;
    
    if (selectedCategory !== 'all') {
      animations = animations.filter((preset) => preset.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      animations = animations.filter(
        (preset) =>
          preset.name.toLowerCase().includes(query) ||
          preset.description.toLowerCase().includes(query)
      );
    }
    
    return animations;
  }, [selectedCategory, searchQuery]);

  // Generate output code
  const outputCode = useMemo(() => {
    switch (outputFormat) {
      case 'css':
        return generateCSSCode(animationConfig);
      case 'tailwind':
        return generateTailwindConfig(animationConfig);
      case 'classes':
        return generateClassExamples(animationConfig);
      default:
        return '';
    }
  }, [animationConfig, outputFormat]);

  const handlePresetSelect = useCallback((preset: AnimationPreset) => {
    setSelectedPreset(preset);
    setDuration(preset.defaultDuration);
    setTimingFunction(preset.defaultTimingFunction);
    setAnimationKey((prev) => prev + 1);
    setIsPlaying(true);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setAnimationKey((prev) => prev + 1);
    setIsPlaying(true);
  }, []);

  // Update config when preset changes
  useEffect(() => {
    setDuration(selectedPreset.defaultDuration);
    setTimingFunction(selectedPreset.defaultTimingFunction);
  }, [selectedPreset]);

  return (
    <ToolLayout title="CSS Animation Generator" description={tool.description} tool={tool} category={category}>
      <style>{animationCSS}</style>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Preview & Library */}
        <div className="space-y-6">
          {/* Animation Preview */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
            
            {/* Preview Box */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-12 mb-4 flex items-center justify-center min-h-[240px]">
              <div
                key={animationKey}
                className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg"
                style={{ animation: animationStyle }}
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button onClick={handlePlayPause} variant="secondary" size="md" className="gap-2">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={handleReset} variant="ghost" size="md" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Animation Library */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Animation Library</h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search animations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputClassName="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={() => setSelectedCategory('all')}
                variant={selectedCategory === 'all' ? 'primary' : 'ghost'}
                size="sm"
              >
                All
              </Button>
              {animationCategories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  variant={selectedCategory === cat.id ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Animation Grid */}
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredAnimations.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    selectedPreset.id === preset.id
                      ? 'bg-cyan-400/10 border-cyan-400/50'
                      : 'bg-slate-800/40 border-slate-700/40 hover:border-cyan-400/30'
                  }`}
                >
                  <div className="font-medium text-white text-sm mb-1">{preset.name}</div>
                  <div className="text-xs text-slate-400">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Output */}
        <div className="space-y-6">
          {/* Customization Controls */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Customize</h3>
            
            <div className="space-y-4">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Duration: {duration}s
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Delay */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Delay: {delay}s
                </label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={delay}
                  onChange={(e) => setDelay(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Timing Function */}
              <div>
                <Select
                  label="Timing Function"
                  value={timingFunction}
                  onChange={(e) => setTimingFunction(e.target.value)}
                  options={timingFunctions.map((tf) => ({
                    value: tf.value,
                    label: tf.label,
                  }))}
                />
              </div>

              {/* Iteration Count */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Iteration Count
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((count) => (
                    <Button
                      key={count}
                      onClick={() => setIterationCount(count)}
                      variant={iterationCount === count ? 'primary' : 'ghost'}
                      size="sm"
                      className="flex-1"
                    >
                      {count}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setIterationCount('infinite')}
                    variant={iterationCount === 'infinite' ? 'primary' : 'ghost'}
                    size="sm"
                    className="flex-1"
                  >
                    ∞
                  </Button>
                </div>
              </div>

              {/* Direction */}
              <div>
                <Select
                  label="Direction"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value as AnimationConfig['direction'])}
                  options={[
                    { value: 'normal', label: 'Normal' },
                    { value: 'reverse', label: 'Reverse' },
                    { value: 'alternate', label: 'Alternate' },
                    { value: 'alternate-reverse', label: 'Alternate Reverse' },
                  ]}
                />
              </div>

              {/* Fill Mode */}
              <div>
                <Select
                  label="Fill Mode"
                  value={fillMode}
                  onChange={(e) => setFillMode(e.target.value as AnimationConfig['fillMode'])}
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'forwards', label: 'Forwards' },
                    { value: 'backwards', label: 'Backwards' },
                    { value: 'both', label: 'Both' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Code Output */}
          <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Generated Code</h3>
              <CopyButton text={outputCode} />
            </div>

            {/* Format Tabs */}
            <TabSwitcher
              options={[
                { id: 'css', label: 'CSS' },
                { id: 'tailwind', label: 'Tailwind' },
                { id: 'classes', label: 'HTML Classes' },
              ]}
              activeTab={outputFormat}
              onChange={(tab) => setOutputFormat(tab as typeof outputFormat)}
            />

            {/* Code Display */}
            <div className="mt-4 bg-slate-950/50 rounded-lg p-4 border border-slate-800 overflow-x-auto">
              <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                <code>{outputCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
