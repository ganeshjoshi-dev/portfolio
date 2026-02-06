/**
 * Color converter: parse any common format to RGBA, format to any output.
 * Canonical representation: r, g, b in 0–255, a in 0–1.
 */

export interface RGBARec {
  r: number;
  g: number;
  b: number;
  a: number;
}

// --- Parsing ---

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

function parseHex(input: string): RGBARec | null {
  const trimmed = input.replace(/^\s*#?\s*/, '').replace(/\s*$/, '');
  const m3 = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(trimmed);
  const m6 = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(trimmed);
  const m8 = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(trimmed);

  if (m3) {
    const r = parseInt(m3[1] + m3[1], 16);
    const g = parseInt(m3[2] + m3[2], 16);
    const b = parseInt(m3[3] + m3[3], 16);
    return { r, g, b, a: 1 };
  }
  if (m6) {
    const r = parseInt(m6[1], 16);
    const g = parseInt(m6[2], 16);
    const b = parseInt(m6[3], 16);
    return { r, g, b, a: 1 };
  }
  if (m8) {
    const r = parseInt(m8[1], 16);
    const g = parseInt(m8[2], 16);
    const b = parseInt(m8[3], 16);
    const a = parseInt(m8[4], 16) / 255;
    return { r, g, b, a };
  }
  return null;
}

function parseRgbRgba(input: string): RGBARec | null {
  const m = /rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i.exec(input);
  if (!m) return null;
  const r = clamp(Math.round(parseFloat(m[1])), 0, 255);
  const g = clamp(Math.round(parseFloat(m[2])), 0, 255);
  const b = clamp(Math.round(parseFloat(m[3])), 0, 255);
  const a = m[4] != null ? clamp(parseFloat(m[4]), 0, 1) : 1;
  return { r, g, b, a };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function parseHslHsla(input: string): RGBARec | null {
  const m = /hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)/i.exec(input);
  if (!m) return null;
  const h = ((parseFloat(m[1]) % 360) + 360) % 360;
  const s = clamp(parseFloat(m[2]), 0, 100);
  const l = clamp(parseFloat(m[3]), 0, 100);
  const a = m[4] != null ? clamp(parseFloat(m[4]), 0, 1) : 1;
  const rgb = hslToRgb(h, s, l);
  return { ...rgb, a };
}

/** Parse any supported color string into RGBA. Returns null if invalid. */
export function parseColor(input: string): RGBARec | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('#') || /^[a-fA-F0-9]{3,8}$/.test(trimmed.replace(/^#/, ''))) {
    return parseHex(trimmed);
  }
  if (trimmed.toLowerCase().startsWith('rgb')) {
    return parseRgbRgba(trimmed);
  }
  if (trimmed.toLowerCase().startsWith('hsl')) {
    return parseHslHsla(trimmed);
  }
  return parseHex(trimmed);
}

// --- Formatting ---

export function toHex({ r, g, b }: RGBARec): string {
  const rr = clamp(Math.round(r), 0, 255).toString(16).padStart(2, '0');
  const gg = clamp(Math.round(g), 0, 255).toString(16).padStart(2, '0');
  const bb = clamp(Math.round(b), 0, 255).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}`.toLowerCase();
}

export function toHex8({ r, g, b, a }: RGBARec): string {
  const rr = clamp(Math.round(r), 0, 255).toString(16).padStart(2, '0');
  const gg = clamp(Math.round(g), 0, 255).toString(16).padStart(2, '0');
  const bb = clamp(Math.round(b), 0, 255).toString(16).padStart(2, '0');
  const aa = clamp(Math.round(a * 255), 0, 255).toString(16).padStart(2, '0');
  return `#${rr}${gg}${bb}${aa}`.toLowerCase();
}

export function toRgb({ r, g, b }: RGBARec): string {
  const rr = clamp(Math.round(r), 0, 255);
  const gg = clamp(Math.round(g), 0, 255);
  const bb = clamp(Math.round(b), 0, 255);
  return `rgb(${rr}, ${gg}, ${bb})`;
}

export function toRgba({ r, g, b, a }: RGBARec): string {
  const rr = clamp(Math.round(r), 0, 255);
  const gg = clamp(Math.round(g), 0, 255);
  const bb = clamp(Math.round(b), 0, 255);
  const aa = a === 1 ? '1' : String(parseFloat(a.toFixed(4)));
  return `rgba(${rr}, ${gg}, ${bb}, ${aa})`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function toHsl(rec: RGBARec): string {
  const { h, s, l } = rgbToHsl(rec.r, rec.g, rec.b);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function toHsla(rec: RGBARec): string {
  const { h, s, l } = rgbToHsl(rec.r, rec.g, rec.b);
  const aa = rec.a === 1 ? '1' : String(parseFloat(rec.a.toFixed(4)));
  return `hsla(${h}, ${s}%, ${l}%, ${aa})`;
}

/** CSS-ready rgba string for inline styles (e.g. backgroundColor). */
export function toCssRgba(rec: RGBARec): string {
  return toRgba(rec);
}
