'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';
import { tools, toolCategories, getToolsByCategory, searchTools } from '@/config/tools';
import { ToolCard } from '@/components/tools/shared';
import { ToolCategory } from '@/types/tools';

function ToolsHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = (searchParams.get('category') as ToolCategory | 'all') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(initialCategory);

  // Update URL when filters change
  const updateURL = useCallback((query: string, category: ToolCategory | 'all') => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newURL, { scroll: false });
  }, [pathname, router]);

  // Debounce search query updates to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(searchQuery, activeCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, updateURL]);

  const filteredTools = useMemo(() => {
    let result = searchQuery ? searchTools(searchQuery) : tools;
    
    if (activeCategory !== 'all') {
      result = result.filter((tool) => tool.category === activeCategory);
    }
    
    return result;
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'all' as const, name: 'All Tools', count: tools.length },
    ...Object.entries(toolCategories).map(([id, config]) => ({
      id: id as ToolCategory,
      name: config.name,
      count: getToolsByCategory(id as ToolCategory).length,
    })),
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Free Developer Tools</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Developer{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
            Beautiful, modern tools for everyday development. CSS generators, converters, 
            and utilities — all free, no sign-up required.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white placeholder-slate-500
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                ${
                  activeCategory === category.id
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:text-slate-300'
                }
              `}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-60">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <section>
          {activeCategory === 'all' && !searchQuery && (
            <h2 className="text-xl font-semibold text-white mb-6">All Tools</h2>
          )}
          
          {filteredTools.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">
                No tools found matching &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* Popular Tool Combinations */}
        {!searchQuery && activeCategory === 'all' && (
          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Popular Tool Combinations
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Design to Code Workflow */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Design to Code
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Create beautiful styles and convert them to production-ready code
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/gradient-generator"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Gradient Generator</span>
                  </Link>
                  <Link
                    href="/tools/shadow-generator"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Shadow Generator</span>
                  </Link>
                  <Link
                    href="/tools/css-to-tailwind"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>CSS to Tailwind</span>
                  </Link>
                </div>
              </div>

              {/* Type Safety Workflow */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Type-Safe Development
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Generate TypeScript types for your data and components
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/json-to-typescript"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>JSON to TypeScript</span>
                  </Link>
                  <Link
                    href="/tools/svg-to-react"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>SVG to React</span>
                  </Link>
                  <Link
                    href="/tools/diff-checker"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Diff Checker</span>
                  </Link>
                </div>
              </div>

              {/* Content Creation Workflow */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Content Creation
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Generate placeholder content and unique identifiers
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/lorem-ipsum"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Lorem Ipsum Generator</span>
                  </Link>
                  <Link
                    href="/tools/slug-generator"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Slug Generator</span>
                  </Link>
                  <Link
                    href="/tools/uuid-generator"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>UUID Generator</span>
                  </Link>
                </div>
              </div>

              {/* Tailwind Workflow */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Tailwind Mastery
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Complete toolkit for working with Tailwind CSS
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/tailwind-colors"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Tailwind Color Shades</span>
                  </Link>
                  <Link
                    href="/tools/css-to-tailwind"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>CSS to Tailwind</span>
                  </Link>
                  <Link
                    href="/tools/tailwind-class-sorter"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Class Sorter</span>
                  </Link>
                </div>
              </div>

              {/* CSS Styling Workflow */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  CSS Styling Toolkit
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Professional CSS effects and visual design
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/color-palette"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Color Palette Generator</span>
                  </Link>
                  <Link
                    href="/tools/gradient-generator"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Gradient Generator</span>
                  </Link>
                  <Link
                    href="/tools/border-radius"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Border Radius Generator</span>
                  </Link>
                </div>
              </div>

              {/* Developer Utilities */}
              <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Developer Utilities
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Essential tools for everyday development tasks
                </p>
                <div className="space-y-2">
                  <Link
                    href="/tools/base64"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Base64 Encoder/Decoder</span>
                  </Link>
                  <Link
                    href="/tools/regex-tester"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Regex Tester</span>
                  </Link>
                  <Link
                    href="/tools/diff-checker"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <span>→</span>
                    <span>Diff Checker</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Coming Soon */}
        <section className="mt-12 sm:mt-16 text-center">
          <div className="inline-block p-6 sm:p-8 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl">
            <p className="text-slate-500">More tools coming soon!</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function ToolsLoadingFallback() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Free Developer Tools</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Developer{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
            Beautiful, modern tools for everyday development. CSS generators, converters, 
            and utilities — all free, no sign-up required.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <div className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-900/60 border border-slate-700/60 rounded-xl h-12 sm:h-14 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-24 h-10 bg-slate-900/60 border border-slate-700/60 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-900/60 border border-slate-700/60 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ToolsHubPage() {
  return (
    <Suspense fallback={<ToolsLoadingFallback />}>
      <ToolsHubContent />
    </Suspense>
  );
}
