'use client';

import { useState, useCallback, useMemo } from 'react';
import { FileText, Upload } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';
import CryptoJS from 'crypto-js';

const tool = getToolById('hash-generator')!;
const category = toolCategories[tool.category];

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export default function HashGeneratorPage() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<'text' | 'file'>('text');

  const hashes = useMemo(() => {
    if (!text && mode === 'text') return null;
    if (!text && mode === 'file') return null;

    return {
      MD5: CryptoJS.MD5(text).toString(),
      'SHA-1': CryptoJS.SHA1(text).toString(),
      'SHA-256': CryptoJS.SHA256(text).toString(),
      'SHA-512': CryptoJS.SHA512(text).toString(),
    };
  }, [text, mode]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  }, []);

  const hashAlgorithms: { name: HashAlgorithm; description: string; color: string }[] = [
    {
      name: 'MD5',
      description: '128-bit hash, fast but not cryptographically secure',
      color: 'border-red-500/30 bg-red-500/10',
    },
    {
      name: 'SHA-1',
      description: '160-bit hash, deprecated for security',
      color: 'border-orange-500/30 bg-orange-500/10',
    },
    {
      name: 'SHA-256',
      description: '256-bit hash, secure and widely used',
      color: 'border-emerald-500/30 bg-emerald-500/10',
    },
    {
      name: 'SHA-512',
      description: '512-bit hash, most secure option',
      color: 'border-cyan-500/30 bg-cyan-500/10',
    },
  ];

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate cryptographic hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms for text or files."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('text');
              setText('');
              setFileName('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'text'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
            }`}
          >
            <FileText className="w-4 h-4" />
            Text
          </button>
          <button
            onClick={() => {
              setMode('file');
              setText('');
              setFileName('');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'file'
                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                : 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:border-cyan-400/30'
            }`}
          >
            <Upload className="w-4 h-4" />
            File
          </button>
        </div>

        {/* Input Area */}
        {mode === 'text' ? (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter Text to Hash
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-48 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
            />
            <p className="mt-2 text-xs text-slate-500">{text.length} characters</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload File to Hash
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-center gap-3 px-6 py-12 bg-slate-900/60 border-2 border-dashed border-slate-700/60 rounded-xl hover:border-cyan-400/30 transition-all duration-300">
                <Upload className="w-6 h-6 text-slate-400" />
                <div className="text-center">
                  <p className="text-sm text-slate-300">
                    {fileName || 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Text files only</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hash Results */}
        {hashes && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-300">Generated Hashes</h3>
            {hashAlgorithms.map((algo) => (
              <div
                key={algo.name}
                className={`p-4 border rounded-xl ${algo.color} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{algo.name}</h4>
                    <p className="text-xs text-slate-400">{algo.description}</p>
                  </div>
                  <CopyButton text={hashes[algo.name]} />
                </div>
                <code className="block font-mono text-xs text-slate-300 break-all select-all bg-slate-900/40 p-3 rounded-lg mt-2">
                  {hashes[algo.name]}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-300 mb-2">⚠️ Security Notice</h3>
          <ul className="space-y-1 text-xs text-yellow-200/80">
            <li>• MD5 and SHA-1 are NOT cryptographically secure</li>
            <li>• Use SHA-256 or SHA-512 for password hashing and security</li>
            <li>• MD5 is suitable for checksums and non-security purposes only</li>
            <li>• All hashing is done locally in your browser</li>
          </ul>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">✅ Recommended Uses</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• File integrity verification</li>
              <li>• Checksum generation</li>
              <li>• Data deduplication</li>
              <li>• Cache keys</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">❌ Not Recommended</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Direct password storage (use bcrypt)</li>
              <li>• Digital signatures (use RSA/ECDSA)</li>
              <li>• Encryption (hashes are one-way)</li>
              <li>• Security-critical applications with MD5/SHA-1</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
