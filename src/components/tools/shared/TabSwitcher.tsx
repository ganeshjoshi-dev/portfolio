'use client';

import { TabSwitcherProps } from '@/types/tools';

export default function TabSwitcher({ options, activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="inline-flex bg-slate-900/60 rounded-lg p-1 border border-slate-700/60">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
            focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            ${
              activeTab === option.id
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
