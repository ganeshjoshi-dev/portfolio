import { CompressionOptions, ImageFormat } from '@/lib/tools/image';
import { SliderInput } from '@/components/tools/shared';
import { Settings2 } from 'lucide-react';

interface CompressionSettingsProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
}

const formatOptions: { value: ImageFormat; label: string; description: string }[] = [
  { value: 'jpeg', label: 'JPEG', description: 'Best for photos' },
  { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
  { value: 'webp', label: 'WebP', description: 'Modern, smaller files' },
  { value: 'avif', label: 'AVIF', description: 'Best compression' },
];

export default function CompressionSettings({ options, onChange }: CompressionSettingsProps) {
  const handleQualityChange = (quality: number) => {
    onChange({ ...options, quality });
  };

  const handleAutoConvertToggle = () => {
    onChange({ 
      ...options, 
      autoConvert: !options.autoConvert,
      targetFormat: options.autoConvert ? undefined : options.targetFormat,
    });
  };

  const handleFormatChange = (format: ImageFormat) => {
    onChange({ 
      ...options, 
      targetFormat: options.targetFormat === format ? undefined : format,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-medium text-white">Compression Settings</h3>
      </div>

      {/* Quality Slider */}
      <div className="space-y-3">
        <SliderInput
          label="Quality"
          value={options.quality}
          min={0.1}
          max={1.0}
          step={0.05}
          onChange={handleQualityChange}
          showValue
        />
        <div className="flex justify-between text-xs text-slate-400 px-1">
          <span>Smaller file</span>
          <span>Better quality</span>
        </div>
      </div>

      {/* Format Conversion Toggle */}
      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex-1">
            <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-300 transition-colors">
              Convert images automatically
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Convert to the selected format for better compression
            </p>
          </div>
          <button
            onClick={handleAutoConvertToggle}
            className={`
              relative w-12 h-6 rounded-full transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              ${options.autoConvert ? 'bg-cyan-400' : 'bg-slate-700'}
            `}
            role="switch"
            aria-checked={options.autoConvert}
            aria-label="Toggle auto-convert"
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                transition-transform duration-300
                ${options.autoConvert ? 'translate-x-6' : 'translate-x-0'}
              `}
            />
          </button>
        </label>

        {/* Format Options */}
        {options.autoConvert && (
          <div className="space-y-2 pl-4 border-l-2 border-slate-700/60">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Target Format
            </p>
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format.value}
                  onClick={() => handleFormatChange(format.value)}
                  className={`
                    p-3 rounded-lg border text-left transition-all duration-300
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                    ${
                      options.targetFormat === format.value
                        ? 'border-cyan-400/50 bg-cyan-400/10 shadow-lg shadow-cyan-400/10'
                        : 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'
                    }
                  `}
                  aria-pressed={options.targetFormat === format.value}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`
                      w-2 h-2 rounded-full transition-colors
                      ${options.targetFormat === format.value ? 'bg-cyan-400' : 'bg-slate-600'}
                    `} />
                    <span className={`
                      text-sm font-medium transition-colors
                      ${options.targetFormat === format.value ? 'text-cyan-300' : 'text-slate-300'}
                    `}>
                      {format.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {format.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/60">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-1 h-full bg-cyan-400/50 rounded-full" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-300">
              Tips for best results:
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Quality 0.8 provides the best balance for most images</li>
              <li>WebP offers 25-35% smaller files than JPEG</li>
              <li>Use PNG only if you need lossless quality</li>
              <li>AVIF provides the smallest files but limited browser support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
