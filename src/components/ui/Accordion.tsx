'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  /** Optional custom content for the header. When set, used instead of title string. Do not put buttons here (use titleAction). */
  titleContent?: React.ReactNode;
  /** Optional action (e.g. icon button) rendered in the header, outside the toggle button. Use for buttons to avoid nesting. */
  titleAction?: React.ReactNode;
  content: React.ReactNode;
  defaultExpanded?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

interface AccordionItemProps {
  item: AccordionItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function AccordionItemComponent({ item, isExpanded, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  // Update height when content changes
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight);
        }
      });
      
      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [isExpanded]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="border border-slate-700/60 rounded-lg overflow-visible">
      <div className="flex items-center gap-2 p-4 bg-slate-900/40 hover:bg-slate-900/60">
        <button
          id={`accordion-button-${item.id}`}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
          aria-controls={`accordion-content-${item.id}`}
          aria-label={item.title}
          className="
            flex-1 min-w-0 flex items-center gap-2 text-left
            transition-all duration-300 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded
          "
        >
          <span className="font-medium text-white text-sm sm:text-base truncate">
            {item.titleContent ?? item.title}
          </span>
        </button>
        {item.titleAction != null && (
          <span className="shrink-0 flex items-center" onClick={(e) => e.stopPropagation()}>
            {item.titleAction}
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isExpanded}
          aria-controls={`accordion-content-${item.id}`}
          aria-label={`${item.title}, ${isExpanded ? 'collapse' : 'expand'}`}
          className="
            shrink-0 p-1 rounded transition-all duration-300 cursor-pointer
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
            text-slate-400 hover:text-slate-200 hover:bg-slate-600/50
          "
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      
      <div
        id={`accordion-content-${item.id}`}
        role="region"
        aria-labelledby={`accordion-button-${item.id}`}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: height,
        }}
      >
        <div ref={contentRef} className="p-4 bg-slate-900/20 text-slate-300 text-sm sm:text-base">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ items, allowMultiple = false, className = '' }: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const defaultExpanded = new Set<string>();
    items.forEach((item) => {
      if (item.defaultExpanded) {
        defaultExpanded.add(item.id);
      }
    });
    return defaultExpanded;
  });

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      
      return newSet;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <AccordionItemComponent
          key={item.id}
          item={item}
          isExpanded={expandedItems.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
}

export type { AccordionItem as AccordionItemType };
