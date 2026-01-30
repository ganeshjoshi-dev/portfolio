'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Pseudo-class mappings to Tailwind modifiers
const pseudoClassMap: Record<string, string> = {
  ':hover': 'hover',
  ':focus': 'focus',
  ':focus-visible': 'focus-visible',
  ':focus-within': 'focus-within',
  ':active': 'active',
  ':visited': 'visited',
  ':target': 'target',
  ':first-child': 'first',
  ':last-child': 'last',
  ':only-child': 'only',
  ':odd': 'odd',
  ':even': 'even',
  ':first-of-type': 'first-of-type',
  ':last-of-type': 'last-of-type',
  ':only-of-type': 'only-of-type',
  ':empty': 'empty',
  ':disabled': 'disabled',
  ':enabled': 'enabled',
  ':checked': 'checked',
  ':indeterminate': 'indeterminate',
  ':default': 'default',
  ':required': 'required',
  ':valid': 'valid',
  ':invalid': 'invalid',
  ':in-range': 'in-range',
  ':out-of-range': 'out-of-range',
  ':placeholder-shown': 'placeholder-shown',
  ':autofill': 'autofill',
  ':read-only': 'read-only',
  ':open': 'open',
  // Group and peer modifiers (for nested elements)
  ':first': 'first',
  ':last': 'last',
};

// Pseudo-element mappings to Tailwind modifiers
const pseudoElementMap: Record<string, string> = {
  '::before': 'before',
  '::after': 'after',
  '::placeholder': 'placeholder',
  '::selection': 'selection',
  '::marker': 'marker',
  '::first-line': 'first-line',
  '::first-letter': 'first-letter',
  '::backdrop': 'backdrop',
  '::file-selector-button': 'file',
  // Single colon variants (legacy)
  ':before': 'before',
  ':after': 'after',
  ':placeholder': 'placeholder',
  ':first-line': 'first-line',
  ':first-letter': 'first-letter',
};

// Media query / responsive modifiers
const mediaQueryMap: Record<string, string> = {
  '(min-width: 640px)': 'sm',
  '(min-width: 768px)': 'md',
  '(min-width: 1024px)': 'lg',
  '(min-width: 1280px)': 'xl',
  '(min-width: 1536px)': '2xl',
  '(prefers-color-scheme: dark)': 'dark',
  '(prefers-reduced-motion: reduce)': 'motion-reduce',
  '(prefers-reduced-motion: no-preference)': 'motion-safe',
  '(prefers-contrast: more)': 'contrast-more',
  '(prefers-contrast: less)': 'contrast-less',
  'print': 'print',
  '(orientation: portrait)': 'portrait',
  '(orientation: landscape)': 'landscape',
};

