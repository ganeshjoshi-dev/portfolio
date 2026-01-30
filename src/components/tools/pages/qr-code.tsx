'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import QRCode from 'qrcode';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export default function QRCodeGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('M');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = useCallback(async () => {
    if (!text.trim() || !canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });

      const dataUrl = canvasRef.current.toDataURL('image/png');
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }, [text, size, fgColor, bgColor, errorLevel]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = useCallback(() => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  }, [qrDataUrl]);

  const downloadSVG = useCallback(async () => {
    if (!text.trim()) return;
    try {
      const svg = await QRCode.toString(text, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'qrcode.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating SVG:', err);
    }
  }, [text, size, fgColor, bgColor, errorLevel]);

  const presets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Blue', fg: '#1e40af', bg: '#dbeafe' },
    { name: 'Purple', fg: '#7c3aed', bg: '#ede9fe' },
    { name: 'Green', fg: '#059669', bg: '#d1fae5' },
    { name: 'Dark', fg: '#f9fafb', bg: '#111827' },
  ];

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create custom QR codes with adjustable colors, size, and error correction. Download as PNG or SVG."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL, text, or data..."
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none"
                rows={4}
              />
              <p className="mt-2 text-xs text-slate-500">
                {text.length} characters
              </p>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all duration-300"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Foreground Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 rounded border border-slate-700/60 bg-slate-900/60 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 rounded border border-slate-700/60 bg-slate-900/60 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setErrorLevel(level)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      errorLevel === level
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                        : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {errorLevel === 'L' && 'Low ~7% - Smallest QR code'}
                {errorLevel === 'M' && 'Medium ~15% - Balanced (Recommended)'}
                {errorLevel === 'Q' && 'Quartile ~25% - Good for damaged codes'}
                {errorLevel === 'H' && 'High ~30% - Best for logos'}
              </p>
            </div>
          </div>

          {/* Right Panel - Preview & Actions */}
          <div className="space-y-6">
            {/* QR Code Preview */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-8">
              <div className="flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                <canvas ref={canvasRef} className="max-w-full h-auto" />
              </div>
            </div>

            {/* Download Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={downloadPNG}
                disabled={!qrDataUrl}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-sm font-medium text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button
                onClick={downloadSVG}
                disabled={!text.trim()}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
            </div>

            {/* Info */}
            <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">💡 Tips</h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• Use high error correction (H) if adding a logo</li>
                <li>• Keep URLs short for smaller QR codes</li>
                <li>• Ensure good contrast between colors</li>
                <li>• Test QR codes before printing</li>
                <li>• SVG format scales better for print</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
