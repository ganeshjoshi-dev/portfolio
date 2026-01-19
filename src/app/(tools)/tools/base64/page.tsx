'use client';

import { useState, useCallback } from 'react';
import { Upload, ArrowRightLeft, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { ToolLayout, TabSwitcher, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('base64')!;
const category = toolCategories[tool.category];

type Mode = 'encode' | 'decode';
type InputType = 'text' | 'file';

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>('encode');
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleTextChange = useCallback((value: string) => {
    setTextInput(value);
    setError('');
    setImagePreview(null);

    if (!value.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(value))));
      } else {
        // Check if it's an image first
        if (value.startsWith('data:image')) {
          setImagePreview(value);
          setOutput(value); // Keep the base64 string for copying
        } else {
          // Handle data URLs by extracting the base64 part
          let base64String = value;
          if (value.includes(',')) {
            base64String = value.split(',')[1];
          }
          
          const binaryString = atob(base64String);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
          setOutput(decoded);
        }
      }
    } catch {
      setError(mode === 'encode' ? 'Failed to encode' : 'Invalid Base64 string');
      setOutput('');
    }
  }, [mode]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOutput(result);
      setTextInput('');

      if (file.type.startsWith('image/')) {
        setImagePreview(result);
      }
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'encode' ? 'decode' : 'encode'));
    setTextInput('');
    setOutput('');
    setError('');
    setImagePreview(null);
  }, []);

  const handleModeChange = useCallback((value: string) => {
    setMode(value as Mode);
    setTextInput('');
    setOutput('');
    setError('');
    setImagePreview(null);
  }, []);

  const handleDownloadImage = useCallback(() => {
    if (!imagePreview) return;

    // Extract the image format from the data URL
    const match = imagePreview.match(/data:image\/(\w+);base64,/);
    const format = match ? match[1] : 'png';
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = `decoded-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imagePreview]);

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 strings. Supports images and files."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center justify-center gap-4">
          <TabSwitcher
            options={[
              { id: 'encode', label: 'Encode' },
              { id: 'decode', label: 'Decode' },
            ]}
            activeTab={mode}
            onChange={handleModeChange}
          />
          <button
            onClick={toggleMode}
            className="p-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-slate-400 hover:text-cyan-300 transition-all duration-300"
            aria-label="Toggle mode"
          >
            <ArrowRightLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between min-h-[36px]">
              <h3 className="text-sm font-medium text-slate-300">
                {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
              </h3>
              {mode === 'encode' ? (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setInputType('text')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      inputType === 'text'
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                    }`}
                    aria-label="Text input"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setInputType('file')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      inputType === 'file'
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-300'
                    }`}
                    aria-label="File input"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-[36px]" />
              )}
            </div>

            {inputType === 'text' || mode === 'decode' ? (
              <textarea
                value={textInput}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string...'}
                className="
                  w-full h-[300px] p-4 bg-slate-900/60 border border-slate-700/60
                  rounded-xl text-white font-mono text-sm resize-none
                  focus:border-cyan-400/50 focus:outline-none focus:ring-2
                  focus:ring-cyan-400/20 transition-all duration-300
                "
              />
            ) : (
              <label className="
                flex flex-col items-center justify-center h-[300px] p-8
                bg-slate-900/60 border-2 border-dashed border-slate-700/60
                rounded-xl cursor-pointer hover:border-cyan-400/50
                transition-all duration-300
              ">
                <Upload className="w-12 h-12 text-slate-500 mb-4" />
                <span className="text-slate-400 text-sm">Click to upload or drag and drop</span>
                <span className="text-slate-500 text-xs mt-1">Supports images and files</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,text/*"
                />
              </label>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between min-h-[36px]">
              <h3 className="text-sm font-medium text-slate-300">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}
              </h3>
              <div className="flex items-center gap-2">
                {imagePreview && mode === 'decode' && (
                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-slate-400 hover:text-cyan-300 transition-all duration-300 text-sm"
                    aria-label="Download image"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                {output ? <CopyButton text={output} /> : !imagePreview && <div className="h-[36px]" />}
              </div>
            </div>

            {imagePreview && mode === 'decode' ? (
              <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl h-[300px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <>
                {imagePreview && mode === 'encode' && (
                  <div className="p-4 bg-slate-900/60 border border-slate-700/60 rounded-xl mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-[250px] mx-auto rounded-lg"
                    />
                  </div>
                )}
                <textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="
                    w-full h-[300px] p-4 bg-slate-900/60 border border-slate-700/60
                    rounded-xl text-white font-mono text-sm resize-none
                  "
                />
              </>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
