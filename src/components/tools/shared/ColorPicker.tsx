'use client';

import { useState, useRef, useEffect } from 'react';
import { ColorPickerProps } from '@/types/tools';

export default function ColorPicker({
  color,
  onChange,
  label,
  showAlpha = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Validate hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(value)) {
      onChange(value);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">{label}</label>
      )}
      <div className="flex items-center gap-2">
        {/* Color Preview / Picker Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="
              w-10 h-10 rounded-lg border-2 border-slate-700/60
              hover:border-cyan-400/50 transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
              focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            "
            style={{ backgroundColor: color }}
            aria-label="Pick color"
          />
          {/* Native Color Picker (hidden but functional) */}
          <input
            type="color"
            value={color.slice(0, 7)}
            onChange={handleColorPickerChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Hex Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="#000000"
          className="
            flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/60
            rounded-lg text-white font-mono text-sm
            focus:border-cyan-400/50 focus:outline-none focus:ring-2
            focus:ring-cyan-400/20 transition-all duration-300
          "
        />

        {showAlpha && (
          <input
            type="number"
            min="0"
            max="100"
            placeholder="100%"
            className="
              w-20 px-3 py-2 bg-slate-800/60 border border-slate-700/60
              rounded-lg text-white text-sm
              focus:border-cyan-400/50 focus:outline-none focus:ring-2
              focus:ring-cyan-400/20 transition-all duration-300
            "
          />
        )}
      </div>
    </div>
  );
}
