'use client';

import { useState, useMemo } from 'react';
import yaml from 'js-yaml';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { jsonToYaml } from '@/lib/tools/json';

type Mode = 'yaml-to-json' | 'json-to-yaml';

const exampleYaml = `name: My App
version: 1.0.0
env: production
features:
  - auth
  - api
database:
  host: localhost
  port: 5432
`;

const exampleJson = `{
  "name": "My App",
  "version": "1.0.0",
  "env": "production",
  "features": ["auth", "api"],
  "database": {
    "host": "localhost",
    "port": 5432
  }
}`;

const TEXTAREA_CLASS =
  'w-full h-[280px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

export default function YamlJsonPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [mode, setMode] = useState<Mode>('yaml-to-json');
  const [yamlInput, setYamlInput] = useState(exampleYaml);
  const [jsonInput, setJsonInput] = useState(exampleJson);
  const [jsonIndent, setJsonIndent] = useState(2);

  const yamlToJsonResult = useMemo(() => {
    const trimmed = yamlInput.trim();
    if (!trimmed) return { success: true as const, output: '', error: null };
    try {
      const data = yaml.load(trimmed);
      const output = JSON.stringify(data, null, jsonIndent);
      return { success: true, output, error: null };
    } catch (e) {
      const err = e as Error;
      return { success: false as const, output: '', error: err.message };
    }
  }, [yamlInput, jsonIndent]);

  const jsonToYamlResult = useMemo(() => {
    const trimmed = jsonInput.trim();
    if (!trimmed) return { success: true as const, output: '', error: null };
    try {
      const data = JSON.parse(trimmed);
      const output = jsonToYaml(data);
      return { success: true, output, error: null };
    } catch (e) {
      const err = e as Error;
      return { success: false as const, output: '', error: err.message };
    }
  }, [jsonInput]);

  const isYamlToJson = mode === 'yaml-to-json';
  const result = isYamlToJson ? yamlToJsonResult : jsonToYamlResult;

  return (
    <ToolLayout
      title="YAML to JSON Converter"
      description="Convert YAML to JSON and JSON to YAML. For configs, CI, and docs. All in your browser."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <TabSwitcher
          options={[
            { id: 'yaml-to-json', label: 'YAML → JSON' },
            { id: 'json-to-yaml', label: 'JSON → YAML' },
          ]}
          activeTab={mode}
          onChange={(id) => setMode(id as Mode)}
        />

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                {isYamlToJson ? 'YAML input' : 'JSON input'}
              </label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={isYamlToJson ? yamlInput : jsonInput}
              onChange={(e) =>
                isYamlToJson ? setYamlInput(e.target.value) : setJsonInput(e.target.value)
              }
              placeholder={isYamlToJson ? 'Paste YAML...' : 'Paste JSON...'}
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
                {isYamlToJson ? 'JSON output' : 'YAML output'}
              </label>
              {result.success && result.output && (
                <CopyButton
                  text={result.output}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                />
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

        {isYamlToJson && (
          <div className="flex items-center gap-4">
            <label className="text-sm text-slate-400">JSON indent:</label>
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
