'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { Checkbox } from '@/components/ui';
import { getToolById, toolCategories } from '@/config/tools';
import * as prettier from 'prettier/standalone';
import * as parserHTML from 'prettier/plugins/html';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';
import * as parserPostCSS from 'prettier/plugins/postcss';

type Language = 'html' | 'css' | 'javascript' | 'json';

const examples = {
  html: `<!DOCTYPE html><html><head><title>Example</title></head><body><div class="container"><h1>Hello</h1><p>World</p></div></body></html>`,
  css: `.container{max-width:1200px;margin:0 auto;padding:20px}.btn{display:inline-block;padding:10px 20px;background:#3b82f6}`,
  javascript: `function greet(name){console.log('Hello, '+name);return 'Hello, '+name}const users=[{id:1,name:'Alice'},{id:2,name:'Bob'}];`,
  json: `{"name":"John Doe","age":30,"address":{"street":"123 Main St","city":"New York","zip":"10001"},"hobbies":["reading","coding","gaming"]}`,
};

export default function CodeFormatterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [language, setLanguage] = useState<Language>('javascript');
  const [input, setInput] = useState(examples.javascript);
  const [indentSize, setIndentSize] = useState(2);
  const [useTabs, setUseTabs] = useState(false);
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    if (!input.trim()) {
      setFormatted('');
      return;
    }

    const formatCode = async () => {
      try {
        let parser: 'html' | 'css' | 'babel' | 'json' = 'babel';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let plugins: any[] = [];

        if (language === 'html') {
          parser = 'html';
          plugins = [parserHTML];
        } else if (language === 'css') {
          parser = 'css';
          plugins = [parserPostCSS];
        } else if (language === 'json') {
          parser = 'json';
          plugins = [parserBabel, parserEstree];
        } else {
          parser = 'babel';
          plugins = [parserBabel, parserEstree];
        }

        const result = await prettier.format(input, {
          parser,
          plugins,
          tabWidth: indentSize,
          useTabs,
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'always',
          printWidth: 80,
        });

        setFormatted(result);
      } catch (err) {
        setFormatted(`/* Error formatting code: ${err instanceof Error ? err.message : 'Unknown error'} */`);
      }
    };

    formatCode();
  }, [input, language, indentSize, useTabs]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setInput(examples[lang]);
  };

  return (
    <ToolLayout
      title="Code Formatter"
      description="Format and beautify HTML, CSS, JavaScript, and JSON code with customizable indentation and style options."
      tool={tool}
      category={category}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Language Selector */}
        <div className="flex items-center justify-between">
          <TabSwitcher
            options={[
              { id: 'javascript', label: 'JavaScript' },
              { id: 'html', label: 'HTML' },
              { id: 'css', label: 'CSS' },
              { id: 'json', label: 'JSON' },
            ]}
            activeTab={language}
            onChange={(lang) => handleLanguageChange(lang as Language)}
          />
        </div>

        {/* Settings */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-300">Indent Size:</label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value))}
                className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {[2, 4, 8].map((size) => (
                  <option key={size} value={size}>
                    {size} spaces
                  </option>
                ))}
              </select>
            </div>

            <Checkbox
              checked={useTabs}
              onChange={(e) => setUseTabs(e.target.checked)}
              label="Use Tabs"
            />
          </div>
        </div>

        {/* Input/Output */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Unformatted Code</label>
              <button
                onClick={() => setInput(examples[language])}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Reset to example
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste your ${language.toUpperCase()} code here...`}
              className="w-full h-[600px] px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Formatted Code</label>
              <CopyButton text={formatted} />
            </div>
            <div className="relative h-[600px] bg-slate-900/60 border border-slate-700/60 rounded-xl overflow-hidden">
              {formatted ? (
                <pre className="h-full overflow-auto p-4 text-sm text-slate-300 font-mono leading-relaxed">
                  {formatted}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Enter code to see formatted output</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formatting Rules */}
        <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">📐 Formatting Rules Applied</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Indentation</p>
              <p className="text-slate-500">
                {useTabs ? 'Tabs' : `${indentSize} spaces`}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Line Width</p>
              <p className="text-slate-500">80 characters</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Quotes</p>
              <p className="text-slate-500">Single quotes</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Semicolons</p>
              <p className="text-slate-500">Always add</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Trailing Commas</p>
              <p className="text-slate-500">ES5 compatible</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Bracket Spacing</p>
              <p className="text-slate-500">Enabled</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">Arrow Functions</p>
              <p className="text-slate-500">Always parentheses</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">HTML Whitespace</p>
              <p className="text-slate-500">CSS display rules</p>
            </div>
          </div>
        </div>

        {/* Tips & Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">💡 Benefits</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Consistent code style across team</li>
              <li>• Improved code readability</li>
              <li>• Fewer style-related code reviews</li>
              <li>• Industry-standard formatting rules</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">🔧 Editor Integration</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• VS Code: Install Prettier extension</li>
              <li>• Enable &quot;Format on Save&quot;</li>
              <li>• Add .prettierrc config file</li>
              <li>• Integrate with ESLint if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