// CSS property to Tailwind class mappings
const cssToTailwindMap: Record<string, (value: string) => string | null> = {
  // Display
  'display': (v) => {
    const map: Record<string, string> = {
      'flex': 'flex',
      'inline-flex': 'inline-flex',
      'block': 'block',
      'inline-block': 'inline-block',
      'inline': 'inline',
      'grid': 'grid',
      'inline-grid': 'inline-grid',
      'none': 'hidden',
      'contents': 'contents',
    };
    return map[v] || null;
  },

  // Flex Direction
  'flex-direction': (v) => {
    const map: Record<string, string> = {
      'row': 'flex-row',
      'row-reverse': 'flex-row-reverse',
      'column': 'flex-col',
      'column-reverse': 'flex-col-reverse',
    };
    return map[v] || null;
  },

  // Flex Wrap
  'flex-wrap': (v) => {
    const map: Record<string, string> = {
      'wrap': 'flex-wrap',
      'nowrap': 'flex-nowrap',
      'wrap-reverse': 'flex-wrap-reverse',
    };
    return map[v] || null;
  },

  // Justify Content
  'justify-content': (v) => {
    const map: Record<string, string> = {
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'center': 'justify-center',
      'space-between': 'justify-between',
      'space-around': 'justify-around',
      'space-evenly': 'justify-evenly',
    };
    return map[v] || null;
  },

  // Align Items
  'align-items': (v) => {
    const map: Record<string, string> = {
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'center': 'items-center',
      'baseline': 'items-baseline',
      'stretch': 'items-stretch',
    };
    return map[v] || null;
  },

  // Align Content
  'align-content': (v) => {
    const map: Record<string, string> = {
      'flex-start': 'content-start',
      'flex-end': 'content-end',
      'center': 'content-center',
      'space-between': 'content-between',
      'space-around': 'content-around',
      'stretch': 'content-stretch',
    };
    return map[v] || null;
  },

  // Gap
  'gap': (v) => convertSpacing('gap', v),

  // Position
  'position': (v) => {
    const map: Record<string, string> = {
      'static': 'static',
      'relative': 'relative',
      'absolute': 'absolute',
      'fixed': 'fixed',
      'sticky': 'sticky',
    };
    return map[v] || null;
  },

  // Width
  'width': (v) => convertSize('w', v),
  'min-width': (v) => convertSize('min-w', v),
  'max-width': (v) => convertSize('max-w', v),

  // Height
  'height': (v) => convertSize('h', v),
  'min-height': (v) => convertSize('min-h', v),
  'max-height': (v) => convertSize('max-h', v),

  // Padding
  'padding': (v) => convertSpacing('p', v),
  'padding-top': (v) => convertSpacing('pt', v),
  'padding-right': (v) => convertSpacing('pr', v),
  'padding-bottom': (v) => convertSpacing('pb', v),
  'padding-left': (v) => convertSpacing('pl', v),

  // Margin
  'margin': (v) => convertSpacing('m', v),
  'margin-top': (v) => convertSpacing('mt', v),
  'margin-right': (v) => convertSpacing('mr', v),
  'margin-bottom': (v) => convertSpacing('mb', v),
  'margin-left': (v) => convertSpacing('ml', v),

  // Font Size
  'font-size': (v) => {
    const sizeMap: Record<string, string> = {
      '12px': 'text-xs',
      '14px': 'text-sm',
      '16px': 'text-base',
      '18px': 'text-lg',
      '20px': 'text-xl',
      '24px': 'text-2xl',
      '30px': 'text-3xl',
      '36px': 'text-4xl',
      '48px': 'text-5xl',
      '60px': 'text-6xl',
      '0.75rem': 'text-xs',
      '0.875rem': 'text-sm',
      '1rem': 'text-base',
      '1.125rem': 'text-lg',
      '1.25rem': 'text-xl',
      '1.5rem': 'text-2xl',
      '1.875rem': 'text-3xl',
      '2.25rem': 'text-4xl',
      '3rem': 'text-5xl',
      '3.75rem': 'text-6xl',
    };
    return sizeMap[v] || `text-[${v}]`;
  },

  // Font Weight
  'font-weight': (v) => {
    const map: Record<string, string> = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black',
      'normal': 'font-normal',
      'bold': 'font-bold',
    };
    return map[v] || null;
  },

  // Text Align
  'text-align': (v) => {
    const map: Record<string, string> = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
      'justify': 'text-justify',
    };
    return map[v] || null;
  },

  // Text Transform
  'text-transform': (v) => {
    const map: Record<string, string> = {
      'uppercase': 'uppercase',
      'lowercase': 'lowercase',
      'capitalize': 'capitalize',
      'none': 'normal-case',
    };
    return map[v] || null;
  },

  // Border Radius
  'border-radius': (v) => {
    const map: Record<string, string> = {
      '0': 'rounded-none',
      '2px': 'rounded-sm',
      '4px': 'rounded',
      '6px': 'rounded-md',
      '8px': 'rounded-lg',
      '12px': 'rounded-xl',
      '16px': 'rounded-2xl',
      '24px': 'rounded-3xl',
      '9999px': 'rounded-full',
      '50%': 'rounded-full',
    };
    return map[v] || `rounded-[${v}]`;
  },

  // Overflow
  'overflow': (v) => {
    const map: Record<string, string> = {
      'auto': 'overflow-auto',
      'hidden': 'overflow-hidden',
      'visible': 'overflow-visible',
      'scroll': 'overflow-scroll',
    };
    return map[v] || null;
  },

  // Cursor
  'cursor': (v) => {
    const map: Record<string, string> = {
      'pointer': 'cursor-pointer',
      'default': 'cursor-default',
      'wait': 'cursor-wait',
      'text': 'cursor-text',
      'move': 'cursor-move',
      'not-allowed': 'cursor-not-allowed',
      'grab': 'cursor-grab',
      'grabbing': 'cursor-grabbing',
    };
    return map[v] || null;
  },

  // Opacity
  'opacity': (v) => {
    const num = parseFloat(v);
    if (isNaN(num)) return null;
    const percentage = Math.round(num * 100);
    return `opacity-${percentage}`;
  },

  // Z-Index
  'z-index': (v) => {
    const map: Record<string, string> = {
      '0': 'z-0',
      '10': 'z-10',
      '20': 'z-20',
      '30': 'z-30',
      '40': 'z-40',
      '50': 'z-50',
      'auto': 'z-auto',
    };
    return map[v] || `z-[${v}]`;
  },

  // Background Color
  'background-color': (v) => convertColor('bg', v),

  // Text Color
  'color': (v) => convertColor('text', v),

  // Border Color
  'border-color': (v) => convertColor('border', v),

  // Border Width
  'border-width': (v) => {
    const map: Record<string, string> = {
      '0': 'border-0',
      '1px': 'border',
      '2px': 'border-2',
      '4px': 'border-4',
      '8px': 'border-8',
    };
    return map[v] || `border-[${v}]`;
  },

  // Border Style
  'border-style': (v) => {
    const map: Record<string, string> = {
      'solid': 'border-solid',
      'dashed': 'border-dashed',
      'dotted': 'border-dotted',
      'double': 'border-double',
      'hidden': 'border-hidden',
      'none': 'border-none',
    };
    return map[v] || null;
  },

  // Outline
  'outline': (v) => {
    if (v === 'none' || v === '0') return 'outline-none';
    return null;
  },

  'outline-width': (v) => {
    const map: Record<string, string> = {
      '0': 'outline-0',
      '1px': 'outline-1',
      '2px': 'outline-2',
      '4px': 'outline-4',
      '8px': 'outline-8',
    };
    return map[v] || `outline-[${v}]`;
  },

  'outline-style': (v) => {
    const map: Record<string, string> = {
      'none': 'outline-none',
      'solid': 'outline',
      'dashed': 'outline-dashed',
      'dotted': 'outline-dotted',
      'double': 'outline-double',
    };
    return map[v] || null;
  },

  'outline-offset': (v) => {
    const map: Record<string, string> = {
      '0': 'outline-offset-0',
      '1px': 'outline-offset-1',
      '2px': 'outline-offset-2',
      '4px': 'outline-offset-4',
      '8px': 'outline-offset-8',
    };
    return map[v] || `outline-offset-[${v}]`;
  },

  'outline-color': (v) => convertColor('outline', v),

  // Box Shadow
  'box-shadow': (v) => {
    if (v === 'none') return 'shadow-none';
    const shadowMap: Record<string, string> = {
      '0 1px 2px 0 rgb(0 0 0 / 0.05)': 'shadow-sm',
      '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)': 'shadow',
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)': 'shadow-md',
      '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)': 'shadow-lg',
      '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)': 'shadow-xl',
      '0 25px 50px -12px rgb(0 0 0 / 0.25)': 'shadow-2xl',
      'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)': 'shadow-inner',
    };
    return shadowMap[v] || `shadow-[${v.replace(/\s+/g, '_')}]`;
  },

  // Transitions
  'transition': (v) => {
    if (v === 'none') return 'transition-none';
    if (v.includes('all')) return 'transition-all';
    if (v.includes('color') || v.includes('background')) return 'transition-colors';
    if (v.includes('opacity')) return 'transition-opacity';
    if (v.includes('shadow')) return 'transition-shadow';
    if (v.includes('transform')) return 'transition-transform';
    return 'transition';
  },

  'transition-property': (v) => {
    const map: Record<string, string> = {
      'none': 'transition-none',
      'all': 'transition-all',
      'color, background-color, border-color, text-decoration-color, fill, stroke': 'transition-colors',
      'opacity': 'transition-opacity',
      'box-shadow': 'transition-shadow',
      'transform': 'transition-transform',
    };
    return map[v] || 'transition';
  },

  'transition-duration': (v) => {
    const map: Record<string, string> = {
      '0ms': 'duration-0',
      '0s': 'duration-0',
      '75ms': 'duration-75',
      '100ms': 'duration-100',
      '150ms': 'duration-150',
      '200ms': 'duration-200',
      '300ms': 'duration-300',
      '500ms': 'duration-500',
      '700ms': 'duration-700',
      '1000ms': 'duration-1000',
      '1s': 'duration-1000',
    };
    return map[v] || `duration-[${v}]`;
  },

  'transition-timing-function': (v) => {
    const map: Record<string, string> = {
      'linear': 'ease-linear',
      'ease': 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'cubic-bezier(0.4, 0, 0.2, 1)': 'ease-in-out',
      'cubic-bezier(0.4, 0, 1, 1)': 'ease-in',
      'cubic-bezier(0, 0, 0.2, 1)': 'ease-out',
    };
    return map[v] || `ease-[${v}]`;
  },

  'transition-delay': (v) => {
    const map: Record<string, string> = {
      '0ms': 'delay-0',
      '75ms': 'delay-75',
      '100ms': 'delay-100',
      '150ms': 'delay-150',
      '200ms': 'delay-200',
      '300ms': 'delay-300',
      '500ms': 'delay-500',
      '700ms': 'delay-700',
      '1000ms': 'delay-1000',
    };
    return map[v] || `delay-[${v}]`;
  },

  // Transforms
  'transform': (v) => {
    if (v === 'none') return 'transform-none';
    
    // Handle scale() function
    const scaleMatch = v.match(/scale\(([^)]+)\)/);
    if (scaleMatch) {
      const scaleValue = scaleMatch[1].trim();
      // Handle single value scale(x) or scale(x, y) where both are same
      const parts = scaleValue.split(',').map(s => s.trim());
      const num = parseFloat(parts[0]);
      if (!isNaN(num)) {
        const percentage = Math.round(num * 100);
        // Check for common Tailwind scale values
        const scaleMap: Record<number, string> = {
          0: 'scale-0',
          50: 'scale-50',
          75: 'scale-75',
          90: 'scale-90',
          95: 'scale-95',
          100: 'scale-100',
          105: 'scale-105',
          110: 'scale-110',
          125: 'scale-125',
          150: 'scale-150',
        };
        return scaleMap[percentage] || `scale-[${num}]`;
      }
    }
    
    // Handle rotate() function
    const rotateMatch = v.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
      const rotateValue = rotateMatch[1].trim();
      const rotateMap: Record<string, string> = {
        '0deg': 'rotate-0',
        '1deg': 'rotate-1',
        '2deg': 'rotate-2',
        '3deg': 'rotate-3',
        '6deg': 'rotate-6',
        '12deg': 'rotate-12',
        '45deg': 'rotate-45',
        '90deg': 'rotate-90',
        '180deg': 'rotate-180',
      };
      return rotateMap[rotateValue] || `rotate-[${rotateValue}]`;
    }
    
    // Handle translateX/translateY
    const translateXMatch = v.match(/translateX\(([^)]+)\)/);
    if (translateXMatch) {
      const value = translateXMatch[1].trim();
      return `translate-x-[${value}]`;
    }
    
    const translateYMatch = v.match(/translateY\(([^)]+)\)/);
    if (translateYMatch) {
      const value = translateYMatch[1].trim();
      return `translate-y-[${value}]`;
    }
    
    return null; // Complex transforms not handled
  },

  'scale': (v) => {
    const num = parseFloat(v);
    if (isNaN(num)) return null;
    const percentage = Math.round(num * 100);
    return `scale-${percentage}`;
  },

  'rotate': (v) => {
    const map: Record<string, string> = {
      '0deg': 'rotate-0',
      '1deg': 'rotate-1',
      '2deg': 'rotate-2',
      '3deg': 'rotate-3',
      '6deg': 'rotate-6',
      '12deg': 'rotate-12',
      '45deg': 'rotate-45',
      '90deg': 'rotate-90',
      '180deg': 'rotate-180',
    };
    return map[v] || `rotate-[${v}]`;
  },

  'translate': () => null, // Handled via translateX/Y

  // Animation
  'animation': (v) => {
    if (v === 'none') return 'animate-none';
    if (v.includes('spin')) return 'animate-spin';
    if (v.includes('ping')) return 'animate-ping';
    if (v.includes('pulse')) return 'animate-pulse';
    if (v.includes('bounce')) return 'animate-bounce';
    return null;
  },

  // Line Height
  'line-height': (v) => {
    const map: Record<string, string> = {
      '1': 'leading-none',
      '1.25': 'leading-tight',
      '1.375': 'leading-snug',
      '1.5': 'leading-normal',
      '1.625': 'leading-relaxed',
      '2': 'leading-loose',
      '12px': 'leading-3',
      '16px': 'leading-4',
      '20px': 'leading-5',
      '24px': 'leading-6',
      '28px': 'leading-7',
      '32px': 'leading-8',
      '36px': 'leading-9',
      '40px': 'leading-10',
    };
    return map[v] || `leading-[${v}]`;
  },

  // Letter Spacing
  'letter-spacing': (v) => {
    const map: Record<string, string> = {
      '-0.05em': 'tracking-tighter',
      '-0.025em': 'tracking-tight',
      '0': 'tracking-normal',
      '0em': 'tracking-normal',
      '0.025em': 'tracking-wide',
      '0.05em': 'tracking-wider',
      '0.1em': 'tracking-widest',
    };
    return map[v] || `tracking-[${v}]`;
  },

  // Text Decoration
  'text-decoration': (v) => {
    const map: Record<string, string> = {
      'underline': 'underline',
      'overline': 'overline',
      'line-through': 'line-through',
      'none': 'no-underline',
    };
    return map[v] || null;
  },

  'text-decoration-style': (v) => {
    const map: Record<string, string> = {
      'solid': 'decoration-solid',
      'double': 'decoration-double',
      'dotted': 'decoration-dotted',
      'dashed': 'decoration-dashed',
      'wavy': 'decoration-wavy',
    };
    return map[v] || null;
  },

  'text-decoration-color': (v) => convertColor('decoration', v),

  'text-underline-offset': (v) => {
    const map: Record<string, string> = {
      'auto': 'underline-offset-auto',
      '0': 'underline-offset-0',
      '1px': 'underline-offset-1',
      '2px': 'underline-offset-2',
      '4px': 'underline-offset-4',
      '8px': 'underline-offset-8',
    };
    return map[v] || `underline-offset-[${v}]`;
  },

  // White Space
  'white-space': (v) => {
    const map: Record<string, string> = {
      'normal': 'whitespace-normal',
      'nowrap': 'whitespace-nowrap',
      'pre': 'whitespace-pre',
      'pre-line': 'whitespace-pre-line',
      'pre-wrap': 'whitespace-pre-wrap',
      'break-spaces': 'whitespace-break-spaces',
    };
    return map[v] || null;
  },

  // Word Break
  'word-break': (v) => {
    const map: Record<string, string> = {
      'normal': 'break-normal',
      'break-all': 'break-all',
      'keep-all': 'break-keep',
    };
    return map[v] || null;
  },

  'overflow-wrap': (v) => {
    if (v === 'break-word') return 'break-words';
    return null;
  },

  // Text Overflow
  'text-overflow': (v) => {
    if (v === 'ellipsis') return 'text-ellipsis';
    if (v === 'clip') return 'text-clip';
    return null;
  },

  // Vertical Align
  'vertical-align': (v) => {
    const map: Record<string, string> = {
      'baseline': 'align-baseline',
      'top': 'align-top',
      'middle': 'align-middle',
      'bottom': 'align-bottom',
      'text-top': 'align-text-top',
      'text-bottom': 'align-text-bottom',
      'sub': 'align-sub',
      'super': 'align-super',
    };
    return map[v] || null;
  },

  // Visibility
  'visibility': (v) => {
    const map: Record<string, string> = {
      'visible': 'visible',
      'hidden': 'invisible',
      'collapse': 'collapse',
    };
    return map[v] || null;
  },

  // Pointer Events
  'pointer-events': (v) => {
    const map: Record<string, string> = {
      'none': 'pointer-events-none',
      'auto': 'pointer-events-auto',
    };
    return map[v] || null;
  },

  // User Select
  'user-select': (v) => {
    const map: Record<string, string> = {
      'none': 'select-none',
      'text': 'select-text',
      'all': 'select-all',
      'auto': 'select-auto',
    };
    return map[v] || null;
  },

  // Resize
  'resize': (v) => {
    const map: Record<string, string> = {
      'none': 'resize-none',
      'both': 'resize',
      'vertical': 'resize-y',
      'horizontal': 'resize-x',
    };
    return map[v] || null;
  },

  // Appearance
  'appearance': (v) => {
    if (v === 'none') return 'appearance-none';
    if (v === 'auto') return 'appearance-auto';
    return null;
  },

  // Object Fit
  'object-fit': (v) => {
    const map: Record<string, string> = {
      'contain': 'object-contain',
      'cover': 'object-cover',
      'fill': 'object-fill',
      'none': 'object-none',
      'scale-down': 'object-scale-down',
    };
    return map[v] || null;
  },

  // Object Position
  'object-position': (v) => {
    const map: Record<string, string> = {
      'center': 'object-center',
      'top': 'object-top',
      'bottom': 'object-bottom',
      'left': 'object-left',
      'right': 'object-right',
      'left top': 'object-left-top',
      'right top': 'object-right-top',
      'left bottom': 'object-left-bottom',
      'right bottom': 'object-right-bottom',
    };
    return map[v] || `object-[${v}]`;
  },

  // Flex properties
  'flex': (v) => {
    const map: Record<string, string> = {
      '1': 'flex-1',
      '1 1 0%': 'flex-1',
      'auto': 'flex-auto',
      '1 1 auto': 'flex-auto',
      'initial': 'flex-initial',
      '0 1 auto': 'flex-initial',
      'none': 'flex-none',
      '0 0 auto': 'flex-none',
    };
    return map[v] || `flex-[${v}]`;
  },

  'flex-grow': (v) => {
    if (v === '0') return 'grow-0';
    if (v === '1') return 'grow';
    return `grow-[${v}]`;
  },

  'flex-shrink': (v) => {
    if (v === '0') return 'shrink-0';
    if (v === '1') return 'shrink';
    return `shrink-[${v}]`;
  },

  'flex-basis': (v) => convertSize('basis', v),

  'order': (v) => {
    const map: Record<string, string> = {
      '-9999': 'order-first',
      '9999': 'order-last',
      '0': 'order-none',
      '1': 'order-1',
      '2': 'order-2',
      '3': 'order-3',
      '4': 'order-4',
      '5': 'order-5',
      '6': 'order-6',
      '7': 'order-7',
      '8': 'order-8',
      '9': 'order-9',
      '10': 'order-10',
      '11': 'order-11',
      '12': 'order-12',
    };
    return map[v] || `order-[${v}]`;
  },

  'align-self': (v) => {
    const map: Record<string, string> = {
      'auto': 'self-auto',
      'flex-start': 'self-start',
      'flex-end': 'self-end',
      'center': 'self-center',
      'stretch': 'self-stretch',
      'baseline': 'self-baseline',
    };
    return map[v] || null;
  },

  // Grid
  'grid-template-columns': (v) => {
    const match = v.match(/^repeat\((\d+),\s*minmax\(0,\s*1fr\)\)$/);
    if (match) return `grid-cols-${match[1]}`;
    if (v === 'none') return 'grid-cols-none';
    if (v === 'subgrid') return 'grid-cols-subgrid';
    return `grid-cols-[${v.replace(/\s+/g, '_')}]`;
  },

  'grid-template-rows': (v) => {
    const match = v.match(/^repeat\((\d+),\s*minmax\(0,\s*1fr\)\)$/);
    if (match) return `grid-rows-${match[1]}`;
    if (v === 'none') return 'grid-rows-none';
    if (v === 'subgrid') return 'grid-rows-subgrid';
    return `grid-rows-[${v.replace(/\s+/g, '_')}]`;
  },

  'grid-column': (v) => {
    const map: Record<string, string> = {
      'auto': 'col-auto',
      'span 1 / span 1': 'col-span-1',
      '1 / -1': 'col-span-full',
    };
    const spanMatch = v.match(/^span\s+(\d+)\s*\/\s*span\s+\d+$/);
    if (spanMatch) return `col-span-${spanMatch[1]}`;
    return map[v] || `col-[${v}]`;
  },

  'grid-row': (v) => {
    const map: Record<string, string> = {
      'auto': 'row-auto',
      'span 1 / span 1': 'row-span-1',
      '1 / -1': 'row-span-full',
    };
    const spanMatch = v.match(/^span\s+(\d+)\s*\/\s*span\s+\d+$/);
    if (spanMatch) return `row-span-${spanMatch[1]}`;
    return map[v] || `row-[${v}]`;
  },

  'place-content': (v) => {
    const map: Record<string, string> = {
      'center': 'place-content-center',
      'start': 'place-content-start',
      'end': 'place-content-end',
      'space-between': 'place-content-between',
      'space-around': 'place-content-around',
      'space-evenly': 'place-content-evenly',
      'stretch': 'place-content-stretch',
      'baseline': 'place-content-baseline',
    };
    return map[v] || null;
  },

  'place-items': (v) => {
    const map: Record<string, string> = {
      'center': 'place-items-center',
      'start': 'place-items-start',
      'end': 'place-items-end',
      'stretch': 'place-items-stretch',
      'baseline': 'place-items-baseline',
    };
    return map[v] || null;
  },

  'place-self': (v) => {
    const map: Record<string, string> = {
      'auto': 'place-self-auto',
      'center': 'place-self-center',
      'start': 'place-self-start',
      'end': 'place-self-end',
      'stretch': 'place-self-stretch',
    };
    return map[v] || null;
  },

  // Position (top, right, bottom, left)
  'top': (v) => convertSpacing('top', v),
  'right': (v) => convertSpacing('right', v),
  'bottom': (v) => convertSpacing('bottom', v),
  'left': (v) => convertSpacing('left', v),
  'inset': (v) => convertSpacing('inset', v),

  // Background
  'background-size': (v) => {
    const map: Record<string, string> = {
      'auto': 'bg-auto',
      'cover': 'bg-cover',
      'contain': 'bg-contain',
    };
    return map[v] || `bg-[size:${v}]`;
  },

  'background-position': (v) => {
    const map: Record<string, string> = {
      'center': 'bg-center',
      'top': 'bg-top',
      'bottom': 'bg-bottom',
      'left': 'bg-left',
      'right': 'bg-right',
      'left top': 'bg-left-top',
      'right top': 'bg-right-top',
      'left bottom': 'bg-left-bottom',
      'right bottom': 'bg-right-bottom',
    };
    return map[v] || `bg-[position:${v}]`;
  },

  'background-repeat': (v) => {
    const map: Record<string, string> = {
      'repeat': 'bg-repeat',
      'no-repeat': 'bg-no-repeat',
      'repeat-x': 'bg-repeat-x',
      'repeat-y': 'bg-repeat-y',
      'round': 'bg-repeat-round',
      'space': 'bg-repeat-space',
    };
    return map[v] || null;
  },

  'background-attachment': (v) => {
    const map: Record<string, string> = {
      'fixed': 'bg-fixed',
      'local': 'bg-local',
      'scroll': 'bg-scroll',
    };
    return map[v] || null;
  },

  'background-clip': (v) => {
    const map: Record<string, string> = {
      'border-box': 'bg-clip-border',
      'padding-box': 'bg-clip-padding',
      'content-box': 'bg-clip-content',
      'text': 'bg-clip-text',
    };
    return map[v] || null;
  },

  // Filter
  'filter': (v) => {
    if (v === 'none') return 'filter-none';
    return null;
  },

  'backdrop-filter': (v) => {
    if (v === 'none') return 'backdrop-filter-none';
    return null;
  },

  'blur': (v) => {
    const map: Record<string, string> = {
      '0': 'blur-none',
      '4px': 'blur-sm',
      '8px': 'blur',
      '12px': 'blur-md',
      '16px': 'blur-lg',
      '24px': 'blur-xl',
      '40px': 'blur-2xl',
      '64px': 'blur-3xl',
    };
    return map[v] || `blur-[${v}]`;
  },

  // Content (for before/after)
  'content': (v) => {
    if (v === 'none' || v === '""' || v === "''") return "content-['']";
    if (v === 'normal') return 'content-none';
    return `content-[${v}]`;
  },

  // Aspect Ratio
  'aspect-ratio': (v) => {
    const map: Record<string, string> = {
      'auto': 'aspect-auto',
      '1 / 1': 'aspect-square',
      '16 / 9': 'aspect-video',
      '4 / 3': 'aspect-[4/3]',
    };
    return map[v] || `aspect-[${v.replace(/\s*\/\s*/g, '/')}]`;
  },

  // Columns
  'columns': (v) => {
    const map: Record<string, string> = {
      '1': 'columns-1',
      '2': 'columns-2',
      '3': 'columns-3',
      '4': 'columns-4',
      '5': 'columns-5',
      '6': 'columns-6',
      '7': 'columns-7',
      '8': 'columns-8',
      '9': 'columns-9',
      '10': 'columns-10',
      '11': 'columns-11',
      '12': 'columns-12',
      'auto': 'columns-auto',
    };
    return map[v] || `columns-[${v}]`;
  },

  // Break
  'break-before': (v) => {
    const map: Record<string, string> = {
      'auto': 'break-before-auto',
      'avoid': 'break-before-avoid',
      'all': 'break-before-all',
      'avoid-page': 'break-before-avoid-page',
      'page': 'break-before-page',
      'left': 'break-before-left',
      'right': 'break-before-right',
      'column': 'break-before-column',
    };
    return map[v] || null;
  },

  'break-after': (v) => {
    const map: Record<string, string> = {
      'auto': 'break-after-auto',
      'avoid': 'break-after-avoid',
      'all': 'break-after-all',
      'avoid-page': 'break-after-avoid-page',
      'page': 'break-after-page',
      'left': 'break-after-left',
      'right': 'break-after-right',
      'column': 'break-after-column',
    };
    return map[v] || null;
  },

  'break-inside': (v) => {
    const map: Record<string, string> = {
      'auto': 'break-inside-auto',
      'avoid': 'break-inside-avoid',
      'avoid-page': 'break-inside-avoid-page',
      'avoid-column': 'break-inside-avoid-column',
    };
    return map[v] || null;
  },

  // List Style
  'list-style-type': (v) => {
    const map: Record<string, string> = {
      'none': 'list-none',
      'disc': 'list-disc',
      'decimal': 'list-decimal',
    };
    return map[v] || `list-[${v}]`;
  },

  'list-style-position': (v) => {
    const map: Record<string, string> = {
      'inside': 'list-inside',
      'outside': 'list-outside',
    };
    return map[v] || null;
  },

  // Scroll
  'scroll-behavior': (v) => {
    const map: Record<string, string> = {
      'auto': 'scroll-auto',
      'smooth': 'scroll-smooth',
    };
    return map[v] || null;
  },

  'scroll-margin': (v) => convertSpacing('scroll-m', v),
  'scroll-padding': (v) => convertSpacing('scroll-p', v),

  'scroll-snap-align': (v) => {
    const map: Record<string, string> = {
      'start': 'snap-start',
      'end': 'snap-end',
      'center': 'snap-center',
      'none': 'snap-align-none',
    };
    return map[v] || null;
  },

  'scroll-snap-type': (v) => {
    if (v.includes('x mandatory')) return 'snap-x snap-mandatory';
    if (v.includes('y mandatory')) return 'snap-y snap-mandatory';
    if (v.includes('x proximity')) return 'snap-x snap-proximity';
    if (v.includes('y proximity')) return 'snap-y snap-proximity';
    if (v.includes('both mandatory')) return 'snap-both snap-mandatory';
    if (v === 'none') return 'snap-none';
    return null;
  },

  // Touch Action
  'touch-action': (v) => {
    const map: Record<string, string> = {
      'auto': 'touch-auto',
      'none': 'touch-none',
      'pan-x': 'touch-pan-x',
      'pan-y': 'touch-pan-y',
      'pan-left': 'touch-pan-left',
      'pan-right': 'touch-pan-right',
      'pan-up': 'touch-pan-up',
      'pan-down': 'touch-pan-down',
      'pinch-zoom': 'touch-pinch-zoom',
      'manipulation': 'touch-manipulation',
    };
    return map[v] || null;
  },

  // Will Change
  'will-change': (v) => {
    const map: Record<string, string> = {
      'auto': 'will-change-auto',
      'scroll-position': 'will-change-scroll',
      'contents': 'will-change-contents',
      'transform': 'will-change-transform',
    };
    return map[v] || `will-change-[${v}]`;
  },

  // Mix Blend Mode
  'mix-blend-mode': (v) => {
    const map: Record<string, string> = {
      'normal': 'mix-blend-normal',
      'multiply': 'mix-blend-multiply',
      'screen': 'mix-blend-screen',
      'overlay': 'mix-blend-overlay',
      'darken': 'mix-blend-darken',
      'lighten': 'mix-blend-lighten',
      'color-dodge': 'mix-blend-color-dodge',
      'color-burn': 'mix-blend-color-burn',
      'hard-light': 'mix-blend-hard-light',
      'soft-light': 'mix-blend-soft-light',
      'difference': 'mix-blend-difference',
      'exclusion': 'mix-blend-exclusion',
      'hue': 'mix-blend-hue',
      'saturation': 'mix-blend-saturation',
      'color': 'mix-blend-color',
      'luminosity': 'mix-blend-luminosity',
      'plus-lighter': 'mix-blend-plus-lighter',
    };
    return map[v] || null;
  },

  'background-blend-mode': (v) => {
    const map: Record<string, string> = {
      'normal': 'bg-blend-normal',
      'multiply': 'bg-blend-multiply',
      'screen': 'bg-blend-screen',
      'overlay': 'bg-blend-overlay',
      'darken': 'bg-blend-darken',
      'lighten': 'bg-blend-lighten',
      'color-dodge': 'bg-blend-color-dodge',
      'color-burn': 'bg-blend-color-burn',
      'hard-light': 'bg-blend-hard-light',
      'soft-light': 'bg-blend-soft-light',
      'difference': 'bg-blend-difference',
      'exclusion': 'bg-blend-exclusion',
      'hue': 'bg-blend-hue',
      'saturation': 'bg-blend-saturation',
      'color': 'bg-blend-color',
      'luminosity': 'bg-blend-luminosity',
    };
    return map[v] || null;
  },

  // Accent Color
  'accent-color': (v) => {
    if (v === 'auto') return 'accent-auto';
    return convertColor('accent', v);
  },

  // Caret Color
  'caret-color': (v) => convertColor('caret', v),

  // Fill & Stroke (for SVG)
  'fill': (v) => {
    if (v === 'none') return 'fill-none';
    return convertColor('fill', v);
  },

  'stroke': (v) => {
    if (v === 'none') return 'stroke-none';
    return convertColor('stroke', v);
  },

  'stroke-width': (v) => {
    const map: Record<string, string> = {
      '0': 'stroke-0',
      '1': 'stroke-1',
      '2': 'stroke-2',
    };
    return map[v] || `stroke-[${v}]`;
  },

  // Table
  'border-collapse': (v) => {
    const map: Record<string, string> = {
      'collapse': 'border-collapse',
      'separate': 'border-separate',
    };
    return map[v] || null;
  },

  'border-spacing': (v) => convertSpacing('border-spacing', v),

  'table-layout': (v) => {
    const map: Record<string, string> = {
      'auto': 'table-auto',
      'fixed': 'table-fixed',
    };
    return map[v] || null;
  },

  'caption-side': (v) => {
    const map: Record<string, string> = {
      'top': 'caption-top',
      'bottom': 'caption-bottom',
    };
    return map[v] || null;
  },

  // Isolation
  'isolation': (v) => {
    const map: Record<string, string> = {
      'isolate': 'isolate',
      'auto': 'isolation-auto',
    };
    return map[v] || null;
  },

  // Hyphens
  'hyphens': (v) => {
    const map: Record<string, string> = {
      'none': 'hyphens-none',
      'manual': 'hyphens-manual',
      'auto': 'hyphens-auto',
    };
    return map[v] || null;
  },

  // Forced Color Adjust
  'forced-color-adjust': (v) => {
    const map: Record<string, string> = {
      'auto': 'forced-color-adjust-auto',
      'none': 'forced-color-adjust-none',
    };
    return map[v] || null;
  },
};

