'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type OutputType = 'jsx' | 'tsx';

function convertSvgToReact(svg: string, componentName: string, outputType: OutputType): string {
  if (!svg.trim()) return '';

  try {
    let processed = svg
      // Convert attributes to React format
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/stroke-opacity=/g, 'strokeOpacity=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/font-family=/g, 'fontFamily=')
      .replace(/font-size=/g, 'fontSize=')
      .replace(/font-weight=/g, 'fontWeight=')
      .replace(/text-anchor=/g, 'textAnchor=')
      .replace(/xlink:href=/g, 'xlinkHref=')
      // Remove XML declaration
      .replace(/<\?xml[^>]*\?>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Add props spread to SVG element
    processed = processed.replace(
      /<svg([^>]*)>/,
      '<svg$1 {...props}>'
    );

    if (outputType === 'tsx') {
      return `import React from 'react';

interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ 
  size = 24, 
  ...props 
}) => {
  return (
    ${processed.replace(/width="[^"]*"/, 'width={size}').replace(/height="[^"]*"/, 'height={size}')}
  );
};

export default ${componentName};`;
    }

    return `import React from 'react';

export const ${componentName} = ({ size = 24, ...props }) => {
  return (
    ${processed.replace(/width="[^"]*"/, 'width={size}').replace(/height="[^"]*"/, 'height={size}')}
  );
};

export default ${componentName};`;
  } catch {
    return '// Error converting SVG - please check your input';
  }
}

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <path d="m9 12 2 2 4-4"/>
</svg>`;

export default function SvgToReactPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState(sampleSvg);
  const [componentName, setComponentName] = useState('Icon');
  const [outputType, setOutputType] = useState<OutputType>('tsx');

  const output = useMemo(() => {
    return convertSvgToReact(input, componentName, outputType);
  }, [input, componentName, outputType]);

  return (
    <ToolLayout
      title="SVG to React"
      description="Convert SVG code to React components with TypeScript support."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input */}
        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-sm font-medium text-slate-300">SVG Input</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SVG code here..."
            className="
              w-full h-[300px] lg:h-[400px] p-4 bg-slate-900/60 border border-slate-700/60
              rounded-xl text-white font-mono text-sm resize-none
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
        </div>

        {/* Output */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-sm font-medium text-slate-300">React Component</h3>
            <TabSwitcher
              options={[
                { id: 'tsx', label: 'TypeScript' },
                { id: 'jsx', label: 'JavaScript' },
              ]}
              activeTab={outputType}
              onChange={(id) => setOutputType(id as OutputType)}
            />
          </div>

          <div className="mb-3 lg:mb-4">
            <label className="block text-xs text-slate-400 mb-2">Component Name</label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value.replace(/[^a-zA-Z0-9]/g, '') || 'Icon')}
              className="
                w-full sm:w-auto px-3 py-2 bg-slate-800/60 border border-slate-700/60
                rounded-lg text-white text-sm
                focus:border-cyan-400/50 focus:outline-none
                transition-all duration-300
              "
            />
          </div>

          <CodeOutput code={output} language={outputType === 'tsx' ? 'tsx' : 'jsx'} showLineNumbers />
        </div>
      </div>
    </ToolLayout>
  );
}
