export type HarmonyType = 
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic';

export interface ColorHarmony {
  id: HarmonyType;
  name: string;
  description: string;
  colorCount: number;
}

export const colorHarmonies: ColorHarmony[] = [
  {
    id: 'complementary',
    name: 'Complementary',
    description: 'Colors opposite on the color wheel',
    colorCount: 2,
  },
  {
    id: 'analogous',
    name: 'Analogous',
    description: 'Colors adjacent on the color wheel',
    colorCount: 3,
  },
  {
    id: 'triadic',
    name: 'Triadic',
    description: 'Three colors evenly spaced',
    colorCount: 3,
  },
  {
    id: 'split-complementary',
    name: 'Split Complementary',
    description: 'A color and two adjacent to its complement',
    colorCount: 3,
  },
  {
    id: 'tetradic',
    name: 'Tetradic',
    description: 'Four colors forming a rectangle',
    colorCount: 4,
  },
  {
    id: 'monochromatic',
    name: 'Monochromatic',
    description: 'Different shades of one color',
    colorCount: 5,
  },
];

// Convert hex to HSL
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
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

// Convert HSL to hex
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Generate harmony colors
export function generateHarmony(baseColor: string, harmony: HarmonyType): string[] {
  const hsl = hexToHsl(baseColor);
  const colors: string[] = [baseColor];

  switch (harmony) {
    case 'complementary':
      colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
      break;

    case 'analogous':
      colors.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
      colors.push(hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l));
      break;

    case 'triadic':
      colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
      colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
      break;

    case 'split-complementary':
      colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
      colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
      break;

    case 'tetradic':
      colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
      colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
      colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
      break;

    case 'monochromatic':
      colors.length = 0; // Clear and rebuild
      for (let i = 0; i < 5; i++) {
        const lightness = 20 + i * 15;
        colors.push(hslToHex(hsl.h, hsl.s, lightness));
      }
      break;
  }

  return colors;
}

// Generate Tailwind config
export function generateTailwindConfig(colors: string[], name: string = 'custom'): string {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const config: Record<string, string> = {};

  if (colors.length === 1) {
    const hsl = hexToHsl(colors[0]);
    shades.forEach((shade, index) => {
      const lightness = 98 - (index * 9);
      config[shade.toString()] = hslToHex(hsl.h, hsl.s, Math.max(5, Math.min(98, lightness)));
    });
  } else {
    colors.forEach((color, index) => {
      config[(index + 1).toString()] = color;
    });
  }

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        '${name}': ${JSON.stringify(config, null, 10).replace(/"/g, "'")}
      }
    }
  }
}`;
}
