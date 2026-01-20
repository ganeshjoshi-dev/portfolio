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
