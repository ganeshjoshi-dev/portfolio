export interface HowToStep {
  title: string;
  description: string;
  example?: string;
}

export interface ToolContent {
  howToUse: {
    title: string;
    steps: HowToStep[];
  };
  relatedTools: string[]; // tool IDs (max 3)
}

export const toolContent: Record<string, ToolContent> = {
  'image-compressor': {
    howToUse: {
      title: 'How to Compress Images',
      steps: [
        {
          title: 'Upload Your Images',
          description: 'Drag and drop images onto the upload zone or click to select files. You can upload up to 20 images at once (max 10MB each). Supported formats: JPEG, PNG, WebP, and AVIF.',
        },
        {
          title: 'Adjust Compression Settings',
          description: 'Use the quality slider to control compression level (0.1-1.0). Higher values preserve more quality but result in larger files. A quality of 0.8 provides excellent results for most images.',
        },
        {
          title: 'Choose Format Conversion (Optional)',
          description: 'Enable "Convert images automatically" to change image formats. WebP offers 25-35% smaller files than JPEG. AVIF provides even better compression but has limited browser support.',
        },
        {
          title: 'Compress Your Images',
          description: 'Click "Compress All" to start processing. Watch the progress bar and see before/after previews for each image. Compression happens in your browser - images never leave your device.',
        },
        {
          title: 'Download Compressed Images',
          description: 'Download individual images using the download button on each card, or click "Download All" to get a ZIP file with all compressed images.',
        },
      ],
    },
    relatedTools: ['base64', 'color-palette', 'sprite-css'],
  },
  'gradient-generator': {
    howToUse: {
      title: 'How to Create CSS Gradients',
      steps: [
        {
          title: 'Choose Your Gradient Type',
          description: 'Select between Linear, Radial, or Conic gradient types. Linear gradients work well for backgrounds, radial for spotlight effects, and conic for angular color transitions.',
        },
        {
          title: 'Add and Position Color Stops',
          description: 'Click "Add Stop" to add colors to your gradient. Each color stop can be positioned along the gradient (0-100%). Drag the position slider or enter a specific value for precise control.',
        },
        {
          title: 'Adjust the Angle or Direction',
          description: 'For linear and conic gradients, adjust the angle to change the direction of color flow. 0° creates a bottom-to-top gradient, 90° goes left-to-right, and so on.',
        },
        {
          title: 'Preview in Real-Time',
          description: 'Watch your gradient update instantly in the preview panel. Try the preset gradients for inspiration or click "Randomize" to generate creative combinations.',
        },
        {
          title: 'Copy CSS or Tailwind Code',
          description: 'Switch between CSS and Tailwind output tabs. Click the copy button to get ready-to-use code for your project. The CSS output includes the complete background property.',
        },
      ],
    },
    relatedTools: ['color-palette', 'shadow-generator', 'border-radius'],
  },

  'color-palette': {
    howToUse: {
      title: 'How to Generate Color Palettes',
      steps: [
        {
          title: 'Choose a Base Color',
          description: 'Start by selecting your primary color using the color picker or enter a hex code. This will be the foundation of your color scheme.',
        },
        {
          title: 'Select a Color Harmony',
          description: 'Choose from complementary, analogous, triadic, or other harmony types. Each creates different relationships between colors based on color theory.',
        },
        {
          title: 'Check Accessibility',
          description: 'Review the contrast ratios displayed for each color combination. WCAG AAA requires 7:1 for normal text, AA requires 4.5:1. Use accessible combinations for better readability.',
        },
        {
          title: 'Adjust Individual Colors',
          description: 'Fine-tune any color in your palette by clicking on it. Modify hue, saturation, or lightness to perfect your color scheme.',
        },
        {
          title: 'Export Your Palette',
          description: 'Copy individual hex codes or export the entire palette as CSS variables, Tailwind config, or other formats for use in your project.',
        },
      ],
    },
    relatedTools: ['gradient-generator', 'tailwind-colors', 'shadow-generator'],
  },

  'shadow-generator': {
    howToUse: {
      title: 'How to Create CSS Box Shadows',
      steps: [
        {
          title: 'Start with a Single Shadow',
          description: 'Adjust the horizontal and vertical offset to position your shadow. Positive values move the shadow right/down, negative values move it left/up.',
        },
        {
          title: 'Adjust Blur and Spread',
          description: 'Increase blur radius for a softer shadow effect. Spread radius expands or contracts the shadow size. Combine both for natural depth effects.',
        },
        {
          title: 'Choose Shadow Color and Opacity',
          description: 'Select a shadow color and adjust opacity. Darker shadows with lower opacity create more realistic effects. Black at 10-25% opacity works well for most designs.',
        },
        {
          title: 'Layer Multiple Shadows',
          description: 'Click "Add Layer" to create depth with multiple shadows. Use 2-3 layers with different blur values to achieve smooth, professional elevation effects.',
        },
        {
          title: 'Copy CSS or Tailwind Classes',
          description: 'Switch between CSS and Tailwind output. The CSS includes the complete box-shadow property, while Tailwind shows custom class configuration.',
        },
      ],
    },
    relatedTools: ['gradient-generator', 'border-radius', 'sprite-css'],
  },

  'border-radius': {
    howToUse: {
      title: 'How to Create Custom Border Radius',
      steps: [
        {
          title: 'Adjust Individual Corners',
          description: 'Use the sliders to control each corner independently. Create asymmetric shapes by varying the radius of different corners.',
        },
        {
          title: 'Use Preset Shapes',
          description: 'Click on preset buttons for common shapes like circles, rounded rectangles, or custom organic forms. These serve as great starting points.',
        },
        {
          title: 'Preview Your Shape',
          description: 'Watch the preview update in real-time as you adjust values. The visual feedback helps you achieve the exact shape you need.',
        },
        {
          title: 'Copy the CSS Code',
          description: 'Copy the generated border-radius CSS property and paste it into your stylesheet. Works with any HTML element that supports border-radius.',
        },
      ],
    },
    relatedTools: ['shadow-generator', 'sprite-css', 'gradient-generator'],
  },

  'sprite-css': {
    howToUse: {
      title: 'How to Extract CSS from Sprite Sheets',
      steps: [
        {
          title: 'Upload Your Sprite Sheet',
          description: 'Click to upload or drag and drop your sprite sheet image. PNG files with transparent backgrounds work best for web sprites.',
        },
        {
          title: 'Select the Sprite Area',
          description: 'Click and drag on the image to select the specific sprite you want to extract. You can adjust the selection by dragging the corners or edges.',
        },
        {
          title: 'Set Sprite Dimensions',
          description: 'Enter the width and height of your sprite frames if they are uniform. This helps generate accurate background-position values.',
        },
        {
          title: 'Copy the CSS Code',
          description: 'Get the CSS code with background-image, background-position, and size properties. Use this in your CSS to display the selected sprite.',
        },
      ],
    },
    relatedTools: ['border-radius', 'shadow-generator', 'css-to-tailwind'],
  },

  'json-to-typescript': {
    howToUse: {
      title: 'How to Convert JSON to TypeScript',
      steps: [
        {
          title: 'Paste Your JSON Data',
          description: 'Copy JSON from your API response, config file, or any other source and paste it into the input field. The tool handles nested objects and arrays automatically.',
        },
        {
          title: 'Choose Interface or Type',
          description: 'Select whether you want TypeScript interfaces or type aliases. Interfaces are better for objects that will be extended, types for unions and primitives.',
        },
        {
          title: 'Set Optional Properties',
          description: 'Choose whether fields should be optional or required. Making all properties optional is useful for partial API responses.',
        },
        {
          title: 'Review Generated Types',
          description: 'Check the generated TypeScript code. Nested objects become separate interfaces, and array types are properly inferred.',
        },
        {
          title: 'Copy to Your Project',
          description: 'Click copy and paste the TypeScript interfaces into your project. Add them to a types.ts file or declare them inline.',
        },
      ],
    },
    relatedTools: ['svg-to-react', 'base64', 'diff-checker'],
  },

  'css-to-tailwind': {
    howToUse: {
      title: 'How to Convert CSS to Tailwind Classes',
      steps: [
        {
          title: 'Paste Your CSS Code',
          description: 'Copy CSS from your stylesheet, browser DevTools, or any source. You can paste individual properties or entire CSS blocks.',
        },
        {
          title: 'Review the Conversion',
          description: 'See the equivalent Tailwind utility classes for your CSS. The tool maps common CSS properties to their Tailwind equivalents.',
        },
        {
          title: 'Handle Custom Values',
          description: 'For values not in the default Tailwind config, the tool suggests arbitrary value syntax like w-[123px] or using theme extension.',
        },
        {
          title: 'Copy Tailwind Classes',
          description: 'Click copy to get the Tailwind classes. Paste them directly into your className attribute in React, Vue, or HTML.',
        },
        {
          title: 'Refine as Needed',
          description: 'Some CSS properties may not have direct Tailwind equivalents. Use the @apply directive or arbitrary values for edge cases.',
        },
      ],
    },
    relatedTools: ['tailwind-class-sorter', 'tailwind-colors', 'css-unit-converter'],
  },

  'svg-to-react': {
    howToUse: {
      title: 'How to Convert SVG to React Components',
      steps: [
        {
          title: 'Paste SVG Code',
          description: 'Copy the SVG markup from your design tool (Figma, Illustrator, etc.) or any SVG file and paste it into the input field.',
        },
        {
          title: 'Choose Component Type',
          description: 'Select between functional component with TypeScript or JavaScript. TypeScript includes proper prop types for width, height, and className.',
        },
        {
          title: 'Set Component Name',
          description: 'Enter a name for your component. Use PascalCase like "IconArrow" or "LogoCompany". The tool will use this as the component function name.',
        },
        {
          title: 'Review the Generated Code',
          description: 'Check the converted React component. SVG attributes are converted to camelCase (e.g., fill-rule becomes fillRule), and the component accepts props.',
        },
        {
          title: 'Copy and Use in Your App',
          description: 'Copy the component code and save it to your components folder. Import and use it like any React component with width, height, and className props.',
        },
      ],
    },
    relatedTools: ['json-to-typescript', 'css-to-tailwind', 'base64'],
  },

  'css-unit-converter': {
    howToUse: {
      title: 'How to Convert CSS Units',
      steps: [
        {
          title: 'Enter Your Value',
          description: 'Type the value you want to convert in the input field. You can enter just the number or include the unit (e.g., 16 or 16px).',
        },
        {
          title: 'Select Source Unit',
          description: 'Choose the unit you are converting from: px, rem, em, pt, cm, mm, in, pc, vh, vw, or percentage.',
        },
        {
          title: 'Set Base Font Size',
          description: 'For rem and em conversions, set the base font size (typically 16px for browsers). This ensures accurate relative unit calculations.',
        },
        {
          title: 'View All Conversions',
          description: 'See your value converted to all other CSS units simultaneously. This helps you choose the best unit for responsive design.',
        },
        {
          title: 'Copy the Converted Value',
          description: 'Click the copy button next to any converted value to use it in your CSS. Relative units (rem, em) are recommended for accessibility.',
        },
      ],
    },
    relatedTools: ['css-letter-spacing', 'css-to-tailwind', 'border-radius'],
  },

  'css-letter-spacing': {
    howToUse: {
      title: 'How to Calculate CSS Letter Spacing',
      steps: [
        {
          title: 'Enter Tracking Value',
          description: 'If you have a tracking value from design tools like Figma or Photoshop (usually in percentage or em), enter it in the input field.',
        },
        {
          title: 'Set Font Size',
          description: 'Enter your font size in pixels. Letter spacing calculations are relative to font size, so this ensures accurate conversion.',
        },
        {
          title: 'View CSS Value',
          description: 'See the equivalent CSS letter-spacing value in pixels, em, or rem units. Use em for relative spacing that scales with font size.',
        },
        {
          title: 'Copy to Your Stylesheet',
          description: 'Click copy to get the CSS property. Add it to your typography styles for precise control over character spacing.',
        },
      ],
    },
    relatedTools: ['css-unit-converter', 'css-to-tailwind', 'lorem-ipsum'],
  },

  'color-converter': {
    howToUse: {
      title: 'How to Convert Colors',
      steps: [
        {
          title: 'Paste or Type a Color',
          description: 'Enter any color in the text field: HEX (#ff5500), RGB (rgb(255, 85, 0)), RGBA, HSL, or HSLA. The tool accepts all common formats.',
        },
        {
          title: 'Or Use the Color Picker',
          description: 'Click the color swatch to open the picker and choose a color visually. The picker and text input stay in sync.',
        },
        {
          title: 'View All Equivalent Formats',
          description: 'See HEX, HEX with alpha, RGB, RGBA, HSL, and HSLA side by side. Each row has a copy button for quick use.',
        },
        {
          title: 'Copy CSS Snippets',
          description: 'Use the CSS snippets section to copy ready-to-paste lines for color, background-color, border-color, CSS variables, or Tailwind arbitrary classes.',
        },
      ],
    },
    relatedTools: ['color-palette', 'contrast-checker', 'tailwind-colors'],
  },

  'regex-tester': {
    howToUse: {
      title: 'How to Test Regular Expressions',
      steps: [
        {
          title: 'Enter Your Regex Pattern',
          description: 'Type your regular expression in the pattern field. Include modifiers like /g for global, /i for case-insensitive, or /m for multiline.',
        },
        {
          title: 'Add Test String',
          description: 'Paste or type the text you want to test against your regex. This could be sample input, URLs, email addresses, or any text data.',
        },
        {
          title: 'View Matches in Real-Time',
          description: 'Matches are highlighted instantly as you type. See how many matches were found and which parts of your text match the pattern.',
        },
        {
          title: 'Read Pattern Explanation',
          description: 'View a human-readable explanation of what your regex pattern does. This helps you understand and debug complex patterns.',
        },
        {
          title: 'Test Edge Cases',
          description: 'Try different test strings to ensure your regex handles all expected inputs and edge cases. Adjust the pattern as needed.',
        },
      ],
    },
    relatedTools: ['diff-checker', 'slug-generator', 'base64'],
  },

  'base64': {
    howToUse: {
      title: 'How to Encode and Decode Base64',
      steps: [
        {
          title: 'Choose Encode or Decode',
          description: 'Select "Encode" to convert text or files to Base64, or "Decode" to convert Base64 strings back to readable text or images.',
        },
        {
          title: 'Enter Your Data',
          description: 'For encoding, paste text or upload an image/file. For decoding, paste the Base64 string (including data URL prefix for images).',
        },
        {
          title: 'View the Output',
          description: 'The converted result appears instantly. For images, you will see both the Base64 string and a preview of the decoded image.',
        },
        {
          title: 'Copy the Result',
          description: 'Click the copy button to copy the Base64 string. Use it in data URLs, API requests, or anywhere Base64 encoding is needed.',
        },
        {
          title: 'Download Decoded Images',
          description: 'When decoding images, use the download button to save the image file to your computer in its original format.',
        },
      ],
    },
    relatedTools: ['uuid-generator', 'json-to-typescript', 'diff-checker'],
  },

  'uuid-generator': {
    howToUse: {
      title: 'How to Generate UUIDs',
      steps: [
        {
          title: 'Choose UUID Format',
          description: 'Select your preferred format options: uppercase or lowercase letters, and with or without dashes. Most applications use lowercase with dashes.',
        },
        {
          title: 'Generate Single or Bulk',
          description: 'Click "Add" for one UUID at a time, or use the bulk generate buttons (5, 10, 25, 50) to create multiple UUIDs instantly.',
        },
        {
          title: 'Copy Individual UUIDs',
          description: 'Click the copy icon next to any UUID to copy it to your clipboard. Each UUID is unique and ready to use as an identifier.',
        },
        {
          title: 'Copy All UUIDs',
          description: 'Use "Copy All" to copy all generated UUIDs as a newline-separated list. Perfect for populating databases or test data.',
        },
        {
          title: 'Regenerate as Needed',
          description: 'Use the regenerate icon to create a new UUID in place of an existing one, or "Regenerate All" to refresh all UUIDs at once.',
        },
      ],
    },
    relatedTools: ['base64', 'slug-generator', 'lorem-ipsum'],
  },

  'lorem-ipsum': {
    howToUse: {
      title: 'How to Generate Placeholder Text',
      steps: [
        {
          title: 'Choose Text Type',
          description: 'Select classic Lorem Ipsum or developer-themed variants like Tech Lorem, Code Lorem, or Design Lorem for more relevant placeholder content.',
        },
        {
          title: 'Set Paragraph Count',
          description: 'Use the slider or input field to choose how many paragraphs you need (1-10). More paragraphs help visualize longer content layouts.',
        },
        {
          title: 'Adjust Words Per Paragraph',
          description: 'Set the approximate number of words for each paragraph. This helps match your placeholder text to your actual content length.',
        },
        {
          title: 'Preview the Output',
          description: 'See your generated placeholder text in the preview area. The text updates instantly as you adjust settings.',
        },
        {
          title: 'Copy to Your Project',
          description: 'Click copy to get the placeholder text. Paste it into your designs, prototypes, or content management systems.',
        },
      ],
    },
    relatedTools: ['slug-generator', 'uuid-generator', 'diff-checker'],
  },

  'slug-generator': {
    howToUse: {
      title: 'How to Generate URL Slugs',
      steps: [
        {
          title: 'Enter Your Text',
          description: 'Type or paste the title, heading, or text you want to convert into a URL-friendly slug. This could be a blog post title, product name, or category.',
        },
        {
          title: 'Choose Slug Format',
          description: 'Select between kebab-case (recommended for URLs), snake_case, or camelCase. Kebab-case is the standard for SEO-friendly URLs.',
        },
        {
          title: 'Review the Generated Slug',
          description: 'See the slug generated in real-time. Special characters are removed, spaces become hyphens, and text is lowercased for consistency.',
        },
        {
          title: 'Customize if Needed',
          description: 'Edit the generated slug if you want to shorten it or make adjustments. Keep slugs concise and descriptive for better SEO.',
        },
        {
          title: 'Copy and Use',
          description: 'Click copy to get your URL slug. Use it in your CMS, routing system, or anywhere you need clean, readable URLs.',
        },
      ],
    },
    relatedTools: ['lorem-ipsum', 'uuid-generator', 'regex-tester'],
  },

  'diff-checker': {
    howToUse: {
      title: 'How to Compare Text Differences',
      steps: [
        {
          title: 'Paste Original Text',
          description: 'Enter your original or "before" text in the left panel. This could be code, documents, configuration files, or any text content.',
        },
        {
          title: 'Paste Modified Text',
          description: 'Enter the updated or "after" version in the right panel. The tool will compare these two versions and highlight differences.',
        },
        {
          title: 'View Highlighted Differences',
          description: 'Added lines appear in green, removed lines in red, and modified lines show both colors. Line numbers help you locate changes quickly.',
        },
        {
          title: 'Toggle View Modes',
          description: 'Switch between side-by-side, unified, or split view modes. Each mode offers different ways to visualize and understand the changes.',
        },
        {
          title: 'Export or Share Results',
          description: 'Copy the diff output or share it with team members. Use this for code reviews, document comparisons, or tracking changes over time.',
        },
      ],
    },
    relatedTools: ['regex-tester', 'base64', 'json-to-typescript'],
  },

  'tailwind-colors': {
    howToUse: {
      title: 'How to Generate Tailwind Color Shades',
      steps: [
        {
          title: 'Choose Your Base Color',
          description: 'Select a color using the color picker or enter a hex code. This will be your primary brand color or the color you want to generate shades for.',
        },
        {
          title: 'Preview the Color Scale',
          description: 'See all 10 shades (50-950) generated automatically based on your base color. The shades range from very light to very dark.',
        },
        {
          title: 'Adjust Individual Shades',
          description: 'Click on any shade to fine-tune its color. This helps you match your brand guidelines or create the perfect color progression.',
        },
        {
          title: 'Copy Tailwind Config',
          description: 'Get the complete Tailwind configuration code to add to your tailwind.config.js file. This extends your theme with the new color scale.',
        },
        {
          title: 'Use in Your Classes',
          description: 'Once added to config, use your custom colors with Tailwind classes like bg-brand-500, text-brand-700, etc. All shades work with all utilities.',
        },
      ],
    },
    relatedTools: ['color-palette', 'css-to-tailwind', 'gradient-generator'],
  },

  'tailwind-class-sorter': {
    howToUse: {
      title: 'How to Sort Tailwind Classes',
      steps: [
        {
          title: 'Paste Your Classes',
          description: 'Copy the className string from your React/JSX component or HTML element and paste it into the input field. Include all Tailwind utility classes.',
        },
        {
          title: 'Choose Sorting Method',
          description: 'Select the official Tailwind recommended order, alphabetical sorting, or group by utility type (layout, typography, colors, etc.).',
        },
        {
          title: 'View Sorted Output',
          description: 'See your classes automatically reorganized according to the selected method. This improves readability and maintains consistency across your codebase.',
        },
        {
          title: 'Copy Sorted Classes',
          description: 'Click copy to get the sorted class string. Replace your original className with the sorted version.',
        },
        {
          title: 'Set Up Automatic Sorting',
          description: 'For automatic sorting, install the Prettier plugin for Tailwind CSS. This tool helps you understand the recommended order.',
        },
      ],
    },
    relatedTools: ['css-to-tailwind', 'tailwind-colors', 'gradient-generator'],
  },

  'qr-code': {
    howToUse: {
      title: 'How to Generate QR Codes',
      steps: [
        {
          title: 'Enter Your Content',
          description: 'Type or paste the URL, text, or data you want to encode in the QR code. This could be a website URL, contact information, WiFi credentials, or any text.',
        },
        {
          title: 'Customize Appearance',
          description: 'Adjust the size, foreground color, and background color to match your brand. Use the color presets for quick styling or enter custom hex colors.',
        },
        {
          title: 'Set Error Correction Level',
          description: 'Choose between L (7%), M (15%), Q (25%), or H (30%) error correction. Higher levels allow the QR code to be read even if partially damaged or obscured.',
        },
        {
          title: 'Preview Your QR Code',
          description: 'See your QR code update in real-time as you make changes. The preview shows exactly how your QR code will look when downloaded.',
        },
        {
          title: 'Download QR Code',
          description: 'Download as PNG for digital use or SVG for print materials. SVG format scales infinitely without losing quality, perfect for large prints.',
        },
      ],
    },
    relatedTools: ['base64', 'uuid-generator', 'placeholder-image'],
  },

  'password-generator': {
    howToUse: {
      title: 'How to Generate Secure Passwords',
      steps: [
        {
          title: 'Set Password Length',
          description: 'Use the slider to choose password length (8-64 characters). Longer passwords are more secure. We recommend at least 12 characters for most accounts.',
        },
        {
          title: 'Select Character Types',
          description: 'Check the boxes for uppercase letters, lowercase letters, numbers, and symbols. More character types increase password strength and entropy.',
        },
        {
          title: 'Check Password Strength',
          description: 'View the strength meter showing your password quality. Aim for "Good" or "Strong" ratings. The color-coded meter provides instant feedback.',
        },
        {
          title: 'Generate Multiple Passwords',
          description: 'Use the quick generate buttons to create 1, 5, 10, 25, or 50 passwords at once. Perfect for setting up multiple accounts or team members.',
        },
        {
          title: 'Copy and Use Safely',
          description: 'Click the copy button to copy individual passwords or use "Copy All" for bulk operations. Passwords are generated using cryptographically secure methods.',
        },
      ],
    },
    relatedTools: ['hash-generator', 'uuid-generator', 'base64'],
  },

  'word-counter': {
    howToUse: {
      title: 'How to Use Word Counter',
      steps: [
        {
          title: 'Paste Your Text',
          description: 'Copy and paste your text into the input area. The tool supports any text format including essays, articles, blog posts, and social media content.',
        },
        {
          title: 'View Real-Time Statistics',
          description: 'See word count, character count (with and without spaces), sentence count, and paragraph count update instantly as you type or edit.',
        },
        {
          title: 'Check Reading Time',
          description: 'View estimated reading time based on average reading speed (225 words per minute) and speaking time (150 words per minute).',
        },
        {
          title: 'Monitor Character Limits',
          description: 'Check your text against common platform character limits including Twitter, Instagram, LinkedIn, and meta descriptions for SEO.',
        },
        {
          title: 'Optimize Content Length',
          description: 'Use the statistics to ensure your content meets platform requirements or target word counts for essays, articles, and assignments.',
        },
      ],
    },
    relatedTools: ['lorem-ipsum', 'markdown-to-html', 'diff-checker'],
  },

  'hash-generator': {
    howToUse: {
      title: 'How to Generate Hashes',
      steps: [
        {
          title: 'Choose Input Method',
          description: 'Select between text input or file upload. Text mode is perfect for hashing strings, while file mode allows you to verify file integrity.',
        },
        {
          title: 'Enter Data to Hash',
          description: 'Type or paste your text in the input field, or upload a text file. The tool will process your input and generate hashes using multiple algorithms.',
        },
        {
          title: 'View All Hash Types',
          description: 'See MD5, SHA-1, SHA-256, and SHA-512 hashes generated simultaneously. Each algorithm has different security levels and use cases.',
        },
        {
          title: 'Copy Hash Values',
          description: 'Click the copy button next to any hash to copy it to your clipboard. Use these hashes for checksums, data integrity verification, or as unique identifiers.',
        },
        {
          title: 'Choose Right Algorithm',
          description: 'Use SHA-256 or SHA-512 for security purposes. MD5 and SHA-1 are suitable for checksums but not recommended for cryptographic applications.',
        },
      ],
    },
    relatedTools: ['password-generator', 'base64', 'uuid-generator'],
  },

  'timestamp-converter': {
    howToUse: {
      title: 'How to Convert Timestamps',
      steps: [
        {
          title: 'View Current Timestamp',
          description: 'See the current Unix timestamp in both seconds and milliseconds, along with various date format representations that update in real-time.',
        },
        {
          title: 'Choose Unit Type',
          description: 'Toggle between seconds and milliseconds based on your needs. Seconds are common in Unix systems, while milliseconds are used in JavaScript.',
        },
        {
          title: 'Convert Timestamp to Date',
          description: 'Enter a Unix timestamp to see it converted to ISO 8601, UTC, local time, and other human-readable formats instantly.',
        },
        {
          title: 'Convert Date to Timestamp',
          description: 'Use the datetime picker to select a date and time, then see the corresponding Unix timestamp in your chosen unit (seconds or milliseconds).',
        },
        {
          title: 'Copy Any Format',
          description: 'Click the copy button next to any timestamp or date format to use it in your application, database queries, or API requests.',
        },
      ],
    },
    relatedTools: ['uuid-generator', 'hash-generator', 'base64'],
  },

  'placeholder-image': {
    howToUse: {
      title: 'How to Generate Placeholder Images',
      steps: [
        {
          title: 'Set Image Dimensions',
          description: 'Use the sliders or input fields to set custom width and height in pixels. Or choose from preset sizes like Square, Banner, Hero, or Mobile.',
        },
        {
          title: 'Customize Colors',
          description: 'Select background and text colors using the color pickers or enter hex codes manually. Use color presets for quick styling options.',
        },
        {
          title: 'Add Custom Text',
          description: 'Enter optional custom text to display on the placeholder. Leave empty to show default dimensions (e.g., "600 × 400").',
        },
        {
          title: 'Choose Format',
          description: 'Select PNG for images with potential transparency, JPEG for smaller file sizes, or WebP for best compression with quality.',
        },
        {
          title: 'Download or Copy',
          description: 'Download the generated image or copy the data URL to use directly in HTML/CSS. Data URLs are perfect for quick prototyping.',
        },
      ],
    },
    relatedTools: ['image-compressor', 'qr-code', 'base64'],
  },

  'markdown-to-html': {
    howToUse: {
      title: 'How to Convert Markdown to HTML',
      steps: [
        {
          title: 'Paste Markdown Content',
          description: 'Copy your Markdown text from README files, documentation, or blog posts and paste it into the input area. Supports GitHub-flavored Markdown.',
        },
        {
          title: 'View Live Preview',
          description: 'Switch to Preview mode to see how your Markdown will render with proper styling, including headers, lists, code blocks, and tables.',
        },
        {
          title: 'Check HTML Output',
          description: 'Switch to HTML mode to see the generated HTML code. This is the actual markup that you can use in your web projects.',
        },
        {
          title: 'Use Markdown Features',
          description: 'Take advantage of headers, bold/italic text, links, images, code blocks with syntax highlighting, tables, blockquotes, and task lists.',
        },
        {
          title: 'Copy HTML Code',
          description: 'Click the copy button to copy the generated HTML. Paste it into your CMS, static site generator, or any HTML document.',
        },
      ],
    },
    relatedTools: ['code-formatter', 'diff-checker', 'base64'],
  },

  'code-minifier': {
    howToUse: {
      title: 'How to Minify Code',
      steps: [
        {
          title: 'Select Code Language',
          description: 'Choose between HTML, CSS, or JavaScript tabs based on the code you want to minify. Each language has optimized minification settings.',
        },
        {
          title: 'Paste Your Code',
          description: 'Copy code from your project files and paste it into the input area. The tool handles code of any size, from snippets to full files.',
        },
        {
          title: 'View File Size Reduction',
          description: 'See original size, minified size, bytes saved, and percentage reduction in real-time. Track how much smaller your code becomes.',
        },
        {
          title: 'Review Minified Output',
          description: 'Check the minified code in the output panel. Whitespace, comments, and unnecessary characters are removed while preserving functionality.',
        },
        {
          title: 'Copy Minified Code',
          description: 'Click copy to get the minified code. Use it in production to reduce file sizes, improve load times, and optimize bandwidth usage.',
        },
      ],
    },
    relatedTools: ['code-formatter', 'css-to-tailwind', 'image-compressor'],
  },

  'code-formatter': {
    howToUse: {
      title: 'How to Format Code',
      steps: [
        {
          title: 'Choose Language',
          description: 'Select JavaScript, HTML, CSS, or JSON from the tabs. Each language is formatted according to industry-standard style guides and best practices.',
        },
        {
          title: 'Adjust Format Settings',
          description: 'Set indentation size (2, 4, or 8 spaces) and choose between spaces or tabs. These settings control how your code will be formatted.',
        },
        {
          title: 'Paste Unformatted Code',
          description: 'Copy messy, unformatted code and paste it into the input area. The tool handles code with inconsistent spacing, missing indentation, and style issues.',
        },
        {
          title: 'View Formatted Output',
          description: 'See your code automatically formatted with consistent indentation, proper spacing, and standardized style. Powered by Prettier for professional results.',
        },
        {
          title: 'Copy Formatted Code',
          description: 'Click copy to get the beautifully formatted code. Use it in your projects for better readability and team consistency.',
        },
      ],
    },
    relatedTools: ['code-minifier', 'tailwind-class-sorter', 'diff-checker'],
  },
  'css-animations': {
    howToUse: {
      title: 'How to Create CSS Animations',
      steps: [
        {
          title: 'Choose an Animation',
          description: 'Browse the animation library and select from 35+ presets across 8 categories including fade, slide, scale, rotate, bounce, shake, attention, and special effects.',
        },
        {
          title: 'Preview Live',
          description: 'Watch your selected animation in real-time with play, pause, and reset controls. The preview updates instantly as you make changes.',
        },
        {
          title: 'Customize Properties',
          description: 'Fine-tune animation duration, delay, timing function, iteration count, direction, and fill mode using intuitive controls and sliders.',
        },
        {
          title: 'Choose Output Format',
          description: 'Select your preferred format: pure CSS with @keyframes, Tailwind config, or ready-to-use HTML class examples.',
        },
        {
          title: 'Copy and Use',
          description: 'Click the copy button to get your generated code and paste it directly into your project. Works with any CSS framework or vanilla HTML/CSS.',
        },
      ],
    },
    relatedTools: ['gradient-generator', 'shadow-generator', 'tailwind-colors'],
  },
  'case-converter': {
    howToUse: {
      title: 'How to Use Case Converter',
      steps: [
        {
          title: 'Enter or Paste Text',
          description: 'Type or paste your text into the input area. The tool works with any length of text.',
        },
        {
          title: 'Choose Case Type',
          description: 'Select the case you want: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, or Swap Case.',
        },
        {
          title: 'Copy the Result',
          description: 'The converted text appears in real time. Click the copy button to copy the result. All processing happens in your browser - your text never leaves your device.',
        },
      ],
    },
    relatedTools: ['word-counter', 'slug-generator', 'regex-tester'],
  },
  'cron-generator': {
    howToUse: {
      title: 'How to Use Cron Expression Generator',
      steps: [
        {
          title: 'Choose a Preset or Paste Expression',
          description: 'Click a preset (e.g. "Every day at 9:00 AM", "Weekdays at 5:00 PM") or paste your own 5-field cron expression (minute hour day month weekday).',
        },
        {
          title: 'View Description and Next Runs',
          description: 'The tool shows a human-readable description of the schedule and the next 5 run times in your local timezone.',
        },
        {
          title: 'Copy the Expression',
          description: 'Click the copy button to copy the cron expression for use in crontab, CI/CD, or schedulers. All processing runs in your browser.',
        },
      ],
    },
    relatedTools: ['timestamp-converter', 'regex-tester', 'code-formatter'],
  },
  'favicon-generator': {
    howToUse: {
      title: 'How to Use Favicon Generator',
      steps: [
        {
          title: 'Upload an Image',
          description: 'Drop an image or click to select. Supported formats: JPEG, PNG, WebP, GIF. Maximum file size is 5MB.',
        },
        {
          title: 'Choose Sizes',
          description: 'Select which sizes to generate: 16×16, 32×32, 48×48, and 180×180 (Apple touch icon). You can select one or more.',
        },
        {
          title: 'Download',
          description: 'Click "Download all as ZIP" to get all selected sizes in one file, or download individual PNGs. All processing happens in your browser.',
        },
      ],
    },
    relatedTools: ['image-compressor', 'image-resizer', 'placeholder-image'],
  },
  'image-resizer': {
    howToUse: {
      title: 'How to Use Image Resizer',
      steps: [
        {
          title: 'Upload an Image',
          description: 'Drop an image or click to select. Supported formats: JPEG, PNG, WebP, GIF. Maximum 10MB.',
        },
        {
          title: 'Set Dimensions or Scale',
          description: 'Enter width and height in pixels, or use the scale slider to resize by percentage. Enable "Lock aspect ratio" to keep proportions.',
        },
        {
          title: 'Optional: Center Crop',
          description: 'Enable "Center crop to exact size" to crop the image to the exact dimensions (useful for thumbnails).',
        },
        {
          title: 'Download',
          description: 'Click Download to save the resized image. All processing happens in your browser - your image never leaves your device.',
        },
      ],
    },
    relatedTools: ['image-compressor', 'favicon-generator', 'placeholder-image'],
  },
  'pdf-merger': {
    howToUse: {
      title: 'How to Use PDF Merger',
      steps: [
        {
          title: 'Upload PDFs',
          description: 'Drop PDF files onto the upload zone or click to select. You can add up to 20 files (max 20MB each, 50MB total).',
        },
        {
          title: 'Reorder',
          description: 'Drag and drop items in the list to change the order, or use the up/down arrows. The merged PDF will follow this order.',
        },
        {
          title: 'Merge & Download',
          description: 'Click "Merge & download" to combine all PDFs into one file. Processing happens in your browser - your files never leave your device.',
        },
      ],
    },
    relatedTools: ['image-compressor', 'code-formatter', 'base64'],
  },
};

/**
 * Get tool content by tool ID
 */
export function getToolContent(toolId: string): ToolContent | undefined {
  return toolContent[toolId];
}

/**
 * Check if a tool has content defined
 */
export function hasToolContent(toolId: string): boolean {
  return toolId in toolContent;
}
