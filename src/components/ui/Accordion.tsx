'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
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
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${item.id}`}
        className="
          w-full flex items-center justify-between gap-4 p-4
          bg-slate-900/40 hover:bg-slate-900/60
          text-left transition-all duration-300 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        "
      >
        <span className="font-medium text-white text-sm sm:text-base">{item.title}</span>
        <ChevronDown
          className={`
            w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300
            ${isExpanded ? 'rotate-180' : ''}
          `}
        />
      </button>
      
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
