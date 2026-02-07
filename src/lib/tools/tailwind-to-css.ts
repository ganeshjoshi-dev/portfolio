/**
 * Convert a subset of Tailwind utility classes to equivalent CSS.
 * Supports common spacing, flex, grid, display, sizing, and arbitrary values.
 */

const spacingScale: Record<string, string> = {
  '0': '0',
  'px': '1px',
  '0.5': '0.125rem',
  '1': '0.25rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
  '40': '10rem',
  '48': '12rem',
  '56': '14rem',
  '64': '16rem',
  '72': '18rem',
  '80': '20rem',
  '96': '24rem',
  'auto': 'auto',
  'full': '100%',
  'screen': '100vw',
  'min': 'min-content',
  'max': 'max-content',
  'fit': 'fit-content',
};

function getSpacing(value: string): string {
  return spacingScale[value] ?? (value.endsWith('rem') || value.endsWith('px') || value.endsWith('%') ? value : `${parseFloat(value) * 0.25}rem`);
}

const displayMap: Record<string, string> = {
  block: 'display: block;',
  'inline-block': 'display: inline-block;',
  inline: 'display: inline;',
  flex: 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  grid: 'display: grid;',
  'inline-grid': 'display: inline-grid;',
  hidden: 'display: none;',
  table: 'display: table;',
  'table-row': 'display: table-row;',
  'table-cell': 'display: table-cell;',
};

const flexMap: Record<string, string> = {
  'flex-row': 'flex-direction: row;',
  'flex-row-reverse': 'flex-direction: row-reverse;',
  'flex-col': 'flex-direction: column;',
  'flex-col-reverse': 'flex-direction: column-reverse;',
  'flex-wrap': 'flex-wrap: wrap;',
  'flex-nowrap': 'flex-wrap: nowrap;',
  'flex-wrap-reverse': 'flex-wrap: wrap-reverse;',
  'justify-start': 'justify-content: flex-start;',
  'justify-end': 'justify-content: flex-end;',
  'justify-center': 'justify-content: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-around': 'justify-content: space-around;',
  'justify-evenly': 'justify-content: space-evenly;',
  'items-start': 'align-items: flex-start;',
  'items-end': 'align-items: flex-end;',
  'items-center': 'align-items: center;',
  'items-baseline': 'align-items: baseline;',
  'items-stretch': 'align-items: stretch;',
  'flex-1': 'flex: 1 1 0%;',
  'flex-auto': 'flex: 1 1 auto;',
  'flex-initial': 'flex: 0 1 auto;',
  'flex-none': 'flex: none;',
};

const gridColsMap: Record<string, string> = {
  'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr));',
  'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr));',
  'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr));',
  'grid-cols-5': 'grid-template-columns: repeat(5, minmax(0, 1fr));',
  'grid-cols-6': 'grid-template-columns: repeat(6, minmax(0, 1fr));',
  'grid-cols-8': 'grid-template-columns: repeat(8, minmax(0, 1fr));',
  'grid-cols-10': 'grid-template-columns: repeat(10, minmax(0, 1fr));',
  'grid-cols-12': 'grid-template-columns: repeat(12, minmax(0, 1fr));',
  'grid-cols-none': 'grid-template-columns: none;',
};

const gridRowsMap: Record<string, string> = {
  'grid-rows-1': 'grid-template-rows: repeat(1, minmax(0, 1fr));',
  'grid-rows-2': 'grid-template-rows: repeat(2, minmax(0, 1fr));',
  'grid-rows-3': 'grid-template-rows: repeat(3, minmax(0, 1fr));',
  'grid-rows-4': 'grid-template-rows: repeat(4, minmax(0, 1fr));',
  'grid-rows-5': 'grid-template-rows: repeat(5, minmax(0, 1fr));',
  'grid-rows-6': 'grid-template-rows: repeat(6, minmax(0, 1fr));',
  'grid-rows-none': 'grid-template-rows: none;',
};

const roundedMap: Record<string, string> = {
  'rounded-none': 'border-radius: 0;',
  'rounded-sm': 'border-radius: 0.125rem;',
  'rounded': 'border-radius: 0.25rem;',
  'rounded-md': 'border-radius: 0.375rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-3xl': 'border-radius: 1.5rem;',
  'rounded-full': 'border-radius: 9999px;',
};

const borderMap: Record<string, string> = {
  'border': 'border-width: 1px;',
  'border-0': 'border-width: 0;',
  'border-2': 'border-width: 2px;',
  'border-4': 'border-width: 4px;',
  'border-8': 'border-width: 8px;',
  'border-t': 'border-top-width: 1px;',
  'border-r': 'border-right-width: 1px;',
  'border-b': 'border-bottom-width: 1px;',
  'border-l': 'border-left-width: 1px;',
};

// Tailwind max-width scale (rem)
const maxWidthMap: Record<string, string> = {
  'max-w-0': 'max-width: 0rem;',
  'max-w-none': 'max-width: none;',
  'max-w-xs': 'max-width: 20rem;',
  'max-w-sm': 'max-width: 24rem;',
  'max-w-md': 'max-width: 28rem;',
  'max-w-lg': 'max-width: 32rem;',
  'max-w-xl': 'max-width: 36rem;',
  'max-w-2xl': 'max-width: 42rem;',
  'max-w-3xl': 'max-width: 48rem;',
  'max-w-4xl': 'max-width: 56rem;',
  'max-w-5xl': 'max-width: 64rem;',
  'max-w-6xl': 'max-width: 72rem;',
  'max-w-7xl': 'max-width: 80rem;',
  'max-w-full': 'max-width: 100%;',
  'max-w-min': 'max-width: min-content;',
  'max-w-max': 'max-width: max-content;',
  'max-w-fit': 'max-width: fit-content;',
  'max-w-prose': 'max-width: 65ch;',
  'max-w-screen-sm': 'max-width: 640px;',
  'max-w-screen-md': 'max-width: 768px;',
  'max-w-screen-lg': 'max-width: 1024px;',
  'max-w-screen-xl': 'max-width: 1280px;',
  'max-w-screen-2xl': 'max-width: 1536px;',
};

