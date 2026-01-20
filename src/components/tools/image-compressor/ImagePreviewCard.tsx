import { memo, useState } from 'react';
import { Download, Trash2, Check, X, Clock, Loader2, ZoomIn } from 'lucide-react';
import { ImageFile } from '@/lib/tools/image';
import { formatFileSize } from '@/lib/tools/image';
import ZoomImageModal from '@/app/components/ZoomImageModal';

interface ImagePreviewCardProps {
  image: ImageFile;
  onDownload: (image: ImageFile) => void;
  onRemove: (id: string) => void;
}

function ImagePreviewCard({ image, onDownload, onRemove }: ImagePreviewCardProps) {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const compressionRatio = image.compressionRatio || 0;
  const hasCompressed = image.status === 'completed' && image.compressedBlob;

  return (
    <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/60 overflow-hidden hover:border-cyan-400/50 transition-all duration-300">
      {/* Status Bar */}
      <div className={`
        px-4 py-2 flex items-center justify-between text-xs font-medium
        ${
          image.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
          image.status === 'error' ? 'bg-red-500/10 text-red-400' :
          image.status === 'processing' ? 'bg-cyan-500/10 text-cyan-400' :
          'bg-slate-800/60 text-slate-400'
        }
      `}>
        <div className="flex items-center gap-2">
          {image.status === 'pending' && <Clock className="w-3 h-3" />}
          {image.status === 'processing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {image.status === 'completed' && <Check className="w-3 h-3" />}
          {image.status === 'error' && <X className="w-3 h-3" />}
          <span className="truncate max-w-[200px]">{image.file.name}</span>
        </div>
        <span className="uppercase text-[10px] px-2 py-0.5 bg-slate-700/40 rounded">
          {image.targetFormat || image.format}
        </span>
      </div>

      {/* Image Comparison */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {/* Before */}
        <div className="space-y-2">
          <div 
            className="aspect-video bg-slate-800/40 rounded-lg overflow-hidden relative group cursor-pointer"
            onClick={() => setZoomedImage({ src: image.preview, alt: 'Original Image' })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.preview}
              alt="Original"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/80 text-white text-xs rounded">
              Before
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Original</p>
            <p className="text-sm font-medium text-slate-300">
              {formatFileSize(image.originalSize)}
            </p>
          </div>
        </div>

        {/* After */}
        <div className="space-y-2">
          <div 
            className={`aspect-video bg-slate-800/40 rounded-lg overflow-hidden relative ${hasCompressed ? 'group cursor-pointer' : ''}`}
            onClick={() => hasCompressed && setZoomedImage({ src: image.compressedPreview!, alt: 'Compressed Image' })}
          >
            {hasCompressed ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.compressedPreview}
                  alt="Compressed"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/80 text-white text-xs rounded">
                  After
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                {image.status === 'processing' ? (
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                ) : image.status === 'error' ? (
                  <X className="w-8 h-8 text-red-400" />
                ) : (
                  <Clock className="w-8 h-8" />
                )}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Compressed</p>
            <p className="text-sm font-medium text-slate-300">
              {hasCompressed ? formatFileSize(image.compressedSize!) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="px-4 pb-4 space-y-3">
        {/* Compression Stats */}
        {hasCompressed && (
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Saved:</span>
              <span className="text-lg font-bold text-emerald-400">
                {compressionRatio.toFixed(0)}%
              </span>
            </div>
            <div className="mt-1 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${compressionRatio}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {image.status === 'error' && image.error && (
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm text-red-400">{image.error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onDownload(image)}
            disabled={!hasCompressed}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              ${
                hasCompressed
                  ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-400/30'
                  : 'bg-slate-800/40 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }
            `}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onRemove(image.id)}
            className="
              px-4 py-2 rounded-lg text-sm font-medium
              bg-slate-800/60 text-slate-400 border border-slate-700/60
              hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10
              transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            "
            aria-label={`Remove ${image.file.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <ZoomImageModal
          imageSrc={zoomedImage.src}
          alt={zoomedImage.alt}
          open={!!zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </div>
  );
}

export default memo(ImagePreviewCard);
