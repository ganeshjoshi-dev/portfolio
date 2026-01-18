'use client';

import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { CopyButtonProps } from '@/types/tools';

type CopyStatus = 'idle' | 'copied' | 'error';

export default function CopyButton({ text, className = '', onCopy }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      onCopy?.();
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
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
      aria-label={status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : 'Copy to clipboard'}
    >
      {status === 'copied' ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400">Failed to copy</span>
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