function parseArbitrary(cls: string): string | null {
  const match = cls.match(/^([a-z-]+)?\[([^\]]+)\]$/);
  if (!match) return null;
  const prop = match[1];
  const value = match[2].replace(/_/g, ' ');
  if (!prop) return `/* arbitrary: ${cls} */`;
  const propMap: Record<string, string> = {
    'p': 'padding',
    'px': 'padding-left; padding-right',
    'py': 'padding-top; padding-bottom',
    'pt': 'padding-top',
    'pr': 'padding-right',
    'pb': 'padding-bottom',
    'pl': 'padding-left',
    'm': 'margin',
    'mx': 'margin-left; margin-right',
    'my': 'margin-top; margin-bottom',
    'mt': 'margin-top',
    'mr': 'margin-right',
    'mb': 'margin-bottom',
    'ml': 'margin-left',
    'w': 'width',
    'h': 'height',
    'min-w': 'min-width',
    'min-h': 'min-height',
    'max-w': 'max-width',
    'max-h': 'max-height',
    'top': 'top',
    'right': 'right',
    'bottom': 'bottom',
    'left': 'left',
    'rounded': 'border-radius',
    'gap': 'gap',
    'text': 'font-size',
    'leading': 'line-height',
    'tracking': 'letter-spacing',
  };
  const cssProp = propMap[prop] ?? prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const props = cssProp.split('; ');
  if (props.length === 2) {
    return `${props[0]}: ${value}; ${props[1]}: ${value};`;
  }
  return `${cssProp}: ${value};`;
}

function classToCss(cls: string): string | null {
  const trimmed = cls.trim();
  if (!trimmed) return null;

  if (displayMap[trimmed]) return displayMap[trimmed];
  if (flexMap[trimmed]) return flexMap[trimmed];
  if (gridColsMap[trimmed]) return gridColsMap[trimmed];
  if (gridRowsMap[trimmed]) return gridRowsMap[trimmed];
  if (roundedMap[trimmed]) return roundedMap[trimmed];
  if (borderMap[trimmed]) return borderMap[trimmed];
  if (maxWidthMap[trimmed]) return maxWidthMap[trimmed];

  const arbitrary = parseArbitrary(trimmed);
  if (arbitrary) return arbitrary;

  const paddingMatch = trimmed.match(/^p([xytrbl])?-(\d+|px|full|screen|auto)$/);
  if (paddingMatch) {
    const dir = paddingMatch[1];
    const val = getSpacing(paddingMatch[2]);
    if (!dir) return `padding: ${val};`;
    const map: Record<string, string> = { x: 'left', y: 'top', t: 'top', r: 'right', b: 'bottom', l: 'left' };
    const prop = `padding-${map[dir]}`;
    return `${prop}: ${val};`;
  }

  const marginMatch = trimmed.match(/^m([xytrbl])?-(\d+|px|full|auto)$/);
  if (marginMatch) {
    const dir = marginMatch[1];
    const val = getSpacing(marginMatch[2]);
    if (!dir) return `margin: ${val};`;
    const map: Record<string, string> = { x: 'left', y: 'top', t: 'top', r: 'right', b: 'bottom', l: 'left' };
    const prop = `margin-${map[dir]}`;
    return `${prop}: ${val};`;
  }

  const gapMatch = trimmed.match(/^gap-(\d+|px)$/);
  if (gapMatch) return `gap: ${getSpacing(gapMatch[1])};`;

  const wMatch = trimmed.match(/^w-(\d+|px|full|screen|min|max|fit|auto)$/);
  if (wMatch) return `width: ${getSpacing(wMatch[1])};`;

  const hMatch = trimmed.match(/^h-(\d+|px|full|screen|min|max|fit|auto)$/);
  if (hMatch) return `height: ${getSpacing(hMatch[1])};`;

  const minHMatch = trimmed.match(/^min-h-(full|screen|min|max|fit|0)$/);
  if (minHMatch) {
    const v = minHMatch[1];
    const val = v === 'screen' ? '100vh' : v === 'full' ? '100%' : v === '0' ? '0' : v;
    return `min-height: ${val};`;
  }

  const minWMatch = trimmed.match(/^min-w-(full|min|max|fit|0)$/);
  if (minWMatch) {
    const v = minWMatch[1];
    const val = v === 'full' ? '100%' : v === '0' ? '0' : v;
    return `min-width: ${val};`;
  }

  return null;
}

export function tailwindClassesToCss(classString: string): { css: string; unknown: string[] } {
  const classes = classString.trim().split(/\s+/).filter(Boolean);
  const declarations: string[] = [];
  const unknown: string[] = [];
  const seen = new Set<string>();

  for (const cls of classes) {
    const css = classToCss(cls);
    if (css) {
      if (!css.startsWith('/*')) {
        const key = css.replace(/\s/g, '');
        if (!seen.has(key)) {
          seen.add(key);
          declarations.push(css);
        }
      } else {
        declarations.push(css);
      }
    } else {
      unknown.push(cls);
    }
  }

  const css = declarations.length > 0
    ? `.element {\n  ${declarations.join('\n  ')}\n}`
    : '/* No recognized Tailwind classes */';

  return { css, unknown };
}
