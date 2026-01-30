import { lazy, type LazyExoticComponent } from 'react';
import type { ToolPageComponent } from '@/types/tools';
import { tools } from '@/config/tools';

/** Lazy-loaded tool page components keyed by tool id (slug). */
export const toolPageRegistry: Record<string, LazyExoticComponent<ToolPageComponent>> = {
  'base64': lazy(() => import('./base64')),
  'border-radius': lazy(() => import('./border-radius')),
  'case-converter': lazy(() => import('./case-converter')),
  'code-formatter': lazy(() => import('./code-formatter')),
  'code-minifier': lazy(() => import('./code-minifier')),
  'color-palette': lazy(() => import('./color-palette')),
  'cron-generator': lazy(() => import('./cron-generator')),
  'css-animations': lazy(() => import('./css-animations')),
  'css-letter-spacing': lazy(() => import('./css-letter-spacing')),
  'css-to-tailwind': lazy(() => import('./css-to-tailwind')),
  'css-unit-converter': lazy(() => import('./css-unit-converter')),
  'diff-checker': lazy(() => import('./diff-checker')),
  'favicon-generator': lazy(() => import('./favicon-generator')),
  'gradient-generator': lazy(() => import('./gradient-generator')),
  'hash-generator': lazy(() => import('./hash-generator')),
  'image-compressor': lazy(() => import('./image-compressor')),
  'image-resizer': lazy(() => import('./image-resizer')),
  'json-to-typescript': lazy(() => import('./json-to-typescript')),
  'lorem-ipsum': lazy(() => import('./lorem-ipsum')),
  'markdown-to-html': lazy(() => import('./markdown-to-html')),
  'password-generator': lazy(() => import('./password-generator')),
  'pdf-merger': lazy(() => import('./pdf-merger')),
  'placeholder-image': lazy(() => import('./placeholder-image')),
  'qr-code': lazy(() => import('./qr-code')),
  'regex-tester': lazy(() => import('./regex-tester')),
  'shadow-generator': lazy(() => import('./shadow-generator')),
  'slug-generator': lazy(() => import('./slug-generator')),
  'sprite-css': lazy(() => import('./sprite-css')),
  'svg-to-react': lazy(() => import('./svg-to-react')),
  'tailwind-class-sorter': lazy(() => import('./tailwind-class-sorter')),
  'tailwind-colors': lazy(() => import('./tailwind-colors')),
  'timestamp-converter': lazy(() => import('./timestamp-converter')),
  'uuid-generator': lazy(() => import('./uuid-generator')),
  'word-counter': lazy(() => import('./word-counter')),
  'json-formatter': lazy(() => import('./json-formatter')),
  'jwt-decoder': lazy(() => import('./jwt-decoder')),
  'url-encoder': lazy(() => import('./url-encoder')),
  'contrast-checker': lazy(() => import('./contrast-checker')),
  'meta-tags': lazy(() => import('./meta-tags')),
  'escape-unescape': lazy(() => import('./escape-unescape')),
};

/** All tool slugs for generateStaticParams. */
export const toolSlugs = tools.map((t) => t.id);