function convertSpacing(prefix: string, value: string): string | null {
  const spacingMap: Record<string, string> = {
    '0': '0',
    '1px': 'px',
    '2px': '0.5',
    '4px': '1',
    '6px': '1.5',
    '8px': '2',
    '10px': '2.5',
    '12px': '3',
    '14px': '3.5',
    '16px': '4',
    '20px': '5',
    '24px': '6',
    '28px': '7',
    '32px': '8',
    '36px': '9',
    '40px': '10',
    '44px': '11',
    '48px': '12',
    '56px': '14',
    '64px': '16',
    '80px': '20',
    '96px': '24',
    '0.25rem': '1',
    '0.5rem': '2',
    '0.75rem': '3',
    '1rem': '4',
    '1.25rem': '5',
    '1.5rem': '6',
    '2rem': '8',
    '2.5rem': '10',
    '3rem': '12',
    '4rem': '16',
    '5rem': '20',
    '6rem': '24',
    'auto': 'auto',
  };

  const mapped = spacingMap[value];
  if (mapped) return `${prefix}-${mapped}`;
  return `${prefix}-[${value}]`;
}

function convertSize(prefix: string, value: string): string | null {
  const sizeMap: Record<string, string> = {
    '100%': 'full',
    '100vw': 'screen',
    '100vh': 'screen',
    'auto': 'auto',
    'min-content': 'min',
    'max-content': 'max',
    'fit-content': 'fit',
    '50%': '1/2',
    '33.333333%': '1/3',
    '66.666667%': '2/3',
    '25%': '1/4',
    '75%': '3/4',
  };

  const mapped = sizeMap[value];
  if (mapped) return `${prefix}-${mapped}`;
  
  // Check for common pixel/rem values
  const spacingResult = convertSpacing(prefix, value);
  if (spacingResult && !spacingResult.includes('[')) return spacingResult;
  
  return `${prefix}-[${value}]`;
}

