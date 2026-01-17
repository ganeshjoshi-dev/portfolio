'use client';

import { useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { tools, toolCategories, getToolsByCategory, searchTools } from '@/config/tools';
import { ToolCard } from '@/components/tools/shared';
import { ToolCategory } from '@/types/tools';

export default function ToolsHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

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
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded-full text-cyan-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Free Developer Tools</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Developer{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
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
                w-full pl-12 pr-4 py-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white placeholder-slate-500
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Coming Soon */}
        <section className="mt-16 text-center">
          <div className="inline-block p-8 bg-slate-900/40 border border-dashed border-slate-700/60 rounded-xl">
            <p className="text-slate-500">More tools coming soon!</p>
          </div>
        </section>
      </div>
    </main>
  );
}
