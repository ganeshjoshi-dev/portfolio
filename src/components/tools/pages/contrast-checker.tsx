'use client';

import { useState, useMemo } from 'react';
import { Check, X, Star } from 'lucide-react';
import { ToolLayout, ColorPicker } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type RatingLevel = 'very-good' | 'good' | 'acceptable' | 'poor';

function getRating(ratio: number): { level: RatingLevel; label: string; stars: number } {
  if (ratio >= 7) return { level: 'very-good', label: 'Very good', stars: 5 };
  if (ratio >= 4.5) return { level: 'good', label: 'Good', stars: 4 };
  if (ratio >= 3) return { level: 'acceptable', label: 'Acceptable for large text only', stars: 2 };
  return { level: 'poor', label: 'Poor', stars: 1 };
}

function getRecommendation(ratio: number, smallText: boolean, largeText: boolean): string {
  if (ratio >= 7) {
    return 'Great contrast for both small text (below 18pt) and large text (above 18pt or bold above 14pt). Meets AAA.';
  }
  if (smallText && largeText) {
    return 'Good contrast for small text (below 18pt) and great contrast for large text (above 18pt or bold above 14pt). Meets AA.';
  }
  if (largeText) {
    return 'Acceptable for large text only (above 18pt or bold above 14pt). Consider increasing contrast for body text.';
  }
  return 'Contrast is too low. Darken the text or lighten the background to improve readability and meet WCAG.';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace(/^#/, '').match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
  if (!match) return null;
  let s = match[1];
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const r = parseInt(s.slice(0, 2), 16) / 255;
  const g = parseInt(s.slice(2, 4), 16) / 255;
  const b = parseInt(s.slice(4, 6), 16) / 255;
  return { r, g, b };
}

function srgbToLinear(c: number): number {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const L1 = relativeLuminance(hex1);
  const L2 = relativeLuminance(hex2);
  if (L1 == null || L2 == null) return null;
  const [bright, dark] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (bright + 0.05) / (dark + 0.05);
}

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3;
const WCAG_AAA_NORMAL = 7;
const WCAG_AAA_LARGE = 4.5;

function getWcagResults(ratio: number) {
  return {
    smallText: ratio >= WCAG_AA_NORMAL,
    largeText: ratio >= WCAG_AA_LARGE,
    aaNormal: ratio >= WCAG_AA_NORMAL,
    aaLarge: ratio >= WCAG_AA_LARGE,
    aaaNormal: ratio >= WCAG_AAA_NORMAL,
    aaaLarge: ratio >= WCAG_AAA_LARGE,
  };
}

export default function ContrastCheckerPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [foreground, setForeground] = useState('#ffffff');
  const [background, setBackground] = useState('#1a1f3a');
  const [previewText, setPreviewText] = useState('Sample text for contrast preview');

  const ratio = useMemo(() => contrastRatio(foreground, background), [foreground, background]);
  const wcag = useMemo(() => (ratio != null ? getWcagResults(ratio) : null), [ratio]);
  const rating = useMemo(() => (ratio != null ? getRating(ratio) : null), [ratio]);
  const recommendation = useMemo(
    () => (ratio != null && wcag ? getRecommendation(ratio, wcag.smallText, wcag.largeText) : ''),
    [ratio, wcag]
  );
  const ratioDisplay = ratio != null ? ratio.toFixed(2) : '—';

  const contrastBlockStyles: Record<RatingLevel, string> = {
    'very-good': 'bg-emerald-500/15 border-emerald-500/40',
    good: 'bg-emerald-500/10 border-emerald-500/30',
    acceptable: 'bg-amber-500/10 border-amber-500/30',
    poor: 'bg-red-500/10 border-red-500/30',
  };
  const contrastTextStyles: Record<RatingLevel, string> = {
    'very-good': 'text-emerald-400',
    good: 'text-emerald-400',
    acceptable: 'text-amber-400',
    poor: 'text-red-400',
  };

  return (
    <ToolLayout
      title="Contrast Checker"
      description="Calculate the contrast ratio of text and background colors. Ensure your designs meet WCAG accessibility standards."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Color pickers + Contrast + Small/Large text (Coolors-style) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <ColorPicker color={foreground} onChange={setForeground} label="Text color" />
          </div>
          <div className="space-y-2">
            <ColorPicker color={background} onChange={setBackground} label="Background color" />
          </div>
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1 lg:justify-center">
            <div
              className={`p-4 rounded-xl border ${
                ratio != null && rating
                  ? contrastBlockStyles[rating.level]
                  : 'bg-slate-900/60 border-slate-700/60'
              }`}
            >
              <p className="text-xs text-slate-400 mb-1">Contrast</p>
              {ratio != null && rating ? (
                <>
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className={`text-3xl font-bold ${contrastTextStyles[rating.level]}`}>
                      {ratioDisplay}:1
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${contrastTextStyles[rating.level]}`}>
                        {rating.label}
                      </span>
                      <div className="flex gap-0.5" aria-hidden>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= rating.stars
                                ? rating.level === 'poor'
                                  ? 'fill-red-400 text-red-400'
                                  : rating.level === 'acceptable'
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-emerald-400 text-emerald-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {wcag && (
                    <div className="mt-4 pt-3 border-t border-slate-700/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Small text</span>
                        <div className="flex gap-0.5" aria-hidden>
                          {[1, 2, 3].map((i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i <= 3 && wcag.smallText
                                  ? 'fill-emerald-400 text-emerald-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">Large text</span>
                        <div className="flex gap-0.5" aria-hidden>
                          {[1, 2, 3].map((i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i <= 3 && wcag.largeText
                                  ? 'fill-emerald-400 text-emerald-400'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-2xl font-bold text-slate-500">—</p>
              )}
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Preview</label>
          <div
            className="rounded-xl border border-slate-700/60 overflow-hidden min-h-[120px] flex flex-col justify-center p-6"
            style={{ backgroundColor: background }}
          >
            <p
              className="text-base sm:text-lg"
              style={{ color: foreground }}
            >
              {previewText || 'Sample text'}
            </p>
            <p
              className="text-2xl sm:text-3xl font-bold mt-2"
              style={{ color: foreground }}
            >
              Large text
            </p>
          </div>
          <input
            type="text"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Sample text for contrast preview"
            className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
        </div>

        {/* Full WCAG breakdown */}
        {wcag && (
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
            <h3 className="text-sm font-medium text-slate-300 mb-3">WCAG 2.1 details</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                {wcag.aaNormal ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                <span className={wcag.aaNormal ? 'text-slate-200' : 'text-slate-400'}>AA normal (4.5:1)</span>
              </div>
              <div className="flex items-center gap-2">
                {wcag.aaLarge ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                <span className={wcag.aaLarge ? 'text-slate-200' : 'text-slate-400'}>AA large (3:1)</span>
              </div>
              <div className="flex items-center gap-2">
                {wcag.aaaNormal ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                <span className={wcag.aaaNormal ? 'text-slate-200' : 'text-slate-400'}>AAA normal (7:1)</span>
              </div>
              <div className="flex items-center gap-2">
                {wcag.aaaLarge ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                <span className={wcag.aaaLarge ? 'text-slate-200' : 'text-slate-400'}>AAA large (4.5:1)</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic recommendation (Coolors-style) */}
        {recommendation && (
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
            <p className="text-sm text-slate-300 leading-relaxed">{recommendation}</p>
          </div>
        )}

        {/* How does it work? */}
        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2">How does it work?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This tool follows the Web Content Accessibility Guidelines (WCAG), which are recommendations for making the web more accessible.
            For colors, the standard defines two levels: <strong className="text-slate-300">AA</strong> (minimum contrast) and <strong className="text-slate-300">AAA</strong> (enhanced contrast).
            AA requires at least 4.5:1 for normal text and 3:1 for large text (at least 18pt or 14pt bold).
            AAA requires at least 7:1 for normal text and 4.5:1 for large text.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
