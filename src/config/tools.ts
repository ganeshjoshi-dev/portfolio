import { Tool, ToolCategory, ToolCategoryConfig } from '@/types/tools';

export const toolCategories: Record<ToolCategory, ToolCategoryConfig> = {
  css: {
    name: 'CSS & Visual',
    icon: 'Palette',
    slug: 'css',
    description: 'Generate beautiful CSS styles, gradients, shadows, and more',
  },
  converters: {
    name: 'Converters',
    icon: 'ArrowLeftRight',
    slug: 'converters',
    description: 'Convert between different formats and languages',
  },
  utilities: {
    name: 'Utilities',
    icon: 'Wrench',
    slug: 'utilities',
    description: 'Handy utilities for everyday development tasks',
  },
  tailwind: {
    name: 'Tailwind CSS',
    icon: 'Wind',
    slug: 'tailwind',
    description: 'Tools specifically designed for Tailwind CSS workflows',
  },
} as const;

export const tools: Tool[] = [
  // CSS & Visual Tools
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Create beautiful CSS gradients with modern color spaces and Tailwind export',
    category: 'css',
    path: '/tools/gradient-generator',
    icon: 'Paintbrush',
    isNew: true,
    keywords: ['gradient', 'css', 'background', 'linear', 'radial', 'conic'],
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    description: 'Generate harmonious color palettes with accessibility checks',
    category: 'css',
    path: '/tools/color-palette',
    icon: 'Palette',
    isNew: true,
    keywords: ['color', 'palette', 'harmony', 'complementary', 'analogous'],
  },
  {
    id: 'shadow-generator',
    name: 'Shadow Generator',
    description: 'Create layered box shadows with CSS and Tailwind output',
    category: 'css',
    path: '/tools/shadow-generator',
    icon: 'Square',
    keywords: ['shadow', 'box-shadow', 'css', 'drop-shadow'],
  },
  {
    id: 'border-radius',
    name: 'Border Radius Generator',
    description: 'Design custom border radius with asymmetric corners',
    category: 'css',
    path: '/tools/border-radius',
    icon: 'RectangleHorizontal',
    keywords: ['border', 'radius', 'rounded', 'corners'],
  },
  {
    id: 'sprite-css',
    name: 'Sprite CSS Generator',
    description: 'Extract CSS from sprite sheets with visual selection',
    category: 'css',
    path: '/tools/sprite-css',
    icon: 'Grid3X3',
    isNew: true,
    keywords: ['sprite', 'spritesheet', 'css', 'background-position', 'image'],
  },

  // Converter Tools
  {
    id: 'json-to-typescript',
    name: 'JSON to TypeScript',
    description: 'Convert JSON to TypeScript interfaces and types',
    category: 'converters',
    path: '/tools/json-to-typescript',
    icon: 'FileJson',
    isNew: true,
    keywords: ['json', 'typescript', 'interface', 'types', 'convert'],
  },
  {
    id: 'css-to-tailwind',
    name: 'CSS to Tailwind',
    description: 'Convert CSS styles to Tailwind utility classes',
    category: 'converters',
    path: '/tools/css-to-tailwind',
    icon: 'Code',
    keywords: ['css', 'tailwind', 'convert', 'classes'],
  },
  {
    id: 'svg-to-react',
    name: 'SVG to React',
    description: 'Convert SVG to React/JSX components with TypeScript support',
    category: 'converters',
    path: '/tools/svg-to-react',
    icon: 'FileCode',
    keywords: ['svg', 'react', 'jsx', 'component', 'convert'],
  },
  {
    id: 'px-to-rem',
    name: 'Pixels to REM',
    description: 'Convert pixel values to REM units with custom base size',
    category: 'converters',
    path: '/tools/px-to-rem',
    icon: 'Ruler',
    keywords: ['px', 'rem', 'pixels', 'convert', 'units'],
  },

  // Utility Tools
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live matching and explanations',
    category: 'utilities',
    path: '/tools/regex-tester',
    icon: 'Regex',
    keywords: ['regex', 'regular expression', 'pattern', 'match', 'test'],
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with image support',
    category: 'utilities',
    path: '/tools/base64',
    icon: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'image', 'data-url'],
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUIDs in bulk with version selection',
    category: 'utilities',
    path: '/tools/uuid-generator',
    icon: 'Fingerprint',
    keywords: ['uuid', 'guid', 'unique', 'identifier', 'generate'],
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text with dev-themed variants',
    category: 'utilities',
    path: '/tools/lorem-ipsum',
    icon: 'Type',
    keywords: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'],
  },
  {
    id: 'slug-generator',
    name: 'Slug Generator',
    description: 'Generate URL-safe slugs in multiple formats',
    category: 'utilities',
    path: '/tools/slug-generator',
    icon: 'Link',
    keywords: ['slug', 'url', 'kebab', 'snake', 'camel'],
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Compare two texts and highlight the differences',
    category: 'utilities',
    path: '/tools/diff-checker',
    icon: 'FileDiff',
    keywords: ['diff', 'compare', 'difference', 'text', 'merge'],
  },

  // Tailwind Tools
  {
    id: 'tailwind-colors',
    name: 'Tailwind Color Shades',
    description: 'Generate full 50-950 color scale from any color',
    category: 'tailwind',
    path: '/tools/tailwind-colors',
    icon: 'Droplets',
    isNew: true,
    keywords: ['tailwind', 'color', 'shades', 'palette', 'scale'],
  },
  {
    id: 'tailwind-class-sorter',
    name: 'Tailwind Class Sorter',
    description: 'Sort Tailwind classes in recommended order',
    category: 'tailwind',
    path: '/tools/tailwind-class-sorter',
    icon: 'ArrowUpDown',
    keywords: ['tailwind', 'sort', 'order', 'classes', 'prettier'],
  },
];

// Helper functions
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolByPath(path: string): Tool | undefined {
  return tools.find((tool) => tool.path === path);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.keywords?.some((keyword) => keyword.includes(lowerQuery))
  );
}

export function getNewTools(): Tool[] {
  return tools.filter((tool) => tool.isNew);
}
