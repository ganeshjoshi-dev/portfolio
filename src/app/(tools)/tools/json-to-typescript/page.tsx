'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('json-to-typescript')!;
const category = toolCategories[tool.category];

type OutputType = 'interface' | 'type';

function jsonToTypeScript(json: string, rootName: string, outputType: OutputType): string {
  try {
    const parsed = JSON.parse(json);
    const interfaces: string[] = [];

    function getType(value: unknown, name: string): string {
      if (value === null) return 'null';
      if (Array.isArray(value)) {
        if (value.length === 0) return 'unknown[]';
        const itemTypes = new Set(value.map((item) => getType(item, `${name}Item`)));
        if (itemTypes.size === 1) {
          return `${Array.from(itemTypes)[0]}[]`;
        }
        return `(${Array.from(itemTypes).join(' | ')})[]`;
      }
      if (typeof value === 'object') {
        generateInterface(value as Record<string, unknown>, name);
        return name;
      }
      return typeof value;
    }

    function generateInterface(obj: Record<string, unknown>, name: string): void {
      const properties = Object.entries(obj)
        .map(([key, value]) => {
          const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
          const typeName = name + key.charAt(0).toUpperCase() + key.slice(1);
          return `  ${propName}: ${getType(value, typeName)};`;
        })
        .join('\n');

      const keyword = outputType === 'interface' ? 'interface' : 'type';
      const assignment = outputType === 'type' ? ' = ' : ' ';
      const wrapper = outputType === 'type' ? ['{\n', '\n}'] : ['{\n', '\n}'];

      interfaces.unshift(`export ${keyword} ${name}${assignment}${wrapper[0]}${properties}${wrapper[1]}`);
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === 'object') {
        generateInterface(parsed[0] as Record<string, unknown>, rootName);
        return interfaces.join('\n\n') + `\n\nexport type ${rootName}Array = ${rootName}[];`;
      }
      return `export type ${rootName} = ${getType(parsed, rootName)};`;
    }

    generateInterface(parsed as Record<string, unknown>, rootName);
    return interfaces.join('\n\n');
  } catch {
    return '// Invalid JSON - please check your input';
  }
}

const sampleJson = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "user"],
  "profile": {
    "avatar": "https://example.com/avatar.png",
    "bio": "Software Developer"
  }
}`;

export default function JsonToTypeScriptPage() {
  const [input, setInput] = useState(sampleJson);
  const [rootName, setRootName] = useState('Root');
  const [outputType, setOutputType] = useState<OutputType>('interface');

  const output = useMemo(() => {
    return jsonToTypeScript(input, rootName, outputType);
  }, [input, rootName, outputType]);

  const isValidJson = useMemo(() => {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }, [input]);

  return (
    <ToolLayout
      title="JSON to TypeScript"
      description="Convert JSON objects to TypeScript interfaces or type definitions."
      tool={tool}
      category={category}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">JSON Input</h3>
            {!isValidJson && input.trim() && (
              <span className="text-xs text-red-400">Invalid JSON</span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="
              w-full h-[400px] p-4 bg-slate-900/60 border border-slate-700/60
              rounded-xl text-white font-mono text-sm resize-none
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">TypeScript Output</h3>
            <TabSwitcher
              options={[
                { id: 'interface', label: 'Interface' },
                { id: 'type', label: 'Type' },
              ]}
              activeTab={outputType}
              onChange={(id) => setOutputType(id as OutputType)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-2">Root Name</label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value || 'Root')}
              className="
                px-3 py-2 bg-slate-800/60 border border-slate-700/60
                rounded-lg text-white text-sm
                focus:border-cyan-400/50 focus:outline-none
                transition-all duration-300
              "
            />
          </div>

          <CodeOutput code={output} language="typescript" showLineNumbers />
        </div>
      </div>
    </ToolLayout>
  );
}
