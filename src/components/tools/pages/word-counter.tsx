'use client';

import { useState, useMemo } from 'react';
import { FileText, Clock, Type, List } from 'lucide-react';
import { ToolLayout } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

function analyzeText(text: string): TextStats {
  // Words
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  // Characters
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Sentences (split by . ! ?)
  const sentences =
    text.trim() === '' ? 0 : text.split(/[.!?]+/).filter((s) => s.trim() !== '').length;

  // Paragraphs (split by double newline or single newline if content exists)
  const paragraphs =
    text.trim() === '' ? 0 : text.split(/\n\n+/).filter((p) => p.trim() !== '').length;

  // Reading time (average 200-250 words per minute)
  const readingTime = Math.ceil(words / 225);

  // Speaking time (average 150 words per minute)
  const speakingTime = Math.ceil(words / 150);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime,
  };
}

export default function WordCounterPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [text, setText] = useState('');

  const stats = useMemo(() => analyzeText(text), [text]);

  const statCards = [
    {
      icon: FileText,
      label: 'Words',
      value: stats.words.toLocaleString(),
      color: 'text-cyan-400',
    },
    {
      icon: Type,
      label: 'Characters',
      value: stats.characters.toLocaleString(),
      color: 'text-blue-400',
    },
    {
      icon: Type,
      label: 'Characters (no spaces)',
      value: stats.charactersNoSpaces.toLocaleString(),
      color: 'text-purple-400',
    },
    {
      icon: List,
      label: 'Sentences',
      value: stats.sentences.toLocaleString(),
      color: 'text-emerald-400',
    },
    {
      icon: List,
      label: 'Paragraphs',
      value: stats.paragraphs.toLocaleString(),
      color: 'text-yellow-400',
    },
    {
      icon: Clock,
      label: 'Reading Time',
      value: `${stats.readingTime} min`,
      color: 'text-orange-400',
    },
    {
      icon: Clock,
      label: 'Speaking Time',
      value: `${stats.speakingTime} min`,
      color: 'text-pink-400',
    },
  ];

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs. Estimate reading and speaking time for your text."
      tool={tool}
      category={category}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 hover:border-slate-600/80 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Text Input */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-96 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">📖 Reading Speed</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Average reading: 200-250 words/min</li>
              <li>• Fast reading: 300-400 words/min</li>
              <li>• Slow reading: 100-200 words/min</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">🎤 Speaking Speed</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• Average speaking: 125-150 words/min</li>
              <li>• Fast speaking: 160-200 words/min</li>
              <li>• Slow speaking: 100-125 words/min</li>
            </ul>
          </div>
        </div>

        {/* Character Limits Reference */}
        {stats.characters > 0 && (
          <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-3">📱 Common Character Limits</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { platform: 'Twitter/X', limit: 280 },
                { platform: 'Facebook Post', limit: 63206 },
                { platform: 'Instagram Caption', limit: 2200 },
                { platform: 'LinkedIn Post', limit: 3000 },
                { platform: 'Meta Description', limit: 160 },
                { platform: 'Email Subject', limit: 60 },
              ].map((item) => {
                const percentage = Math.min(100, (stats.characters / item.limit) * 100);
                const isOver = stats.characters > item.limit;
                return (
                  <div key={item.platform} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.platform}</span>
                      <span
                        className={`font-medium ${
                          isOver ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {stats.characters}/{item.limit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isOver ? 'bg-red-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
