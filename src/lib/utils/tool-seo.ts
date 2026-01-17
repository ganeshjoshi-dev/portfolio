import type { Metadata } from 'next';
import { Tool, ToolCategoryConfig } from '@/types/tools';
import { siteConfig } from './seo';

/**
 * Enhanced SEO configuration for tools
 * This includes long-tail keywords and search-optimized descriptions
 */
export interface ToolSEOConfig {
  /** Primary title for search results */
  title: string;
  /** Meta description optimized for CTR (150-160 chars) */
  metaDescription: string;
  /** Long-tail keywords for better search targeting */
  longTailKeywords: string[];
  /** FAQ items for structured data */
  faqs?: Array<{ question: string; answer: string }>;
  /** Alternative names/search terms */
  alternateNames?: string[];
}

/**
 * Enhanced SEO data for each tool
 * Optimized for search intent and long-tail keywords
 */
export const toolSEOData: Record<string, ToolSEOConfig> = {
  'gradient-generator': {
    title: 'CSS Gradient Generator - Create Beautiful Gradients Online',
    metaDescription: 'Free online CSS gradient generator. Create linear, radial, and conic gradients with live preview. Export to CSS or Tailwind classes instantly.',
    longTailKeywords: [
      'css gradient generator online',
      'gradient maker tool',
      'tailwind gradient generator',
      'linear gradient creator',
      'radial gradient generator',
      'conic gradient maker',
      'css background gradient',
      'gradient color picker',
      'create css gradients online free',
      'gradient to tailwind converter',
    ],
    faqs: [
      {
        question: 'How do I create a CSS gradient?',
        answer: 'Use our gradient generator to pick colors, adjust angles, and get instant CSS code. Choose from linear, radial, or conic gradient types.',
      },
      {
        question: 'Can I export gradients to Tailwind CSS?',
        answer: 'Yes! Our tool automatically generates both standard CSS and Tailwind CSS classes for your gradient.',
      },
    ],
    alternateNames: ['Gradient Maker', 'CSS Gradient Tool', 'Background Gradient Generator'],
  },
  'color-palette': {
    title: 'Color Palette Generator - Create Harmonious Color Schemes',
    metaDescription: 'Generate beautiful color palettes with accessibility checks. Create complementary, analogous, and triadic color schemes for your designs.',
    longTailKeywords: [
      'color palette generator',
      'color scheme generator',
      'complementary color finder',
      'analogous colors generator',
      'triadic color palette',
      'accessible color palette',
      'color harmony tool',
      'ui color palette generator',
      'web color scheme creator',
      'brand color palette maker',
    ],
    faqs: [
      {
        question: 'How do I create a color palette for my website?',
        answer: 'Start with a base color and use our generator to create harmonious schemes using complementary, analogous, or triadic color relationships.',
      },
      {
        question: 'Does this tool check color accessibility?',
        answer: 'Yes, we check contrast ratios to ensure your color combinations meet WCAG accessibility guidelines.',
      },
    ],
  },
  'shadow-generator': {
    title: 'Box Shadow Generator - CSS Shadow Creator Online',
    metaDescription: 'Create beautiful CSS box shadows with our free generator. Preview layered shadows in real-time and export to CSS or Tailwind classes.',
    longTailKeywords: [
      'css box shadow generator',
      'shadow generator online',
      'box shadow creator',
      'tailwind shadow generator',
      'drop shadow css generator',
      'layered shadow creator',
      'css shadow effects',
      'card shadow generator',
      'soft shadow css',
      'elevation shadow generator',
    ],
    faqs: [
      {
        question: 'How do I create a smooth box shadow in CSS?',
        answer: 'Use multiple layered shadows with varying blur and spread values. Our generator makes it easy to create professional, smooth shadow effects.',
      },
    ],
  },
  'border-radius': {
    title: 'Border Radius Generator - CSS Rounded Corners Tool',
    metaDescription: 'Design custom CSS border radius with asymmetric corners. Preview shapes in real-time and copy CSS code instantly.',
    longTailKeywords: [
      'border radius generator',
      'css rounded corners',
      'border radius css',
      'asymmetric border radius',
      'custom border radius tool',
      'rounded corners generator',
      'css corner radius',
      'tailwind border radius',
    ],
  },
  'json-to-typescript': {
    title: 'JSON to TypeScript Converter - Generate Types Instantly',
    metaDescription: 'Convert JSON to TypeScript interfaces and types online. Automatic type inference with nested object support. Free, fast, no signup.',
    longTailKeywords: [
      'json to typescript',
      'json to typescript converter',
      'json to interface',
      'generate typescript types from json',
      'json to ts online',
      'typescript interface generator',
      'json to type definition',
      'convert json to typescript interface',
      'json schema to typescript',
      'api response to typescript',
    ],
    faqs: [
      {
        question: 'How do I convert JSON to TypeScript?',
        answer: 'Paste your JSON data into our converter and get TypeScript interfaces or type definitions instantly. We handle nested objects and arrays automatically.',
      },
      {
        question: 'Can I generate types from API responses?',
        answer: 'Yes! Simply paste the JSON response from your API and get properly typed TypeScript interfaces for your codebase.',
      },
    ],
  },
  'css-to-tailwind': {
    title: 'CSS to Tailwind Converter - Transform CSS Classes Online',
    metaDescription: 'Convert CSS styles to Tailwind utility classes instantly. Supports common properties like margin, padding, colors, and more.',
    longTailKeywords: [
      'css to tailwind',
      'css to tailwind converter',
      'convert css to tailwind',
      'tailwind converter online',
      'css to utility classes',
      'transform css to tailwind',
      'tailwind class generator',
      'css migration to tailwind',
      'tailwind css converter',
    ],
    faqs: [
      {
        question: 'How do I convert existing CSS to Tailwind?',
        answer: 'Paste your CSS code into our converter and get equivalent Tailwind utility classes. Perfect for migrating projects to Tailwind CSS.',
      },
    ],
  },
  'svg-to-react': {
    title: 'SVG to React Component Converter - JSX Generator',
    metaDescription: 'Convert SVG files to React/JSX components with TypeScript support. Optimized output with proper props and accessibility.',
    longTailKeywords: [
      'svg to react',
      'svg to jsx',
      'svg to react component',
      'convert svg to jsx',
      'svg react component generator',
      'svg to typescript component',
      'react icon from svg',
      'svg jsx converter online',
      'svgr online',
    ],
    faqs: [
      {
        question: 'How do I use SVG in React?',
        answer: 'Convert your SVG to a React component using our tool. The output includes proper TypeScript types and accessibility attributes.',
      },
    ],
  },
  'px-to-rem': {
    title: 'PX to REM Converter - Pixel to REM Calculator Online',
    metaDescription: 'Convert pixel values to REM units instantly. Customizable base font size with batch conversion support for responsive design.',
    longTailKeywords: [
      'px to rem',
      'px to rem converter',
      'pixel to rem',
      'rem calculator',
      'css px to rem',
      'convert pixels to rem',
      'rem converter online',
      'font size px to rem',
      'responsive units converter',
    ],
    faqs: [
      {
        question: 'Why should I use REM instead of pixels?',
        answer: 'REM units scale with the root font size, making your design more accessible and responsive. Users who adjust their browser font size will see proper scaling.',
      },
    ],
  },
  'regex-tester': {
    title: 'Regex Tester Online - Regular Expression Tester & Debugger',
    metaDescription: 'Test and debug regular expressions online with live matching and highlighting. Includes pattern explanations and common regex examples.',
    longTailKeywords: [
      'regex tester',
      'regex tester online',
      'regular expression tester',
      'regex debugger',
      'regex match tester',
      'javascript regex tester',
      'regex validator online',
      'test regular expression',
      'regex pattern tester',
      'regex101 alternative',
    ],
    faqs: [
      {
        question: 'How do I test a regular expression?',
        answer: 'Enter your regex pattern and test string in our tester. Matches are highlighted in real-time, and we explain what each part of your pattern does.',
      },
    ],
  },
  'base64': {
    title: 'Base64 Encoder/Decoder - Online Base64 Tool',
    metaDescription: 'Encode and decode Base64 strings online. Support for text, images, and files. Convert to data URLs for web use.',
    longTailKeywords: [
      'base64 encoder',
      'base64 decoder',
      'base64 encode online',
      'base64 decode online',
      'image to base64',
      'base64 to image',
      'base64 converter',
      'data url generator',
      'file to base64',
      'base64 string converter',
    ],
    faqs: [
      {
        question: 'What is Base64 encoding?',
        answer: 'Base64 encoding converts binary data to ASCII text, making it safe to transmit in URLs, emails, or embed directly in HTML/CSS.',
      },
    ],
  },
  'uuid-generator': {
    title: 'UUID Generator Online - Generate UUIDs in Bulk',
    metaDescription: 'Generate UUIDs (v1, v4, v7) in bulk. Copy unique identifiers instantly for databases, APIs, and applications. Free online tool.',
    longTailKeywords: [
      'uuid generator',
      'uuid generator online',
      'generate uuid',
      'uuid v4 generator',
      'guid generator',
      'bulk uuid generator',
      'random uuid',
      'unique id generator',
      'uuid maker',
      'uuid v7 generator',
    ],
    faqs: [
      {
        question: 'What is a UUID?',
        answer: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across space and time. Version 4 UUIDs are randomly generated.',
      },
    ],
  },
  'lorem-ipsum': {
    title: 'Lorem Ipsum Generator - Placeholder Text Generator',
    metaDescription: 'Generate placeholder text for your designs. Choose from classic Lorem Ipsum or developer-themed variants. Customize paragraphs and words.',
    longTailKeywords: [
      'lorem ipsum generator',
      'placeholder text generator',
      'dummy text generator',
      'lorem ipsum text',
      'generate placeholder text',
      'filler text generator',
      'lipsum generator',
      'random text generator',
      'sample text generator',
    ],
  },
  'slug-generator': {
    title: 'Slug Generator - URL Slug Creator Online',
    metaDescription: 'Generate URL-safe slugs from any text. Support for kebab-case, snake_case, and camelCase. Perfect for SEO-friendly URLs.',
    longTailKeywords: [
      'slug generator',
      'url slug generator',
      'slug maker',
      'seo slug generator',
      'kebab case converter',
      'url friendly text',
      'slug creator online',
      'generate url slug',
      'text to slug converter',
    ],
    faqs: [
      {
        question: 'What is a URL slug?',
        answer: 'A slug is the URL-friendly version of a title, using lowercase letters, numbers, and hyphens. Good slugs improve SEO and readability.',
      },
    ],
  },
  'diff-checker': {
    title: 'Diff Checker Online - Compare Text & Code Differences',
    metaDescription: 'Compare two texts and highlight differences online. Perfect for code review, document comparison, and finding text changes.',
    longTailKeywords: [
      'diff checker',
      'diff checker online',
      'text compare tool',
      'compare two texts',
      'code diff tool',
      'find text differences',
      'online diff viewer',
      'text difference checker',
      'compare files online',
      'diff tool online',
    ],
    faqs: [
      {
        question: 'How do I compare two texts?',
        answer: 'Paste both texts into our diff checker and see differences highlighted instantly. Added, removed, and changed lines are color-coded.',
      },
    ],
  },
  'tailwind-colors': {
    title: 'Tailwind Color Shades Generator - Create Full Color Scales',
    metaDescription: 'Generate Tailwind-style color scales (50-950) from any color. Perfect for extending your Tailwind palette with custom brand colors.',
    longTailKeywords: [
      'tailwind color generator',
      'tailwind color shades',
      'tailwind color palette',
      'tailwind custom colors',
      'generate tailwind colors',
      'tailwind color scale',
      'tailwind color picker',
      'tailwind theme colors',
      'brand colors to tailwind',
      'tailwind 50-950 generator',
    ],
    faqs: [
      {
        question: 'How do I add custom colors to Tailwind?',
        answer: 'Use our generator to create a full 50-950 color scale from your brand color, then add it to your tailwind.config.js extend colors section.',
      },
    ],
  },
  'tailwind-class-sorter': {
    title: 'Tailwind Class Sorter - Order Classes Automatically',
    metaDescription: 'Sort Tailwind CSS classes in the recommended order. Organize your utility classes for better readability and consistency.',
    longTailKeywords: [
      'tailwind class sorter',
      'sort tailwind classes',
      'tailwind class order',
      'organize tailwind classes',
      'tailwind prettier order',
      'tailwind class organizer',
      'headwind tailwind',
      'tailwind sorting tool',
      'reorder tailwind classes',
    ],
  },
};