function convertColor(prefix: string, value: string): string | null {
  const colorMap: Record<string, string> = {
    'transparent': 'transparent',
    'currentColor': 'current',
    'inherit': 'inherit',
    'white': 'white',
    'black': 'black',
    '#fff': 'white',
    '#ffffff': 'white',
    '#000': 'black',
    '#000000': 'black',
  };

  const mapped = colorMap[value.toLowerCase()];
  if (mapped) return `${prefix}-${mapped}`;
  
  // Return arbitrary value for other colors
  return `${prefix}-[${value}]`;
}

interface ParsedRule {
  property: string;
  value: string;
  modifiers: string[];
}

interface CssRuleBlock {
  selector: string;
  declarations: Array<{ property: string; value: string }>;
  mediaQuery?: string;
}

function extractModifiersFromSelector(selector: string): string[] {
  const modifiers: string[] = [];
  const matchedPositions: Set<number> = new Set();
  
  // Extract pseudo-elements (::before, ::after, etc.)
  // Sort by length descending to match longer patterns first (:: before :)
  const sortedPseudoElements = Object.entries(pseudoElementMap).sort(
    (a, b) => b[0].length - a[0].length
  );
  
  for (const [pseudo, modifier] of sortedPseudoElements) {
    const index = selector.indexOf(pseudo);
    if (index !== -1 && !matchedPositions.has(index) && !modifiers.includes(modifier)) {
      modifiers.push(modifier);
      // Mark all character positions as matched to prevent substring matches
      for (let i = index; i < index + pseudo.length; i++) {
        matchedPositions.add(i);
      }
    }
  }
  
  // Extract pseudo-classes (:hover, :focus, etc.)
  // Sort by length descending to match longer patterns first (e.g., :focus-visible before :focus)
  const sortedPseudoClasses = Object.entries(pseudoClassMap).sort(
    (a, b) => b[0].length - a[0].length
  );
  
  for (const [pseudo, modifier] of sortedPseudoClasses) {
    const index = selector.indexOf(pseudo);
    if (index !== -1 && !matchedPositions.has(index) && !modifiers.includes(modifier)) {
      // Make sure it's not followed by more alphanumeric/hyphen characters
      const afterIndex = index + pseudo.length;
      const charAfter = selector[afterIndex];
      if (!charAfter || !/[a-z-]/i.test(charAfter)) {
        modifiers.push(modifier);
        for (let i = index; i < index + pseudo.length; i++) {
          matchedPositions.add(i);
        }
      }
    }
  }
  
  return modifiers;
}

