import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export default function ImageUploadZone({ onFilesAdded, disabled = false }: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [disabled, onFilesAdded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [disabled, onFilesAdded]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center
        min-h-[280px] p-8 rounded-xl border-2 border-dashed
        transition-all duration-300
        ${
          isDragging
            ? 'border-cyan-400/70 bg-cyan-400/10 scale-[1.02]'
            : 'border-slate-700/60 bg-slate-900/40'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-cyan-400/50 hover:bg-slate-900/60'}
      `}
    >
      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? 'bg-cyan-400/20 scale-110' : 'bg-slate-800/60'}
          `}>
            <Upload className={`
              w-12 h-12 transition-colors
              ${isDragging ? 'text-cyan-300' : 'text-slate-400'}
            `} />
          </div>

          {/* Text */}
          <div className="text-center space-y-2">
            <p className={`
              text-lg font-medium transition-colors
              ${isDragging ? 'text-cyan-300' : 'text-slate-300'}
            `}>
              {isDragging ? 'Drop your images here!' : 'Drop your images here!'}
            </p>
            <p className="text-sm text-slate-400">
              or click to select files
            </p>
            <p className="text-xs text-slate-500">
              Up to 20 images, max 10MB each
            </p>
          </div>

          {/* Format badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['JPEG', 'PNG', 'WebP', 'AVIF'].map((format) => (
              <span
                key={format}
                className="px-3 py-1 text-xs font-medium bg-slate-800/60 text-slate-400 rounded-full border border-slate-700/60"
              >
                {format}
              </span>
            ))}
          </div>
        </div>

        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
          aria-label="Upload images"
        />
      </label>

      {/* Visual feedback overlay */}
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none rounded-xl bg-cyan-400/5 animate-pulse" />
      )}
    </div>
  );
}
