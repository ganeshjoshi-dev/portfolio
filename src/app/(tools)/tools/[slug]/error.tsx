'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function ToolError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Tool error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircle className="w-12 h-12 text-red-400" aria-hidden />
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Something went wrong
        </h1>
        <p className="text-gray-300 text-sm sm:text-base">
          This tool encountered an error. You can try again or head back to all
          tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-600 text-white hover:bg-cyan-400/20 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            All tools
          </Link>
        </div>
      </div>
    </div>
  );
}
