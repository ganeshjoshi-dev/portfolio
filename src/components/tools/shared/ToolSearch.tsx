'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { searchTools } from '@/config/tools';
import { Tool } from '@/types/tools';

interface ToolSearchProps {
  /** Current tool id to exclude from results (optional) */
  currentToolId?: string;
  /** Compact style for detail page */
  compact?: boolean;
  className?: string;
}

export default function ToolSearch({
  currentToolId,
  compact = true,
  className = '',
}: ToolSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const list = searchTools(query.trim());
    return currentToolId
      ? list.filter((t) => t.id !== currentToolId)
      : list;
  }, [query, currentToolId]);

  const showDropdown = isOpen && query.trim().length > 0;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard: Escape to close, ArrowDown/ArrowUp to move, Enter to select
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) {
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
      return;
    }
    if (e.key === 'Enter' && focusedIndex >= 0 && results[focusedIndex]) {
      e.preventDefault();
      window.location.href = results[focusedIndex].path;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search all tools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={`
            w-full bg-slate-900/60 border border-slate-700/60 rounded-lg text-white
            placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2
            focus:ring-cyan-400/20 transition-all duration-300
            ${compact ? 'pl-9 pr-3 py-2 text-sm' : 'pl-10 pr-4 py-3'}
          `}
        />
      </div>

      {showDropdown && (
        <div
          className="
            absolute top-full left-0 right-0 mt-1 z-50 max-h-72 overflow-auto
            bg-slate-900 border border-slate-700/60 rounded-xl shadow-xl
            py-1
          "
        >
          {results.length > 0 ? (
            <ul role="listbox" aria-label="Search results">
              {results.map((tool: Tool, index: number) => (
                <li key={tool.id} role="option" aria-selected={index === focusedIndex}>
                  <Link
                    href={tool.path}
                    className={`
                      block px-3 py-2.5 text-left transition-colors
                      hover:bg-slate-800/80 focus:bg-slate-800/80
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50
                      ${index === focusedIndex ? 'bg-slate-800/80' : ''}
                    `}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <span className="font-medium text-white block">{tool.name}</span>
                    <span className="text-xs text-slate-400 line-clamp-1">{tool.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-4 text-sm text-slate-500 text-center">
              No tools found for &quot;{query.trim()}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
