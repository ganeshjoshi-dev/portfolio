'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CopyButtonProps } from '@/types/tools';

export default function CopyButton({ text, className = '', onCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        bg-slate-800/60 hover:bg-cyan-400/15
        border border-slate-700/60 hover:border-cyan-400/50
        rounded-lg text-sm text-slate-300 hover:text-cyan-300
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${className}
      `}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
