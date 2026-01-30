'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { RefreshCw, Copy } from 'lucide-react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

function generatePassword(options: PasswordOptions): string {
  const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  let charset = '';
  if (options.uppercase) charset += chars.uppercase;
  if (options.lowercase) charset += chars.lowercase;
  if (options.numbers) charset += chars.numbers;
  if (options.symbols) charset += chars.symbols;

  if (charset === '') charset = chars.lowercase; // Fallback

  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

function calculateStrength(password: string, options: PasswordOptions): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety
  if (options.uppercase) score += 1;
  if (options.lowercase) score += 1;
  if (options.numbers) score += 1;
  if (options.symbols) score += 1;

  // Normalize to 0-100
  const normalized = Math.min(100, (score / 7) * 100);

  if (normalized < 40) return { score: normalized, label: 'Weak', color: 'text-red-400' };
  if (normalized < 60) return { score: normalized, label: 'Fair', color: 'text-yellow-400' };
  if (normalized < 80) return { score: normalized, label: 'Good', color: 'text-blue-400' };
  return { score: normalized, label: 'Strong', color: 'text-emerald-400' };
}

export default function PasswordGeneratorPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passwords, setPasswords] = useState<string[]>([generatePassword(options)]);

  const regenerateAll = useCallback(() => {
    setPasswords((prev) => prev.map(() => generatePassword(options)));
  }, [options]);

  const regenerateOne = useCallback(
    (index: number) => {
      setPasswords((prev) => prev.map((p, i) => (i === index ? generatePassword(options) : p)));
    },
    [options]
  );

  const addPassword = useCallback(() => {
    setPasswords((prev) => [...prev, generatePassword(options)]);
  }, [options]);

  const removePassword = useCallback((index: number) => {
    setPasswords((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const bulkGenerate = useCallback(
    (count: number) => {
      const newPasswords = Array.from({ length: count }, () => generatePassword(options));
      setPasswords(newPasswords);
    },
    [options]
  );

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(passwords.join('\n'));
  }, [passwords]);

  const strength = useMemo(
    () => calculateStrength(passwords[0] || '', options),
    [passwords, options]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateOption = useCallback((key: keyof PasswordOptions, value: any) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [key]: value };
      // At least one character type must be selected
      if (
        !newOptions.uppercase &&
        !newOptions.lowercase &&
        !newOptions.numbers &&
        !newOptions.symbols
      ) {
        return prev;
      }
      return newOptions;
    });
  }, []);

  // Regenerate when options change
  useEffect(() => {
    setPasswords((prev) => prev.map(() => generatePassword(options)));
  }, [options]);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate cryptographically secure passwords with customizable length and character types. Password strength indicator included."
      tool={tool}
      category={category}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Settings */}
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-6 space-y-6">
          {/* Length Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">Password Length</label>
              <span className="text-lg font-semibold text-cyan-400">{options.length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={options.length}
              onChange={(e) => updateOption('length', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>8</span>
              <span>64</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg cursor-pointer hover:border-cyan-400/30 transition-all duration-300">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={(e) => updateOption('uppercase', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm text-slate-300">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg cursor-pointer hover:border-cyan-400/30 transition-all duration-300">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={(e) => updateOption('lowercase', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm text-slate-300">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg cursor-pointer hover:border-cyan-400/30 transition-all duration-300">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={(e) => updateOption('numbers', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm text-slate-300">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-slate-800/60 border border-slate-700/60 rounded-lg cursor-pointer hover:border-cyan-400/30 transition-all duration-300">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={(e) => updateOption('symbols', e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-sm text-slate-300">Symbols (!@#$...)</span>
            </label>
          </div>

          {/* Strength Meter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Password Strength</span>
              <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  strength.label === 'Weak'
                    ? 'bg-red-400'
                    : strength.label === 'Fair'
                    ? 'bg-yellow-400'
                    : strength.label === 'Good'
                    ? 'bg-blue-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bulk Generate */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quick Generate
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 10, 25, 50].map((count) => (
              <button
                key={count}
                onClick={() => bulkGenerate(count)}
                className="px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
              >
                Generate {count}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addPassword}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-400/20 border border-cyan-400/50 rounded-lg text-sm font-medium text-cyan-300 hover:bg-cyan-400/30 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Add Password
          </button>
          <button
            onClick={regenerateAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate All
          </button>
          <button
            onClick={copyAll}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 transition-all duration-300"
          >
            <Copy className="w-4 h-4" />
            Copy All
          </button>
        </div>

        {/* Password List */}
        <div className="space-y-2">
          {passwords.map((password, index) => (
            <div
              key={`${password}-${index}`}
              className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-700/60 rounded-lg group hover:border-slate-600/80 transition-all duration-300"
            >
              <span className="text-xs text-slate-500 w-6 flex-shrink-0">{index + 1}</span>
              <code className="flex-1 font-mono text-cyan-300 text-sm break-all select-all">
                {password}
              </code>
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => regenerateOne(index)}
                  className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"
                  aria-label="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <CopyButton text={password} />
                {passwords.length > 1 && (
                  <button
                    onClick={() => removePassword(index)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500">
          {passwords.length} password{passwords.length !== 1 ? 's' : ''} generated
        </p>

        {/* Security Notice */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300">
            🔒 Passwords are generated locally using the Web Crypto API (crypto.getRandomValues).
            They never leave your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
