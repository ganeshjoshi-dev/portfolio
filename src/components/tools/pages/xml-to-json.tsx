'use client';

import { useState, useMemo } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type Mode = 'xml-to-json' | 'json-to-xml';

const exampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>My App</name>
  <version>1.0</version>
  <items>
    <item>One</item>
    <item>Two</item>
  </items>
</root>`;

const exampleJson = `{
  "root": {
    "name": "My App",
    "version": "1.0",
    "items": {
      "item": ["One", "Two"]
    }
  }
}`;

const parser = new XMLParser({
  ignoreDeclaration: true,
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});
const builder = new XMLBuilder({
  attributeNamePrefix: '@_',
  suppressEmptyNode: true,
});

const TEXTAREA_CLASS =
  'w-full h-[280px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

export default function XmlToJsonPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [mode, setMode] = useState<Mode>('xml-to-json');
  const [xmlInput, setXmlInput] = useState(exampleXml);
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [jsonIndent, setJsonIndent] = useState(2);

  const xmlToJsonResult = useMemo(() => {
    const trimmed = xmlInput.trim();
    if (!trimmed) return { success: true as const, output: '', error: null };
    try {
      const obj = parser.parse(trimmed);
      const output = JSON.stringify(obj, null, jsonIndent);
      return { success: true, output, error: null };
    } catch (e) {
      const err = e as Error;
      return { success: false as const, output: '', error: err.message };
    }
  }, [xmlInput, jsonIndent]);

  const jsonToXmlResult = useMemo(() => {
    const trimmed = jsonInput.trim();
    if (!trimmed) return { success: true as const, output: '', error: null };
    try {
      const obj = JSON.parse(trimmed);
      const output = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(obj);
      return { success: true, output, error: null };
    } catch (e) {
      const err = e as Error;
      return { success: false as const, output: '', error: err.message };
    }
  }, [jsonInput]);

  const isXmlToJson = mode === 'xml-to-json';
  const result = isXmlToJson ? xmlToJsonResult : jsonToXmlResult;

  return (
    <ToolLayout
      title="XML to JSON Converter"
      description="Convert XML to JSON and JSON to XML. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <TabSwitcher
          options={[
            { id: 'xml-to-json', label: 'XML → JSON' },
            { id: 'json-to-xml', label: 'JSON → XML' },
          ]}
          activeTab={mode}
          onChange={(id) => setMode(id as Mode)}
        />

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {isXmlToJson ? 'XML input' : 'JSON input'}
              </label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={isXmlToJson ? xmlInput : jsonInput}
              onChange={(e) =>
                isXmlToJson ? setXmlInput(e.target.value) : setJsonInput(e.target.value)
              }
              placeholder={isXmlToJson ? 'Paste XML...' : 'Paste JSON...'}
              spellCheck={false}
            />
            {!result.success && result.error && (
              <p className="text-sm text-red-400" role="alert">
                {result.error}
              </p>
            )}
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {isXmlToJson ? 'JSON output' : 'XML output'}
              </label>
              {result.success && result.output && (
                <CopyButton text={result.output} className="text-cyan-400 hover:text-cyan-300 text-sm" />
              )}
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={result.output}
              readOnly
              placeholder={result.success ? '' : 'Invalid input'}
            />
          </div>
        </div>

        {isXmlToJson && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">JSON indent:</span>
            <select
              value={jsonIndent}
              onChange={(e) => setJsonIndent(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-cyan-400"
            >
              <option value={0}>Minified</option>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        )}

        <p className="text-xs text-slate-500">
          Conversion runs in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
