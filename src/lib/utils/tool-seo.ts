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
        question: 'Is this gradient generator free?',
        answer: 'Yes, this tool is completely free with no sign-up required. Create unlimited CSS gradients for your projects.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all gradient generation happens in your browser. Your designs never leave your device.',
      },
      {
        question: 'How do I create a CSS gradient with this tool?',
        answer: 'First, choose your gradient type (Linear, Radial, or Conic). Then add color stops by clicking "Add Stop" and position them along the gradient (0-100%). Adjust the angle to change direction. Watch your gradient update in real-time in the preview panel. Finally, switch between CSS and Tailwind output tabs and click copy to get the code for your project.',
      },
      {
        question: 'Can I export gradients to Tailwind CSS?',
        answer: 'Yes! Our tool automatically generates both standard CSS and Tailwind CSS classes for your gradient.',
      },
      {
        question: 'What is the difference between linear and radial gradients?',
        answer: 'Linear gradients transition colors in a straight line at any angle. Radial gradients emanate from a center point outward in a circular pattern.',
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
        question: 'Is this color palette generator free?',
        answer: 'Yes, completely free with no sign-up required. Generate unlimited color palettes for your design projects.',
      },
      {
        question: 'How do I create a color palette for my website?',
        answer: 'Start by choosing a base color using the color picker or entering a hex code. Then select a color harmony type (complementary, analogous, triadic, etc.) to generate related colors. Review the accessibility contrast ratios displayed for each combination. Fine-tune individual colors by clicking on them to adjust hue, saturation, or lightness. Finally, copy individual hex codes or export the entire palette for use in your project.',
      },
      {
        question: 'Does this tool check color accessibility?',
        answer: 'Yes, we check contrast ratios to ensure your color combinations meet WCAG accessibility guidelines.',
      },
      {
        question: 'What is a complementary color scheme?',
        answer: 'Complementary colors are opposite each other on the color wheel. They create high contrast and vibrant designs when used together.',
      },
      {
        question: 'Can I save my color palettes?',
        answer: 'You can export hex codes and save them in your design tools or notes. We recommend copying the entire palette for future reference.',
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
        question: 'Is this shadow generator free?',
        answer: 'Yes, this tool is completely free with no sign-up required. Create as many box shadow styles as you need.',
      },
      {
        question: 'Is my design stored on the server?',
        answer: 'No, all shadow generation happens in your browser. Your designs never leave your device.',
      },
      {
        question: 'How do I create a box shadow with this tool?',
        answer: 'Start by adjusting the horizontal and vertical offset to position your shadow. Increase blur radius for a softer effect and use spread radius to expand or contract the shadow size. Choose a shadow color and adjust opacity (10-25% works well for most designs). For professional depth, click "Add Layer" to create multiple shadows with different blur values. Finally, switch between CSS and Tailwind output to copy the code.',
      },
      {
        question: 'Can I create inner shadows?',
        answer: 'Yes, use the "inset" option to create inner shadows that appear inside the element rather than outside. Great for pressed button effects.',
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
    faqs: [
      {
        question: 'Is this border radius generator free?',
        answer: 'Yes, this tool is completely free to use with no sign-up required. Generate as many border radius styles as you need.',
      },
      {
        question: 'How do I create custom border radius?',
        answer: 'Use the sliders to adjust each corner independently (top-left, top-right, bottom-right, bottom-left). Try the preset buttons for common shapes like circles or rounded rectangles. Watch the preview update in real-time as you adjust values. Once you achieve the shape you want, copy the generated border-radius CSS property and paste it into your stylesheet.',
      },
      {
        question: 'Can I use this for circular elements?',
        answer: 'Yes! Set the border radius to 50% on all corners to create perfect circles from square elements, or use 100px+ values for pill shapes.',
      },
      {
        question: 'Does this work in all browsers?',
        answer: 'Border-radius is supported in all modern browsers. For IE8 and below, consider using fallback styles or polyfills.',
      },
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
        question: 'Is this JSON to TypeScript converter free?',
        answer: 'Yes, completely free with no sign-up required. Convert unlimited JSON to TypeScript types for your projects.',
      },
      {
        question: 'Is my JSON data stored on the server?',
        answer: 'No, all conversion happens in your browser. Your JSON data never leaves your device, ensuring complete privacy.',
      },
      {
        question: 'How do I convert JSON to TypeScript types?',
        answer: 'Paste your JSON data from API responses, config files, or any source into the input field. Choose whether you want TypeScript interfaces or type aliases. Decide if properties should be optional or required. Review the generated TypeScript code - nested objects become separate interfaces and array types are properly inferred. Finally, copy the code and paste it into your project\'s types file.',
      },
      {
        question: 'Can I generate types from API responses?',
        answer: 'Yes! Simply paste the JSON response from your API and get properly typed TypeScript interfaces for your codebase.',
      },
      {
        question: 'Should I use interface or type?',
        answer: 'Use interfaces for object shapes that might be extended. Use types for unions, primitives, or when you need advanced type features.',
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
        question: 'Is this CSS to Tailwind converter free?',
        answer: 'Yes, completely free with no sign-up. Convert unlimited CSS to Tailwind classes for your projects.',
      },
      {
        question: 'Is my CSS code stored on the server?',
        answer: 'No, all conversion happens in your browser. Your CSS code never leaves your device.',
      },
      {
        question: 'How do I convert CSS to Tailwind classes?',
        answer: 'Copy CSS from your stylesheet, browser DevTools, or any source and paste it into the input field. The tool will show you equivalent Tailwind utility classes. For custom values not in the default Tailwind config, it suggests arbitrary value syntax like w-[123px]. Click copy to get the Tailwind classes and paste them directly into your className attribute. Some CSS properties may need the @apply directive or arbitrary values for edge cases.',
      },
      {
        question: 'Does it support all CSS properties?',
        answer: 'We support the most common CSS properties. For properties without direct Tailwind equivalents, we suggest arbitrary values like w-[123px].',
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
        question: 'Is this SVG to React converter free?',
        answer: 'Yes, completely free with no sign-up required. Convert unlimited SVGs to React components.',
      },
      {
        question: 'Is my SVG code stored on the server?',
        answer: 'No, all conversion happens in your browser. Your SVG code never leaves your device.',
      },
      {
        question: 'How do I convert SVG to React components?',
        answer: 'Copy the SVG markup from your design tool (Figma, Illustrator, etc.) and paste it into the input field. Choose between functional component with TypeScript or JavaScript. Enter a component name using PascalCase like "IconArrow" or "LogoCompany". Review the converted React component - SVG attributes are automatically converted to camelCase. Copy the component code and save it to your components folder, then import and use it with width, height, and className props.',
      },
      {
        question: 'Does it support TypeScript?',
        answer: 'Yes! The generated component includes proper TypeScript prop types for width, height, className, and other SVG attributes.',
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
  'image-compressor': {
    title: 'Image Compressor - Compress JPEG, PNG, WebP, AVIF Online Free',
    metaDescription: 'Free online image compressor. Reduce image file sizes by up to 80% with smart compression. Convert between JPEG, PNG, WebP, and AVIF formats. Batch processing supported.',
    longTailKeywords: [
      'image compressor online',
      'compress image free',
      'reduce image size online',
      'jpeg compressor online',
      'png optimizer',
      'webp converter',
      'avif converter',
      'batch image compression',
      'compress photos online',
      'reduce photo size',
      'image size reducer',
      'optimize images for web',
      'compress images without losing quality',
      'bulk image compressor',
      'photo optimizer',
    ],
    faqs: [
      {
        question: 'How does the image compressor reduce file sizes?',
        answer: 'Our tool uses smart lossy compression algorithms to reduce image file sizes while maintaining visual quality. It selectively reduces color information and removes unnecessary metadata. The compression happens entirely in your browser using advanced image processing libraries, achieving up to 80% size reduction for most images.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'We support JPEG, PNG, WebP, and AVIF formats. You can upload images in any of these formats and optionally convert them to a different format for better compression. WebP and AVIF typically provide the smallest file sizes while maintaining quality.',
      },
      {
        question: 'Is my data safe? Where are images processed?',
        answer: 'Your images are completely safe and private. All compression happens locally in your browser - your images never leave your device or get uploaded to any server. This ensures maximum privacy and security for your photos and images.',
      },
      {
        question: 'What is the difference between JPEG, PNG, WebP, and AVIF?',
        answer: 'JPEG is best for photos with good compression but no transparency support. PNG offers lossless compression and transparency but larger file sizes. WebP provides better compression than both JPEG and PNG with transparency support. AVIF offers the best compression ratios (often 50% smaller than JPEG) but has limited browser support.',
      },
      {
        question: 'Can I compress multiple images at once?',
        answer: 'Yes! You can upload and compress up to 20 images simultaneously. Each image can be up to 10MB in size, with a 50MB total limit for batch processing. After compression, download all images individually or as a ZIP file.',
      },
      {
        question: 'How much can I reduce my image size?',
        answer: 'Compression results vary by image type and content. Photos typically compress 60-80% with quality 0.8 setting. Graphics and screenshots may compress 40-60%. Converting PNG to WebP or AVIF often achieves 70-85% size reduction. You can adjust the quality slider to find the perfect balance between file size and visual quality.',
      },
    ],
    alternateNames: ['Image Optimizer', 'Photo Compressor', 'Picture Size Reducer'],
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
        question: 'Is this regex tester free?',
        answer: 'Yes, completely free with no sign-up. Test unlimited regular expressions for your development needs.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all regex testing happens in your browser. Your patterns and test strings never leave your device.',
      },
      {
        question: 'How do I test regular expressions with this tool?',
        answer: 'Type your regular expression in the pattern field, including modifiers like /g for global, /i for case-insensitive, or /m for multiline. Paste or type the text you want to test against your regex in the test string area. Matches are highlighted instantly as you type, showing you how many matches were found. Read the human-readable explanation of what your regex pattern does. Try different test strings to ensure your regex handles all expected inputs and edge cases.',
      },
      {
        question: 'What regex flavor does this use?',
        answer: 'We use JavaScript regex (ECMAScript). This is compatible with most modern programming languages with minor differences.',
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
        question: 'Is this Base64 tool free?',
        answer: 'Yes, completely free with no sign-up. Encode and decode unlimited Base64 strings and files.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all encoding and decoding happens in your browser. Your files and data never leave your device.',
      },
      {
        question: 'How do I encode or decode Base64?',
        answer: 'Select "Encode" to convert text or files to Base64, or "Decode" to convert Base64 strings back. For encoding, paste text or upload an image/file. For decoding, paste the Base64 string (including data URL prefix for images). The converted result appears instantly - for images you will see both the Base64 string and a preview. Click the copy button to copy the result, or use the download button to save decoded images.',
      },
      {
        question: 'Can I encode images to Base64?',
        answer: 'Yes! Upload any image and get a Base64 data URL. Use it in img src attributes or CSS backgrounds for inline embedding.',
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
        question: 'Is this UUID generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited UUIDs in bulk for your projects.',
      },
      {
        question: 'How do I generate UUIDs?',
        answer: 'Select your preferred format options: uppercase or lowercase letters, and with or without dashes (most applications use lowercase with dashes). Click "Add" for one UUID at a time, or use the bulk generate buttons (5, 10, 25, 50) to create multiple instantly. Click the copy icon next to any UUID to copy it individually, or use "Copy All" to copy all as a newline-separated list. Use the regenerate icon to create a new UUID in place of an existing one.',
      },
      {
        question: 'Are these UUIDs truly unique?',
        answer: 'Yes, version 4 UUIDs use random generation with extremely low collision probability (1 in 5.3 × 10³⁶). They are safe for production use.',
      },
      {
        question: 'Can I use these in databases?',
        answer: 'Absolutely! UUIDs are perfect for database primary keys, especially in distributed systems where auto-increment IDs would conflict.',
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
    faqs: [
      {
        question: 'Is this Lorem Ipsum generator free?',
        answer: 'Yes, completely free with no sign-up required. Generate unlimited placeholder text for your projects.',
      },
      {
        question: 'How do I generate placeholder text?',
        answer: 'Choose your text type - select classic Lorem Ipsum or developer-themed variants like Tech Lorem, Code Lorem, or Design Lorem for more relevant content. Use the slider or input field to set how many paragraphs you need (1-10). Adjust the words per paragraph to match your actual content length. Preview the generated text in the output area - it updates instantly as you adjust settings. Click copy to get the placeholder text and paste it into your designs or prototypes.',
      },
      {
        question: 'What is Lorem Ipsum?',
        answer: 'Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It approximates normal word distribution without distracting with readable content.',
      },
      {
        question: 'Can I use Lorem Ipsum in production?',
        answer: 'Lorem Ipsum is only for mockups and prototypes. Always replace it with real content before launching your website or app.',
      },
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
        question: 'Is this slug generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited URL slugs for your content.',
      },
      {
        question: 'Is my text stored on the server?',
        answer: 'No, all slug generation happens in your browser. Your text never leaves your device.',
      },
      {
        question: 'How do I generate URL slugs?',
        answer: 'Type or paste the title, heading, or text you want to convert into a URL-friendly slug (blog post titles, product names, categories work great). Select your preferred slug format - kebab-case is recommended for URLs, but you can also choose snake_case or camelCase. See the slug generated in real-time - special characters are removed, spaces become hyphens, and text is lowercased. Edit the generated slug if you want to shorten or adjust it. Click copy to get your URL slug for use in your CMS or routing system.',
      },
      {
        question: 'What makes a good URL slug?',
        answer: 'Keep slugs short (3-5 words), descriptive, and use hyphens to separate words. Avoid special characters, spaces, and unnecessary words like "a", "the".',
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
        question: 'Is this diff checker free?',
        answer: 'Yes, completely free with no sign-up. Compare unlimited text files and documents.',
      },
      {
        question: 'Is my text stored on the server?',
        answer: 'No, all comparison happens in your browser. Your text never leaves your device.',
      },
      {
        question: 'How do I compare text differences?',
        answer: 'Enter your original or "before" text in the left panel - this could be code, documents, configuration files, or any text content. Paste the updated or "after" version in the right panel. View the highlighted differences instantly - added lines appear in green, removed lines in red, and modified lines show both colors. Line numbers help you locate changes quickly. Switch between side-by-side, unified, or split view modes. Copy the diff output or share results with team members for code reviews.',
      },
      {
        question: 'Can I compare code files?',
        answer: 'Yes! This tool works great for comparing code, configuration files, JSON, and any other text-based content.',
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
        question: 'Is this Tailwind color generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited custom Tailwind color scales.',
      },
      {
        question: 'Is my color data stored on the server?',
        answer: 'No, all color generation happens in your browser. Your colors never leave your device.',
      },
      {
        question: 'How do I generate Tailwind color shades?',
        answer: 'Select a color using the color picker or enter a hex code - this will be your primary brand color. Preview all 10 shades (50-950) generated automatically, ranging from very light to very dark. Click on any shade to fine-tune its color to match your brand guidelines. Copy the complete Tailwind configuration code to add to your tailwind.config.js file. Once added to config, use your custom colors with Tailwind classes like bg-brand-500, text-brand-700, etc.',
      },
      {
        question: 'Why does Tailwind use 50-950 shades?',
        answer: 'The 50-950 scale provides consistent lightness progression across all colors, making it easy to create cohesive designs with predictable contrast.',
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
    faqs: [
      {
        question: 'Is this Tailwind class sorter free?',
        answer: 'Yes, completely free with no sign-up required. Sort as many class lists as you need for your projects.',
      },
      {
        question: 'Is my code stored on the server?',
        answer: 'No, all sorting happens in your browser. Your code never leaves your device, ensuring complete privacy.',
      },
      {
        question: 'How do I sort Tailwind classes?',
        answer: 'Copy the className string from your React/JSX component or HTML element and paste it into the input field. Select your preferred sorting method - the official Tailwind recommended order, alphabetical sorting, or group by utility type (layout, typography, colors, etc.). View your classes automatically reorganized according to the selected method for improved readability. Click copy to get the sorted class string and replace your original className. For automatic sorting in your editor, consider installing the Prettier plugin for Tailwind CSS.',
      },
      {
        question: 'Can I automate this with Prettier?',
        answer: 'Yes! Install the official Prettier plugin for Tailwind CSS to automatically sort classes on save. This tool helps you learn the ordering system.',
      },
    ],
  },
  'sprite-css': {
    title: 'Sprite CSS Generator - Extract CSS from Sprite Sheets',
    metaDescription: 'Generate CSS for sprite sheet animations and static sprites. Visual sprite selector with automatic background-position calculation.',
    longTailKeywords: [
      'css sprite generator',
      'sprite sheet css',
      'background position calculator',
      'sprite animation css',
      'css sprite tool',
      'sprite sheet background position',
      'image sprite css',
      'sprite map generator',
    ],
    faqs: [
      {
        question: 'Is this sprite CSS generator free?',
        answer: 'Yes, this tool is completely free to use. Generate CSS for unlimited sprite sheets without any restrictions.',
      },
      {
        question: 'Is my sprite image stored on the server?',
        answer: 'No, all image processing happens locally in your browser. Your sprite sheets never leave your device.',
      },
      {
        question: 'How do I extract CSS from a sprite sheet?',
        answer: 'Click to upload or drag and drop your sprite sheet image (PNG works best). Click and drag on the image to select the specific sprite you want. Enter the width and height of your sprite frames if they are uniform. Then copy the generated CSS code with background-image, background-position, and size properties to use in your stylesheet.',
      },
      {
        question: 'What image formats are supported?',
        answer: 'PNG, JPG, GIF, and WebP formats are all supported. PNG with transparency is recommended for best results with web sprites.',
      },
    ],
  },
  'css-unit-converter': {
    title: 'CSS Unit Converter - Convert px, rem, em, and more',
    metaDescription: 'Convert between CSS units instantly: px, rem, em, pt, cm, mm, in, pc, vh, vw, and percentage. Free online CSS unit calculator.',
    longTailKeywords: [
      'css unit converter',
      'px to rem converter',
      'rem to px',
      'em to px',
      'css unit calculator',
      'convert pixels to rem',
      'css measurement converter',
      'responsive unit converter',
      'viewport units converter',
    ],
    faqs: [
      {
        question: 'Is this CSS unit converter free?',
        answer: 'Yes, completely free with no sign-up. Convert between all CSS units as many times as you need.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all conversions happen in your browser. Your values are never sent to any server.',
      },
      {
        question: 'How do I convert between CSS units?',
        answer: 'Type the value you want to convert in the input field (you can include the unit or just the number). Select the unit you are converting from (px, rem, em, pt, cm, mm, in, pc, vh, vw, or %). For rem and em conversions, set the base font size (typically 16px). View your value converted to all other CSS units simultaneously. Click the copy button next to any converted value to use it in your CSS.',
      },
      {
        question: 'What is the difference between rem and em?',
        answer: 'REM is relative to the root font size (usually 16px), while EM is relative to the parent element font size. REM is more predictable for consistent sizing.',
      },
      {
        question: 'Why use rem instead of pixels?',
        answer: 'REM units respect user font size preferences for better accessibility. They also make responsive design easier since all sizes scale proportionally.',
      },
    ],
  },
  'letter-spacing': {
    title: 'Letter Spacing Calculator - Convert Tracking to CSS',
    metaDescription: 'Convert design tool tracking values to CSS letter-spacing. Convert percentage and em values to pixels for precise typography.',
    longTailKeywords: [
      'letter spacing calculator',
      'tracking to letter spacing',
      'figma letter spacing',
      'photoshop tracking to css',
      'css letter spacing converter',
      'typography calculator',
      'tracking value converter',
    ],
    faqs: [
      {
        question: 'Is this letter spacing calculator free?',
        answer: 'Yes, this tool is completely free with no sign-up required. Calculate as many letter spacing values as you need.',
      },
      {
        question: 'How do I calculate letter spacing from design tools?',
        answer: 'Enter your tracking value from Figma or Photoshop (usually in percentage or em), then set your font size in pixels. The tool automatically converts it to CSS letter-spacing values in pixels, em, or rem units. For relative spacing that scales with font size, use em values.',
      },
      {
        question: 'How do I convert Figma tracking to CSS?',
        answer: 'Figma shows tracking in percentage. Enter the percentage value and font size, and get the CSS letter-spacing value in pixels or em units.',
      },
      {
        question: 'What is the difference between tracking and kerning?',
        answer: 'Tracking (letter-spacing in CSS) adjusts spacing between all characters uniformly. Kerning adjusts space between specific character pairs and is handled by the font itself.',
      },
      {
        question: 'Should I use px or em for letter-spacing?',
        answer: 'Use em for letter-spacing so it scales proportionally with font size. This maintains consistent visual spacing across different text sizes.',
      },
    ],
  },
  'code-formatter': {
    title: 'Code Formatter - Format HTML, CSS, JavaScript, JSON Online',
    metaDescription: 'Free online code formatter powered by Prettier. Format and beautify HTML, CSS, JavaScript, and JSON with customizable indentation and style options.',
    longTailKeywords: [
      'code formatter online',
      'beautify javascript',
      'format html online',
      'css formatter',
      'json formatter',
      'prettier online',
      'code beautifier',
      'javascript formatter',
      'format code online',
      'code indentation tool',
    ],
    faqs: [
      {
        question: 'Is this code formatter free?',
        answer: 'Yes, completely free with no sign-up required. Format unlimited code for your projects.',
      },
      {
        question: 'Is my code stored on the server?',
        answer: 'No, all formatting happens in your browser using Prettier. Your code never leaves your device.',
      },
      {
        question: 'How do I format code with this tool?',
        answer: 'Select your language (JavaScript, HTML, CSS, or JSON), adjust indentation size and choose between spaces or tabs, paste your unformatted code into the input area, and watch it automatically format with consistent spacing and style. Click copy to get the beautifully formatted code.',
      },
      {
        question: 'What formatting rules are applied?',
        answer: 'We use industry-standard Prettier rules: single quotes, semicolons, 80-character line width, ES5 trailing commas, bracket spacing, and always-parentheses for arrow functions.',
      },
      {
        question: 'Can I customize the formatting settings?',
        answer: 'Yes! You can adjust indentation size (2, 4, or 8 spaces) and choose between spaces or tabs. Other settings follow Prettier best practices for consistency.',
      },
    ],
    alternateNames: ['Code Beautifier', 'Prettier Online', 'Code Indenter'],
  },
  'code-minifier': {
    title: 'Code Minifier - Minify HTML, CSS, JavaScript Online',
    metaDescription: 'Free online code minifier. Reduce file sizes by removing whitespace and comments from HTML, CSS, and JavaScript. See size reduction stats.',
    longTailKeywords: [
      'code minifier online',
      'minify javascript',
      'minify html',
      'minify css',
      'js minifier',
      'css compressor',
      'html compressor',
      'reduce code size',
      'compress javascript',
      'code optimizer',
    ],
    faqs: [
      {
        question: 'Is this code minifier free?',
        answer: 'Yes, completely free with no sign-up. Minify unlimited files for production use.',
      },
      {
        question: 'Is my code stored on the server?',
        answer: 'No, all minification happens in your browser. Your code never leaves your device.',
      },
      {
        question: 'How do I minify code?',
        answer: 'Select your code language (HTML, CSS, or JavaScript), paste your code into the input area, view file size reduction stats (original size, minified size, bytes saved, percentage reduction), and copy the minified code for use in production.',
      },
      {
        question: 'How much file size can I save?',
        answer: 'Results vary by code style. Typically, you can save 30-60% for well-formatted code with comments. Heavily commented code may see 70%+ reduction.',
      },
      {
        question: 'Will minification break my code?',
        answer: 'No, minification only removes whitespace and comments while preserving functionality. However, always test minified code before deploying to production.',
      },
    ],
    alternateNames: ['Code Compressor', 'JS Minifier', 'CSS Minifier'],
  },
  'hash-generator': {
    title: 'Hash Generator - Generate MD5, SHA-1, SHA-256, SHA-512 Online',
    metaDescription: 'Generate cryptographic hashes online. Create MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files for checksums and verification.',
    longTailKeywords: [
      'hash generator online',
      'md5 generator',
      'sha256 generator',
      'sha512 generator',
      'generate hash online',
      'checksum generator',
      'file hash calculator',
      'text to hash',
      'cryptographic hash',
      'hash calculator',
    ],
    faqs: [
      {
        question: 'Is this hash generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited hashes for verification and security purposes.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all hash generation happens in your browser. Your text and files never leave your device.',
      },
      {
        question: 'How do I generate hashes?',
        answer: 'Choose between text input or file upload, enter your data or upload a file, view all hash types generated simultaneously (MD5, SHA-1, SHA-256, SHA-512), and click copy to get any hash value for use in your project.',
      },
      {
        question: 'Which hash algorithm should I use?',
        answer: 'For security purposes, use SHA-256 or SHA-512. MD5 and SHA-1 are suitable for checksums and non-cryptographic uses but not recommended for password hashing or security.',
      },
      {
        question: 'Can I hash files?',
        answer: 'Yes! Upload any text file to generate hashes. This is perfect for verifying file integrity and creating checksums.',
      },
    ],
    alternateNames: ['Checksum Generator', 'SHA256 Generator', 'MD5 Calculator'],
  },
  'markdown-to-html': {
    title: 'Markdown to HTML Converter - Convert MD to HTML Online',
    metaDescription: 'Convert Markdown to HTML online with live preview. Supports GitHub-flavored Markdown including tables, code blocks, and task lists.',
    longTailKeywords: [
      'markdown to html',
      'markdown to html converter',
      'md to html',
      'convert markdown to html',
      'markdown parser online',
      'github markdown to html',
      'markdown preview',
      'markdown renderer',
      'readme to html',
    ],
    faqs: [
      {
        question: 'Is this Markdown to HTML converter free?',
        answer: 'Yes, completely free with no sign-up. Convert unlimited Markdown files for your projects.',
      },
      {
        question: 'Is my Markdown stored on the server?',
        answer: 'No, all conversion happens in your browser. Your Markdown content never leaves your device.',
      },
      {
        question: 'How do I convert Markdown to HTML?',
        answer: 'Paste your Markdown text from README files, documentation, or blog posts, switch to Preview mode to see how it renders with styling, check the HTML mode to see the generated markup, and copy the HTML code for use in your web projects.',
      },
      {
        question: 'What Markdown features are supported?',
        answer: 'We support GitHub-flavored Markdown including headers, bold/italic text, links, images, code blocks with syntax highlighting, tables, blockquotes, ordered/unordered lists, and task lists.',
      },
      {
        question: 'Can I use this for blog posts?',
        answer: 'Absolutely! Convert your Markdown blog posts to HTML for use in CMSs, static site generators, or any web platform.',
      },
    ],
    alternateNames: ['MD to HTML', 'Markdown Parser', 'Markdown Renderer'],
  },
  'password-generator': {
    title: 'Password Generator - Generate Strong Random Passwords Online',
    metaDescription: 'Generate strong, secure passwords with our free tool. Create random passwords with custom length and character types. Bulk generation supported.',
    longTailKeywords: [
      'password generator',
      'random password generator',
      'strong password generator',
      'secure password creator',
      'generate password online',
      'bulk password generator',
      'random password maker',
      'password strength checker',
      'safe password generator',
    ],
    faqs: [
      {
        question: 'Is this password generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited secure passwords for all your accounts.',
      },
      {
        question: 'Are the generated passwords secure?',
        answer: 'Yes, passwords are generated using cryptographically secure random methods. They never leave your browser and are not stored anywhere.',
      },
      {
        question: 'How do I generate strong passwords?',
        answer: 'Use the slider to set password length (12+ characters recommended), check boxes for character types (uppercase, lowercase, numbers, symbols), view the strength meter for quality feedback, generate single or bulk passwords (1, 5, 10, 25, or 50 at once), and copy individual passwords or all at once.',
      },
      {
        question: 'How long should my password be?',
        answer: 'We recommend at least 12 characters for most accounts, 16+ for sensitive accounts like email or banking. Longer passwords with more character types are exponentially more secure.',
      },
      {
        question: 'Can I generate passwords in bulk?',
        answer: 'Yes! Use the quick generate buttons to create 5, 10, 25, or 50 passwords at once. Perfect for setting up multiple accounts or team members.',
      },
    ],
    alternateNames: ['Random Password Creator', 'Secure Password Maker', 'Strong Password Tool'],
  },
  'placeholder-image': {
    title: 'Placeholder Image Generator - Create Custom Placeholder Images',
    metaDescription: 'Generate custom placeholder images online. Set dimensions, colors, and text. Export as PNG, JPEG, or WebP. Perfect for mockups and prototypes.',
    longTailKeywords: [
      'placeholder image generator',
      'dummy image generator',
      'placeholder image maker',
      'generate placeholder image',
      'custom placeholder image',
      'image placeholder creator',
      'mockup image generator',
      'placeholder png generator',
    ],
    faqs: [
      {
        question: 'Is this placeholder image generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited placeholder images for your designs and prototypes.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all image generation happens in your browser. Images are created locally and never uploaded anywhere.',
      },
      {
        question: 'How do I generate placeholder images?',
        answer: 'Set custom width and height using sliders or input fields, or choose from preset sizes (Square, Banner, Hero, Mobile), customize background and text colors with the color pickers, add optional custom text to display on the image, select your format (PNG, JPEG, or WebP), and download the image or copy the data URL.',
      },
      {
        question: 'Which format should I use?',
        answer: 'Use PNG for images with potential transparency, JPEG for smaller file sizes (best for photos), or WebP for best compression with quality. Data URLs are perfect for quick prototyping in HTML/CSS.',
      },
      {
        question: 'Can I use custom text on the placeholder?',
        answer: 'Yes! Enter any text you want to display. Leave it empty to show default dimensions (e.g., "600 × 400").',
      },
    ],
    alternateNames: ['Dummy Image Generator', 'Placeholder Maker', 'Mockup Image Tool'],
  },
  'qr-code': {
    title: 'QR Code Generator - Create Custom QR Codes Online Free',
    metaDescription: 'Generate custom QR codes online. Create QR codes for URLs, text, WiFi, and more. Customize colors and download as PNG or SVG.',
    longTailKeywords: [
      'qr code generator',
      'qr code maker',
      'create qr code',
      'custom qr code',
      'qr code creator online',
      'generate qr code free',
      'qr code for url',
      'svg qr code generator',
      'colored qr code',
    ],
    faqs: [
      {
        question: 'Is this QR code generator free?',
        answer: 'Yes, completely free with no sign-up. Generate unlimited QR codes for personal and commercial use.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all QR code generation happens in your browser. Your data never leaves your device.',
      },
      {
        question: 'How do I create a QR code?',
        answer: 'Enter the URL, text, or data you want to encode (website URLs, contact info, WiFi credentials), customize the appearance (size, colors), set error correction level (higher levels allow the QR code to be read even if partially damaged), preview your QR code in real-time, and download as PNG for digital use or SVG for print materials.',
      },
      {
        question: 'What error correction level should I use?',
        answer: 'Use L (7%) for digital displays, M (15%) for most uses, Q (25%) if the code might be partially covered, and H (30%) for codes that may be damaged or have a logo overlay.',
      },
      {
        question: 'Can I customize QR code colors?',
        answer: 'Yes! Change both foreground and background colors to match your brand. Ensure good contrast for reliable scanning.',
      },
    ],
    alternateNames: ['QR Code Maker', 'QR Generator', 'Custom QR Creator'],
  },
  'timestamp-converter': {
    title: 'Unix Timestamp Converter - Convert Timestamp to Date Online',
    metaDescription: 'Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Multiple date format outputs.',
    longTailKeywords: [
      'timestamp converter',
      'unix timestamp converter',
      'timestamp to date',
      'date to timestamp',
      'epoch converter',
      'unix time converter',
      'convert timestamp online',
      'timestamp calculator',
      'epoch time converter',
    ],
    faqs: [
      {
        question: 'Is this timestamp converter free?',
        answer: 'Yes, completely free with no sign-up. Convert unlimited timestamps for your development needs.',
      },
      {
        question: 'Is my data stored on the server?',
        answer: 'No, all conversions happen in your browser. Your timestamps and dates never leave your device.',
      },
      {
        question: 'How do I convert timestamps?',
        answer: 'View the current Unix timestamp in seconds and milliseconds with live date representations, toggle between seconds and milliseconds based on your needs, enter a Unix timestamp to see it converted to ISO 8601, UTC, local time, and other formats, or use the datetime picker to select a date and see the corresponding Unix timestamp.',
      },
      {
        question: 'What is the difference between seconds and milliseconds?',
        answer: 'Unix timestamps in seconds are common in Unix/Linux systems. JavaScript and many APIs use milliseconds (1000× larger). The tool handles both formats.',
      },
      {
        question: 'Can I copy specific date formats?',
        answer: 'Yes! Click the copy button next to any timestamp or date format to use it in your application, database queries, or API requests.',
      },
    ],
    alternateNames: ['Epoch Converter', 'Unix Time Converter', 'Timestamp Calculator'],
  },
  'word-counter': {
    title: 'Word Counter - Count Words, Characters, Reading Time Online',
    metaDescription: 'Free online word counter. Count words, characters, sentences, paragraphs, and reading time. Check text against platform character limits.',
    longTailKeywords: [
      'word counter',
      'word counter online',
      'character counter',
      'word count tool',
      'reading time calculator',
      'text statistics',
      'count words in text',
      'character count checker',
      'word frequency counter',
    ],
    faqs: [
      {
        question: 'Is this word counter free?',
        answer: 'Yes, completely free with no sign-up. Count words and characters for unlimited text and documents.',
      },
      {
        question: 'Is my text stored on the server?',
        answer: 'No, all counting happens in your browser. Your text never leaves your device.',
      },
      {
        question: 'How do I use the word counter?',
        answer: 'Paste your text into the input area (supports essays, articles, blog posts, social media content), view real-time statistics (word count, character count with/without spaces, sentence and paragraph count), check estimated reading time and speaking time, and monitor your text against common platform character limits (Twitter, Instagram, LinkedIn, meta descriptions).',
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is based on average reading speed of 225 words per minute. Speaking time uses 150 words per minute. Actual times vary by content complexity and individual reading speed.',
      },
      {
        question: 'What character limits are checked?',
        answer: 'We check against Twitter (280), Instagram caption (2200), LinkedIn post (3000), meta descriptions (160), and title tags (60) to help you optimize content for different platforms.',
      },
    ],
    alternateNames: ['Character Counter', 'Text Statistics Tool', 'Reading Time Calculator'],
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