function parseMediaQuery(query: string): string | null {
  const normalized = query.trim().toLowerCase();
  
  for (const [mediaQuery, modifier] of Object.entries(mediaQueryMap)) {
    if (normalized.includes(mediaQuery.toLowerCase())) {
      return modifier;
    }
  }
  
  return null;
}

function parseCssBlocks(css: string): CssRuleBlock[] {
  const blocks: CssRuleBlock[] = [];
  
  // Remove comments
  let cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Handle @media queries with proper brace matching
  // This regex handles one level of nesting: @media { selector { declarations } }
  const mediaRegex = /@media\s*([^{]+)\s*\{((?:[^{}]*|\{[^{}]*\})*)\}/g;
  let mediaMatch;
  
  while ((mediaMatch = mediaRegex.exec(cleanCss)) !== null) {
    const mediaQuery = mediaMatch[1].trim();
    const mediaContent = mediaMatch[2];
    
    // Parse rules inside media query
    const innerBlocks = parseCssRuleBlocks(mediaContent);
    innerBlocks.forEach(block => {
      block.mediaQuery = mediaQuery;
      blocks.push(block);
    });
  }
  
  // Remove media queries from CSS to parse remaining rules
  cleanCss = cleanCss.replace(mediaRegex, '');
  
  // Parse regular rules
  const regularBlocks = parseCssRuleBlocks(cleanCss);
  blocks.push(...regularBlocks);
  
  return blocks;
}

function parseCssRuleBlocks(css: string): CssRuleBlock[] {
  const blocks: CssRuleBlock[] = [];
  
  // Match selector { declarations }
  const ruleRegex = /([^{]+)\{([^}]*)\}/g;
  let match;
  
  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarationsStr = match[2].trim();
    
    const declarations: Array<{ property: string; value: string }> = [];
    
    // Split declarations by semicolon
    const declParts = declarationsStr.split(';').filter(d => d.trim());
    
    for (const decl of declParts) {
      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) continue;
      
      const property = decl.slice(0, colonIndex).trim().toLowerCase();
      const value = decl.slice(colonIndex + 1).trim();
      
      if (property && value) {
        declarations.push({ property, value });
      }
    }
    
    if (declarations.length > 0) {
      blocks.push({ selector, declarations });
    }
  }
  
  // Handle inline declarations (no selector)
  if (blocks.length === 0 && css.includes(':')) {
    const declarations: Array<{ property: string; value: string }> = [];
    const declParts = css.split(';').filter(d => d.trim() && d.includes(':'));
    
    for (const decl of declParts) {
      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) continue;
      
      const property = decl.slice(0, colonIndex).trim().toLowerCase();
      const value = decl.slice(colonIndex + 1).trim();
      
      if (property && value) {
        declarations.push({ property, value });
      }
    }
    
    if (declarations.length > 0) {
      blocks.push({ selector: '', declarations });
    }
  }
  
  return blocks;
}

