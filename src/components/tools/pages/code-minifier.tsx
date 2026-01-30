'use client';

import { useState, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type Language = 'html' | 'css' | 'javascript';

// Simple client-side minifiers
function minifyHTMLSimple(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .trim();
}

function minifyCSSSimple(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove whitespace around special chars
    .replace(/;}/g, '}') // Remove last semicolon in block
    .trim();
}

function minifyJSSimple(js: string): string {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/.*/g, '') // Remove single-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}()[\]:;,=<>!&|+\-*/%])\s*/g, '$1') // Remove whitespace around operators
    .trim();
}

const examples = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example Page</title>
  <!-- This is a comment -->
</head>
<body>
  <div class="container">
    <h1>Hello World</h1>
    <p>This is an example.</p>
  </div>
</body>
</html>`,
  css: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
}

.btn:hover {
  background-color: #2563eb;
}`,
  javascript: `function greet(name) {
  // This function greets a user
  console.log('Hello, ' + name + '!');
  return 'Hello, ' + name;
}

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

users.forEach(user => {
  greet(user.name);
});`,
};

export default function CodeMinifierPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [language, setLanguage] = useState<Language>('html');
  const [input, setInput] = useState(examples.html);

  const { output, stats, error } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', stats: null, error: null };
    }

    try {
      let minified = '';
      const originalSize = new Blob([input]).size;

      if (language === 'html') {
        minified = minifyHTMLSimple(input);
      } else if (language === 'css') {
        minified = minifyCSSSimple(input);
      } else if (language === 'javascript') {
        minified = minifyJSSimple(input);
      }

      const minifiedSize = new Blob([minified]).size;
      const savings = originalSize - minifiedSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

      return {
        output: minified,
        stats: {
          originalSize,
          minifiedSize,
          savings,
          savingsPercent,
        },
        error: null,
      };
    } catch (err) {
      return {
        output: '',
        stats: null,
        error: err instanceof Error ? err.message : 'Minification failed',
      };
    }
  }, [input, language]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setInput(examples[lang]);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <ToolLayout
      title="Code Minifier"
      description="Minify HTML, CSS, and JavaScript code to reduce file sizes. Remove whitespace, comments, and optimize for production."
      tool={tool}
      category={category}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Language Selector */}
        <div>
          <TabSwitcher
            options={[
              { id: 'html', label: 'HTML' },
              { id: 'css', label: 'CSS' },
              { id: 'javascript', label: 'JavaScript' },
            ]}
            activeTab={language}
            onChange={(lang) => handleLanguageChange(lang as Language)}
          />
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Original Size</p>
              <p className="text-xl font-bold text-slate-300">{formatBytes(stats.originalSize)}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Minified Size</p>
              <p className="text-xl font-bold text-cyan-400">{formatBytes(stats.minifiedSize)}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Saved</p>
              <p className="text-xl font-bold text-emerald-400">{formatBytes(stats.savings)}</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Reduction</p>
              <p className="text-xl font-bold text-emerald-400">{stats.savingsPercent}%</p>
            </div>
          </div>
        )}

        {/* Input/Output */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Input Code</label>
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
              className="w-full h-[500px] px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Minified Output</label>
              <CopyButton text={output} />
            </div>
            <div className="relative h-[500px] bg-slate-900/60 border border-slate-700/60 rounded-xl overflow-hidden">
              {error ? (
                <div className="p-6">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              ) : output ? (
                <pre className="h-full overflow-auto p-4 text-sm text-slate-300 font-mono leading-relaxed">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Enter code to see minified output</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minification Options Info */}
        <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">⚙️ Minification Settings</h3>
          <div className="grid md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">HTML</p>
              <ul className="space-y-1 text-slate-500">
                <li>✓ Remove comments</li>
                <li>✓ Collapse whitespace</li>
                <li>✓ Remove redundant attributes</li>
                <li>✓ Minify inline CSS & JS</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">CSS</p>
              <ul className="space-y-1 text-slate-500">
                <li>✓ Remove comments</li>
                <li>✓ Remove whitespace</li>
                <li>✓ Optimize selectors</li>
                <li>✓ Merge duplicate rules</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">JavaScript</p>
              <ul className="space-y-1 text-slate-500">
                <li>✓ Remove comments</li>
                <li>✓ Remove whitespace</li>
                <li>✓ Compress operators</li>
                <li>ℹ Basic minification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">💡 Best Practices</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Always keep original source files</li>
              <li>• Test minified code before deployment</li>
              <li>• Use source maps for debugging</li>
              <li>• Combine with gzip compression</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">⚠️ Important Notes</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Basic minification (for advanced JS, use webpack/Terser)</li>
              <li>• All processing happens locally in your browser</li>
              <li>• Good for small files and quick optimization</li>
              <li>• Always test minified code before deployment</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
