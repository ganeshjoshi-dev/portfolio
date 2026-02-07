'use client';

import { useState, useMemo } from 'react';
import React from 'react';
import DOMPurify from 'dompurify';
import { ToolLayout, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import { marked } from 'marked';

const defaultMarkdown = `# Markdown to HTML Converter

Convert your **Markdown** to *HTML* with live preview!

## Features

- GitHub-flavored markdown support
- Live preview
- Code syntax highlighting
- Tables, lists, and more

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Lists

- Item 1
- Item 2
  - Nested item
  - Another nested item

### Links & Images

[Visit Example](https://example.com)

### Blockquote

> "The best way to predict the future is to invent it."
> — Alan Kay

### Table

| Feature | Supported |
|---------|-----------|
| Headers | ✅ |
| Tables  | ✅ |
| Code    | ✅ |
`;

export default function MarkdownToHTMLPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');

  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const html = useMemo(() => {
    try {
      const raw = marked.parse(markdown) as string;
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
    } catch {
      return '<p style="color: red;">Error parsing markdown</p>';
    }
  }, [markdown]);

  return (
    <ToolLayout
      title="Markdown to HTML"
      description="Convert Markdown to HTML with live preview. Supports GitHub-flavored markdown, tables, code blocks, and more."
      tool={tool}
      category={category}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Panel */}
          <div className="space-y-3 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Markdown Input</label>
              <button
                onClick={() => setMarkdown(defaultMarkdown)}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Reset to example
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Enter your Markdown here..."
              className="w-full h-[600px] px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Output Panel */}
          <div className="space-y-3 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <TabSwitcher
                options={[
                  { id: 'preview', label: 'Preview' },
                  { id: 'html', label: 'HTML' },
                ]}
                activeTab={activeTab}
                onChange={(tab) => setActiveTab(tab as 'preview' | 'html')}
              />
              <CopyButton text={html} />
            </div>

            <div className="h-[600px] overflow-auto bg-slate-900/60 border border-slate-700/60 rounded-xl">
              {activeTab === 'preview' ? (
                <div
                  className="p-6 prose prose-invert prose-slate max-w-none
                    prose-headings:text-slate-200
                    prose-p:text-slate-300
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-slate-200
                    prose-code:text-cyan-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-slate-800/60 prose-pre:border prose-pre:border-slate-700/60
                    prose-blockquote:border-l-cyan-400 prose-blockquote:text-slate-400
                    prose-th:text-slate-200
                    prose-td:text-slate-300
                    prose-li:text-slate-300
                  "
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <pre className="p-6 text-sm text-slate-300 font-mono overflow-auto">
                  <code>{html}</code>
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Markdown Quick Reference */}
        <div className="bg-slate-900/40 border border-slate-700/60 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">📝 Markdown Quick Reference</h3>
          <div className="grid md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Headers</p>
              <code className="block text-slate-500 font-mono">
                # H1<br />
                ## H2<br />
                ### H3
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Emphasis</p>
              <code className="block text-slate-500 font-mono">
                **bold**<br />
                *italic*<br />
                ~~strikethrough~~
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Links</p>
              <code className="block text-slate-500 font-mono">
                [text](url)<br />
                ![alt](image.jpg)
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Lists</p>
              <code className="block text-slate-500 font-mono">
                - Item 1<br />
                - Item 2<br />
                {'  '}- Nested
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Code</p>
              <code className="block text-slate-500 font-mono">
                `inline code`<br />
                ```language<br />
                code block<br />
                ```
              </code>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium">Blockquote</p>
              <code className="block text-slate-500 font-mono">
                &gt; Quote text<br />
                &gt; Second line
              </code>
            </div>
          </div>
        </div>

        {/* Supported Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">✅ Supported Features</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• GitHub-flavored markdown (GFM)</li>
              <li>• Tables with alignment</li>
              <li>• Fenced code blocks</li>
              <li>• Strikethrough text</li>
              <li>• Task lists</li>
              <li>• Automatic link detection</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">💡 Tips</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Use blank lines to separate blocks</li>
              <li>• Indent with 2 spaces for nested lists</li>
              <li>• Triple backticks for code blocks</li>
              <li>• Tables need header separator row</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