function parseCss(css: string): ParsedRule[] {
  const rules: ParsedRule[] = [];
  const blocks = parseCssBlocks(css);
  
  for (const block of blocks) {
    const modifiers: string[] = [];
    
    // Extract modifiers from selector
    if (block.selector) {
      modifiers.push(...extractModifiersFromSelector(block.selector));
    }
    
    // Extract modifier from media query
    if (block.mediaQuery) {
      const mediaModifier = parseMediaQuery(block.mediaQuery);
      if (mediaModifier) {
        modifiers.unshift(mediaModifier); // Media queries come first
      }
    }
    
    for (const { property, value } of block.declarations) {
      rules.push({ property, value, modifiers: [...modifiers] });
    }
  }
  
  return rules;
}

function convertToTailwind(css: string): { classes: string[]; unconverted: string[] } {
  const rules = parseCss(css);
  const classes: string[] = [];
  const unconverted: string[] = [];

  for (const { property, value, modifiers } of rules) {
    const converter = cssToTailwindMap[property];
    
    if (converter) {
      const result = converter(value);
      if (result) {
        // Apply modifiers (e.g., hover:, focus:, md:, etc.)
        if (modifiers.length > 0) {
          const prefix = modifiers.join(':') + ':';
          // Handle multiple classes in result (e.g., "snap-x snap-mandatory")
          const resultClasses = result.split(' ');
          for (const cls of resultClasses) {
            classes.push(prefix + cls);
          }
        } else {
          // Handle multiple classes in result
          const resultClasses = result.split(' ');
          classes.push(...resultClasses);
        }
      } else {
        const modifierStr = modifiers.length > 0 ? `[${modifiers.join(':')}] ` : '';
        unconverted.push(`${modifierStr}${property}: ${value}`);
      }
    } else {
      const modifierStr = modifiers.length > 0 ? `[${modifiers.join(':')}] ` : '';
      unconverted.push(`${modifierStr}${property}: ${value}`);
    }
  }

  return { classes, unconverted };
}

