'use client';

import { useState, useMemo } from 'react';
import { ToolLayout, CodeOutput, CopyButton, TabSwitcher } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

type SectionId = 'basic' | 'og' | 'twitter' | 'jsonld';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function MetaTagsPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [activeSection, setActiveSection] = useState<SectionId>('basic');
  const [title, setTitle] = useState('My Page Title');
  const [description, setDescription] = useState('A short description of the page for search and social.');
  const [url, setUrl] = useState('https://example.com/page');
  const [image, setImage] = useState('https://example.com/og-image.jpg');
  const [siteName, setSiteName] = useState('My Site');
  const [author, setAuthor] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');

  const basicMeta = useMemo(() => {
    const parts: string[] = [];
    parts.push(`<meta charset="UTF-8">`);
    parts.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    parts.push(`<title>${escapeHtml(title)}</title>`);
    parts.push(`<meta name="description" content="${escapeHtml(description)}">`);
    if (author) parts.push(`<meta name="author" content="${escapeHtml(author)}">`);
    return parts.join('\n');
  }, [title, description, author]);

  const ogMeta = useMemo(() => {
    const parts: string[] = [];
    parts.push(`<meta property="og:type" content="website">`);
    parts.push(`<meta property="og:title" content="${escapeHtml(title)}">`);
    parts.push(`<meta property="og:description" content="${escapeHtml(description)}">`);
    parts.push(`<meta property="og:url" content="${escapeHtml(url)}">`);
    parts.push(`<meta property="og:image" content="${escapeHtml(image)}">`);
    if (siteName) parts.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}">`);
    return parts.join('\n');
  }, [title, description, url, image, siteName]);

  const twitterMeta = useMemo(() => {
    const parts: string[] = [];
    parts.push(`<meta name="twitter:card" content="summary_large_image">`);
    parts.push(`<meta name="twitter:title" content="${escapeHtml(title)}">`);
    parts.push(`<meta name="twitter:description" content="${escapeHtml(description)}">`);
    parts.push(`<meta name="twitter:image" content="${escapeHtml(image)}">`);
    if (twitterHandle) parts.push(`<meta name="twitter:site" content="${escapeHtml(twitterHandle)}">`);
    return parts.join('\n');
  }, [title, description, image, twitterHandle]);

  const jsonLd = useMemo(() => {
    const obj = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url,
      ...(siteName && { publisher: { '@type': 'Organization', name: siteName } }),
      ...(author && { author: { '@type': 'Person', name: author } }),
    };
    return JSON.stringify(obj, null, 2);
  }, [title, description, url, siteName, author]);

  const fullHtml = useMemo(
    () =>
      [
        '<!-- Basic Meta -->',
        basicMeta,
        '',
        '<!-- Open Graph -->',
        ogMeta,
        '',
        '<!-- Twitter -->',
        twitterMeta,
        '',
        '<!-- JSON-LD -->',
        '<script type="application/ld+json">',
        jsonLd,
        '</script>',
      ].join('\n'),
    [basicMeta, ogMeta, twitterMeta, jsonLd]
  );

  const sectionContent: Record<SectionId, string> = useMemo(
    () => ({
      basic: basicMeta,
      og: ogMeta,
      twitter: twitterMeta,
      jsonld: `<script type="application/ld+json">\n${jsonLd}\n</script>`,
    }),
    [basicMeta, ogMeta, twitterMeta, jsonLd]
  );

  const titleLength = title.length;
  const descLength = description.length;
  const titleOk = titleLength <= 60;
  const descOk = descLength <= 160;

  return (
    <ToolLayout
      title="Meta Tag Generator"
      description="Generate meta tags for SEO and social sharing. Open Graph, Twitter Cards, and structured data."
      tool={tool}
      category={category}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
              <p className={`text-xs mt-1 ${titleOk ? 'text-slate-400' : 'text-amber-400'}`}>
                {titleLength}/60 (recommended for SEO)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meta description"
                rows={3}
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm resize-none"
              />
              <p className={`text-xs mt-1 ${descOk ? 'text-slate-400' : 'text-amber-400'}`}>
                {descLength}/160 (recommended for search snippets)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Image URL (OG / Twitter)</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/og-image.jpg"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Site name (optional)</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Site"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Author (optional)</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Twitter @ (optional)</label>
              <input
                type="text"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <TabSwitcher
              options={[
                { id: 'basic', label: 'Basic' },
                { id: 'og', label: 'Open Graph' },
                { id: 'twitter', label: 'Twitter' },
                { id: 'jsonld', label: 'JSON-LD' },
              ]}
              activeTab={activeSection}
              onChange={(id) => setActiveSection(id as SectionId)}
            />
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">Generated output</h3>
              <CopyButton text={sectionContent[activeSection]} />
            </div>
            <CodeOutput
              code={sectionContent[activeSection]}
              language="html"
              title={activeSection === 'jsonld' ? 'JSON-LD' : activeSection === 'basic' ? 'Basic Meta' : activeSection === 'og' ? 'Open Graph' : 'Twitter'}
              showLineNumbers
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-300">Full HTML (all sections)</h3>
            <CopyButton text={fullHtml} />
          </div>
          <CodeOutput code={fullHtml} language="html" title="Full meta block" showLineNumbers />
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Tips</h3>
          <ul className="text-xs text-slate-400 space-y-1">
            <li>• Title: keep under 60 characters for search results.</li>
            <li>• Description: keep under 160 characters for snippets.</li>
            <li>• OG image: use 1200×630px for best display on social.</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
