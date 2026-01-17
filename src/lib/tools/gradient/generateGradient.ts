import { GradientConfig, ColorStop } from './types';

export function generateCSSGradient(config: GradientConfig): string {
  const { type, angle, colorStops, radialShape, radialPosition, conicPosition } = config;
  
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${stopsString})`;
    case 'radial':
      const shape = radialShape || 'circle';
      const position = radialPosition || 'center';
      return `radial-gradient(${shape} at ${position}, ${stopsString})`;
    case 'conic':
      const conicPos = conicPosition || 'center';
      return `conic-gradient(from ${angle}deg at ${conicPos}, ${stopsString})`;
    default:
      return `linear-gradient(${angle}deg, ${stopsString})`;
  }
}

export function generateTailwindGradient(config: GradientConfig): string {
  const { type, angle, colorStops } = config;
  
  if (type !== 'linear' || colorStops.length !== 2) {
    // For complex gradients, use arbitrary value
    return `bg-[${generateCSSGradient(config).replace(/\s/g, '_')}]`;
  }

  // Map angle to Tailwind direction
  const directionMap: Record<number, string> = {
    0: 'bg-gradient-to-t',
    45: 'bg-gradient-to-tr',
    90: 'bg-gradient-to-r',
    135: 'bg-gradient-to-br',
    180: 'bg-gradient-to-b',
    225: 'bg-gradient-to-bl',
    270: 'bg-gradient-to-l',
    315: 'bg-gradient-to-tl',
  };

  const direction = directionMap[angle] || `bg-gradient-to-r`;
  
  // For simple 2-stop gradients, use Tailwind classes
  const fromColor = colorStops[0].color;
  const toColor = colorStops[1].color;
  
  return `${direction} from-[${fromColor}] to-[${toColor}]`;
}

export function generateFullCSS(config: GradientConfig): string {
  const gradient = generateCSSGradient(config);
  return `.element {
  background: ${gradient};
}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getContrastColor(hex: string): 'white' | 'black' {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'white';
  
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function createColorStop(color: string, position: number): ColorStop {
  return {
    id: Math.random().toString(36).substr(2, 9),
    color,
    position,
  };
}