const sampleCss = `.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition-duration: 300ms;
}

.button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}

.button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.button:active {
  transform: scale(0.95);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
}

@media (min-width: 768px) {
  .container {
    display: grid;
    gap: 24px;
  }
}`;

export default function CssToTailwindPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(sampleCss);

  const result = useMemo(() => {
    return convertToTailwind(input);
  }, [input]);

  const tailwindOutput = result.classes.join(' ');

  return (
    <ToolLayout
      title="CSS to Tailwind"
      description="Convert CSS styles to Tailwind CSS utility classes. Supports common CSS properties with intelligent mapping."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">CSS Input</h3>
            <button
              onClick={() => setInput('')}
              className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            className="
              w-full h-[300px] lg:h-[400px] p-4 bg-slate-900/60 border border-slate-700/60
              rounded-xl text-white font-mono text-sm resize-none
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
        </div>

        {/* Output */}
        <div className="space-y-4 lg:space-y-6">
          {/* Tailwind Classes */}
          <div className="space-y-3 lg:space-y-4">
            <h3 className="text-sm font-medium text-slate-300">Tailwind Classes</h3>
            <CodeOutput 
              code={tailwindOutput || '// Enter CSS to convert'} 
              language="text" 
            />
          </div>

          {/* Preview */}
          {result.classes.length > 0 && (
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-sm font-medium text-slate-300">Class Preview</h3>
              <div className="flex flex-wrap gap-2">
                {result.classes.map((cls, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-xs text-cyan-300 font-mono break-all"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Unconverted */}
          {result.unconverted.length > 0 && (
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-sm font-medium text-amber-400">
                Unconverted Properties ({result.unconverted.length})
              </h3>
              <div className="p-3 sm:p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl">
                <ul className="space-y-1 text-sm text-amber-300 font-mono break-all">
                  {result.unconverted.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-amber-400/80">
                  These properties may need custom CSS or Tailwind arbitrary values.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supported Features */}
      <div className="mt-8 space-y-6">
        {/* Pseudo-classes & Pseudo-elements */}
        <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Pseudo-classes & Pseudo-elements</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">State Modifiers</h4>
              <ul className="text-slate-400 space-y-1">
                <li>:hover → hover:</li>
                <li>:focus → focus:</li>
                <li>:active → active:</li>
                <li>:disabled → disabled:</li>
                <li>:focus-visible → focus-visible:</li>
                <li>:focus-within → focus-within:</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Child Selectors</h4>
              <ul className="text-slate-400 space-y-1">
                <li>:first-child → first:</li>
                <li>:last-child → last:</li>
                <li>:odd → odd:</li>
                <li>:even → even:</li>
                <li>:empty → empty:</li>
                <li>:only-child → only:</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Pseudo-elements</h4>
              <ul className="text-slate-400 space-y-1">
                <li>::before → before:</li>
                <li>::after → after:</li>
                <li>::placeholder → placeholder:</li>
                <li>::selection → selection:</li>
                <li>::marker → marker:</li>
                <li>::first-line → first-line:</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Form States</h4>
              <ul className="text-slate-400 space-y-1">
                <li>:checked → checked:</li>
                <li>:required → required:</li>
                <li>:valid → valid:</li>
                <li>:invalid → invalid:</li>
                <li>:read-only → read-only:</li>
                <li>:placeholder-shown → placeholder-shown:</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Media Queries</h4>
              <ul className="text-slate-400 space-y-1">
                <li>@media (min-width: 640px) → sm:</li>
                <li>@media (min-width: 768px) → md:</li>
                <li>@media (min-width: 1024px) → lg:</li>
                <li>@media (min-width: 1280px) → xl:</li>
                <li>@media (prefers-color-scheme: dark) → dark:</li>
                <li>@media print → print:</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Accessibility</h4>
              <ul className="text-slate-400 space-y-1">
                <li>motion-reduce:</li>
                <li>motion-safe:</li>
                <li>contrast-more:</li>
                <li>portrait:</li>
                <li>landscape:</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supported Properties */}
        <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Supported Properties</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Layout</h4>
              <ul className="text-slate-400 space-y-1">
                <li>display</li>
                <li>position</li>
                <li>overflow</li>
                <li>z-index</li>
                <li>visibility</li>
                <li>isolation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Flexbox</h4>
              <ul className="text-slate-400 space-y-1">
                <li>flex / flex-grow / shrink</li>
                <li>flex-direction / wrap</li>
                <li>justify-content</li>
                <li>align-items / content / self</li>
                <li>gap</li>
                <li>order</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Grid</h4>
              <ul className="text-slate-400 space-y-1">
                <li>grid-template-columns</li>
                <li>grid-template-rows</li>
                <li>grid-column / row</li>
                <li>place-content / items / self</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Sizing</h4>
              <ul className="text-slate-400 space-y-1">
                <li>width / height</li>
                <li>min-* / max-*</li>
                <li>aspect-ratio</li>
                <li>columns</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Spacing</h4>
              <ul className="text-slate-400 space-y-1">
                <li>padding / margin</li>
                <li>top / right / bottom / left</li>
                <li>inset</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Typography</h4>
              <ul className="text-slate-400 space-y-1">
                <li>font-size / weight</li>
                <li>text-align / transform</li>
                <li>line-height</li>
                <li>letter-spacing</li>
                <li>text-decoration</li>
                <li>white-space / word-break</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Borders</h4>
              <ul className="text-slate-400 space-y-1">
                <li>border-width / style / color</li>
                <li>border-radius</li>
                <li>outline-*</li>
                <li>border-collapse / spacing</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Effects</h4>
              <ul className="text-slate-400 space-y-1">
                <li>box-shadow</li>
                <li>opacity</li>
                <li>mix-blend-mode</li>
                <li>filter / blur</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Transitions</h4>
              <ul className="text-slate-400 space-y-1">
                <li>transition / property</li>
                <li>transition-duration</li>
                <li>transition-timing-function</li>
                <li>transition-delay</li>
                <li>animation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Transforms</h4>
              <ul className="text-slate-400 space-y-1">
                <li>transform</li>
                <li>scale</li>
                <li>rotate</li>
                <li>will-change</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Background</h4>
              <ul className="text-slate-400 space-y-1">
                <li>background-color</li>
                <li>background-size / position</li>
                <li>background-repeat</li>
                <li>background-clip</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Interactivity</h4>
              <ul className="text-slate-400 space-y-1">
                <li>cursor</li>
                <li>pointer-events</li>
                <li>user-select</li>
                <li>resize</li>
                <li>touch-action</li>
                <li>scroll-behavior</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">SVG</h4>
              <ul className="text-slate-400 space-y-1">
                <li>fill</li>
                <li>stroke</li>
                <li>stroke-width</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-300 font-medium mb-2">Other</h4>
              <ul className="text-slate-400 space-y-1">
                <li>content (::before/after)</li>
                <li>object-fit / position</li>
                <li>list-style-*</li>
                <li>table-layout</li>
                <li>accent-color / caret-color</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
