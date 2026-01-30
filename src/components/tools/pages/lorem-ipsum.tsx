'use client';

import { useState, useMemo, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { ToolLayout, CopyButton, SliderInput } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

const devWords = [
  'api', 'react', 'component', 'function', 'async', 'await', 'typescript',
  'javascript', 'nodejs', 'database', 'server', 'client', 'endpoint', 'query',
  'mutation', 'hook', 'state', 'props', 'render', 'deploy', 'build', 'test',
  'debug', 'refactor', 'optimize', 'cache', 'memory', 'thread', 'process',
  'docker', 'kubernetes', 'microservice', 'lambda', 'serverless', 'graphql',
  'rest', 'crud', 'auth', 'token', 'jwt', 'oauth', 'ssl', 'https', 'cors',
  'webpack', 'vite', 'tailwind', 'nextjs', 'vercel', 'github', 'cicd',
];

type TextType = 'words' | 'sentences' | 'paragraphs';
type Variant = 'classic' | 'dev';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateText(
  type: TextType,
  count: number,
  variant: Variant,
  startWithLorem: boolean
): string {
  const wordList = variant === 'dev' ? devWords : words;

  const getRandomWord = () => wordList[Math.floor(Math.random() * wordList.length)];

  const generateSentence = (wordCount: number = 0): string => {
    const length = wordCount || Math.floor(Math.random() * 10) + 5;
    const sentenceWords = Array.from({ length }, getRandomWord);
    sentenceWords[0] = capitalize(sentenceWords[0]);
    return sentenceWords.join(' ') + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
  };

  let result = '';

  switch (type) {
    case 'words':
      const wordArray = Array.from({ length: count }, getRandomWord);
      if (startWithLorem && variant === 'classic') {
        wordArray[0] = 'lorem';
        if (count > 1) wordArray[1] = 'ipsum';
      }
      result = wordArray.join(' ');
      break;

    case 'sentences':
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLorem && variant === 'classic') {
        sentences[0] = 'Lorem ipsum dolor sit amet.';
      }
      result = sentences.join(' ');
      break;

    case 'paragraphs':
      const paragraphs = Array.from({ length: count }, generateParagraph);
      if (startWithLorem && variant === 'classic') {
        paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paragraphs[0];
      }
      result = paragraphs.join('\n\n');
      break;
  }

  return result;
}

export default function LoremIpsumPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [type, setType] = useState<TextType>('paragraphs');
  const [count, setCount] = useState(3);
  const [variant, setVariant] = useState<Variant>('classic');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [regenerateKey, setRegenerateKey] = useState(0);

  const text = useMemo(
    () => generateText(type, count, variant, startWithLorem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, count, variant, startWithLorem, regenerateKey]
  );

  const regenerate = useCallback(() => {
    setRegenerateKey((k) => k + 1);
  }, []);

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text with classic or developer-themed variants."
      tool={tool}
      category={category}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Generate</label>
            <div className="flex gap-2">
              {(['words', 'sentences', 'paragraphs'] as TextType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm capitalize transition-all duration-300
                    ${type === t
                      ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Variant */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">Variant</label>
            <div className="flex gap-2">
              {(['classic', 'dev'] as Variant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm transition-all duration-300
                    ${variant === v
                      ? 'bg-cyan-400/20 border border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }
                  `}
                >
                  {v === 'classic' ? 'Classic' : 'Developer'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count Slider */}
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
          <SliderInput
            label={`Number of ${type}`}
            value={count}
            min={1}
            max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
            onChange={setCount}
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-400"
            />
            Start with &quot;Lorem ipsum&quot;
          </label>
          <button
            onClick={regenerate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-sm text-slate-300 hover:text-cyan-300 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">Generated Text</label>
            <CopyButton text={text} />
          </div>
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/60 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
            {text}
          </div>
          <p className="text-xs text-slate-500">
            {text.split(/\s+/).length} words, {text.length} characters
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
