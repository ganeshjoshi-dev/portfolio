import { ImageFile } from '@/lib/tools/image';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface BatchProgressBarProps {
  images: ImageFile[];
}

export default function BatchProgressBar({ images }: BatchProgressBarProps) {
  const total = images.length;
  const completed = images.filter((img) => img.status === 'completed').length;
  const processing = images.filter((img) => img.status === 'processing').length;
  const errors = images.filter((img) => img.status === 'error').length;
  const pending = images.filter((img) => img.status === 'pending').length;

  const progress = total > 0 ? (completed / total) * 100 : 0;
  const isProcessing = processing > 0;
  const allComplete = completed === total && total > 0;

  if (total === 0) return null;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-800/60 rounded-full overflow-hidden">
        <div
          className={`
            h-full transition-all duration-500 ease-out
            ${
              allComplete
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : 'bg-gradient-to-r from-cyan-500 to-cyan-400'
            }
          `}
          style={{ width: `${progress}%` }}
        />
        {isProcessing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {isProcessing && (
            <div className="flex items-center gap-2 text-cyan-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">
                Processing {processing} of {total}...
              </span>
            </div>
          )}
          
          {allComplete && (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-medium">
                All {total} images compressed!
              </span>
            </div>
          )}

          {!isProcessing && !allComplete && completed > 0 && (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-medium">
                {completed} of {total} completed
              </span>
            </div>
          )}

          {pending === total && (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="font-medium">
                {total} images ready to compress
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs">
          {completed > 0 && (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>{completed}</span>
            </div>
          )}
          {errors > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <XCircle className="w-3 h-3" />
              <span>{errors}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
