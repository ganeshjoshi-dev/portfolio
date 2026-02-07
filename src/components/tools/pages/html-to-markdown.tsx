'use client';

import { useState, useMemo } from 'react';
import TurndownService from 'turndown';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const exampleHtml = `<h1>Hello World</h1>
<p>This is a <strong>bold</strong> and <em>italic</em> paragraph with a <a href="https://example.com">link</a>.</p>
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>`;

const TEXTAREA_CLASS =
  'w-full h-[280px] p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono text-sm resize-none';

function getTurndown(): InstanceType<typeof TurndownService> {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  td.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: (content) => `~~${content}~~`,
  });
  return td;
}

export default function HtmlToMarkdownPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [html, setHtml] = useState(exampleHtml);

  const markdown = useMemo(() => {
    const trimmed = html.trim();
    if (!trimmed) return '';
    try {
      const td = getTurndown();
      return td.turndown(trimmed);
    } catch {
      return '';
    }
  }, [html]);

  return (
    <ToolLayout
      title="HTML to Markdown"
      description="Convert HTML to Markdown. Paste HTML and get clean Markdown. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">HTML input</label>
              <span className="min-w-[2.5rem] flex-shrink-0" aria-hidden />
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste HTML..."
              spellCheck={false}
            />
          </div>
          <div className="space-y-2 min-w-0">
            <div className="min-h-[2.5rem] flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Markdown output</label>
              {markdown && <CopyButton text={markdown} className="text-cyan-400 hover:text-cyan-300 text-sm" />}
            </div>
            <textarea
              className={TEXTAREA_CLASS}
              value={markdown}
              readOnly
              placeholder="Markdown will appear here..."
            />
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Conversion runs in your browser. No data is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}