/**
 * Generate complete metadata for a tool page
 */
export function generateToolMetadata(tool: Tool): Metadata {
  const seoData = toolSEOData[tool.id];
  const title = seoData?.title || `${tool.name} - Free Online Tool`;
  const description = seoData?.metaDescription || tool.description;
  
  // Combine tool keywords with long-tail keywords
  const keywords = [
    ...(tool.keywords || []),
    ...(seoData?.longTailKeywords || []),
    'free online tool',
    'developer tool',
    'web tool',
  ];

  const canonicalUrl = `${siteConfig.url}${tool.path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'GJ Dev Tools',
      type: 'website',
      images: [
        {
          url: `${siteConfig.url}/og/tools/${tool.id}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/og/tools/${tool.id}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate WebApplication structured data for a tool
 */
export function generateToolStructuredData(tool: Tool) {
  const seoData = toolSEOData[tool.id];

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: seoData?.metaDescription || tool.description,
    url: `${siteConfig.url}${tool.path}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(seoData?.alternateNames && {
      alternateName: seoData.alternateNames,
    }),
  };
}

/**
 * Generate FAQPage structured data for a tool (if FAQs exist)
 */
export function generateToolFAQStructuredData(tool: Tool) {
  const seoData = toolSEOData[tool.id];
  
  if (!seoData?.faqs || seoData.faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seoData.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate BreadcrumbList structured data for navigation
 */
export function generateToolBreadcrumbData(tool: Tool, category: ToolCategoryConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${siteConfig.url}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `${siteConfig.url}/tools?category=${category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: tool.name,
        item: `${siteConfig.url}${tool.path}`,
      },
    ],
  };
}

/**
 * Combine all structured data for a tool page
 */
export function getAllToolStructuredData(tool: Tool, category: ToolCategoryConfig): object[] {
  const structuredData: object[] = [
    generateToolStructuredData(tool),
    generateToolBreadcrumbData(tool, category),
  ];

  const faqData = generateToolFAQStructuredData(tool);
  if (faqData) {
    structuredData.push(faqData);
  }

  return structuredData;
}
