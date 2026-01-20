'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Link as LinkIcon } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const tool = getToolById('placeholder-image')!;
const category = toolCategories[tool.category];

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [text, setText] = useState('');
  const [format, setFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState('');

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw text
    const displayText = text || `${width} × ${height}`;
    ctx.fillStyle = textColor;
    
    // Calculate font size based on image dimensions
    const fontSize = Math.min(width, height) / 10;
    ctx.font = `bold ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(displayText, width / 2, height / 2);

    // Generate data URL
    const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    const dataUrl = canvas.toDataURL(mimeType, 0.9);
    setImageUrl(dataUrl);
  }, [width, height, bgColor, textColor, text, format]);

  useEffect(() => {
    generateImage();
  }, [generateImage]);

  const downloadImage = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = `placeholder-${width}x${height}.${format}`;
    link.href = imageUrl;
    link.click();
  }, [imageUrl, width, height, format]);

  const presetSizes = [
    { name: 'Square SM', width: 200, height: 200 },
    { name: 'Square MD', width: 400, height: 400 },
    { name: 'Square LG', width: 600, height: 600 },
    { name: 'Banner', width: 1200, height: 400 },
    { name: 'Card', width: 400, height: 300 },
    { name: 'Hero', width: 1920, height: 1080 },
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  const colorPresets = [
    { name: 'Blue', bg: '#3b82f6', text: '#ffffff' },
    { name: 'Gray', bg: '#6b7280', text: '#ffffff' },
    { name: 'Green', bg: '#10b981', text: '#ffffff' },
    { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
    { name: 'Red', bg: '#ef4444', text: '#ffffff' },
    { name: 'Dark', bg: '#1f2937', text: '#ffffff' },
  ];

  return (
    <ToolLayout
      title="Placeholder Image Generator"
      description="Generate custom placeholder images with adjustable dimensions, colors, and text for mockups and prototypes."
      tool={tool}
      category={category}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dimensions */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-300">Dimensions</h3>
              
              <div>
                <label className="block text-xs text-slate-400 mb-2">Width: {width}px</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Height: {height}px</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Preset Sizes */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Preset Sizes</h3>
              <div className="grid grid-cols-2 gap-2">
                {presetSizes.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setWidth(preset.width);
                      setHeight(preset.height);
                    }}
                    className="px-3 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all duration-300"
                  >
                    {preset.name}
                    <br />
                    <span className="text-slate-500">{preset.width}×{preset.height}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-medium text-slate-300">Colors</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Background</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded border border-slate-700/60 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Text</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded border border-slate-700/60 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Color Presets</label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setBgColor(preset.bg);
                        setTextColor(preset.text);
                      }}
                      className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded text-xs text-slate-300 hover:text-cyan-300 transition-all duration-300"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Text & Format */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Custom Text (optional)</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`${width} × ${height}`}
                  className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        format === fmt
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                          : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-6">
              <div className="flex items-center justify-center bg-slate-800/40 rounded-lg p-4 min-h-[400px]">
                <canvas ref={canvasRef} className="max-w-full h-auto shadow-2xl" />
              </div>
            </div>

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={downloadImage}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-sm font-medium text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(imageUrl);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 transition-all duration-300"
              >
                <LinkIcon className="w-4 h-4" />
                Copy Data URL
              </button>
            </div>

            {/* Info */}
            <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">💡 Usage Tips</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• PNG supports transparency, use for overlays</li>
                <li>• JPEG has smaller file sizes, best for photos</li>
                <li>• WebP offers best compression with quality</li>
                <li>• Data URLs can be used directly in HTML/CSS</li>
                <li>• Keep dimensions under 2000px for better performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
