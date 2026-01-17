'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ToolLayout, CopyButton } from '@/components/tools/shared';
import { Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { getToolById, toolCategories } from '@/config/tools';

// Get tool config for structured data
const tool = getToolById('diff-checker')!;
const category = toolCategories[tool.category];

// Types
interface WordDiff {
  text: string;
  type: 'added' | 'removed' | 'unchanged';
}

interface LineDiff {
  leftLine: string | null;
  rightLine: string | null;
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  leftWords?: WordDiff[];
  rightWords?: WordDiff[];
}

// Compute word-level diff between two strings
function computeWordDiff(left: string, right: string): { leftWords: WordDiff[]; rightWords: WordDiff[] } {
  const leftTokens = tokenize(left);
  const rightTokens = tokenize(right);
  
  const lcs = longestCommonSubsequence(leftTokens, rightTokens);
  
  const leftWords: WordDiff[] = [];
  const rightWords: WordDiff[] = [];
  
  let li = 0, ri = 0, lcsIdx = 0;
  
  while (li < leftTokens.length || ri < rightTokens.length) {
    if (lcsIdx < lcs.length && li < leftTokens.length && leftTokens[li] === lcs[lcsIdx] && 
        ri < rightTokens.length && rightTokens[ri] === lcs[lcsIdx]) {
      leftWords.push({ text: leftTokens[li], type: 'unchanged' });
      rightWords.push({ text: rightTokens[ri], type: 'unchanged' });
      li++;
      ri++;
      lcsIdx++;
    } else if (lcsIdx < lcs.length && ri < rightTokens.length && rightTokens[ri] === lcs[lcsIdx]) {
      leftWords.push({ text: leftTokens[li], type: 'removed' });
      li++;
    } else if (lcsIdx < lcs.length && li < leftTokens.length && leftTokens[li] === lcs[lcsIdx]) {
      rightWords.push({ text: rightTokens[ri], type: 'added' });
      ri++;
    } else {
      if (li < leftTokens.length) {
        leftWords.push({ text: leftTokens[li], type: 'removed' });
        li++;
      }
      if (ri < rightTokens.length) {
        rightWords.push({ text: rightTokens[ri], type: 'added' });
        ri++;
      }
    }
  }
  
  return { leftWords, rightWords };
}

// Tokenize string into words (preserving whitespace)
function tokenize(str: string): string[] {
  const tokens: string[] = [];
  let current = '';
  
  for (const char of str) {
    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      tokens.push(char);
    } else {
      current += char;
    }
  }
  
  if (current) {
    tokens.push(current);
  }
  
  return tokens;
}

// LCS algorithm for word arrays
function longestCommonSubsequence(a: string[], b: string[]): string[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack
  const result: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return result;
}

// Main diff computation
function computeLineDiff(
  original: string,
  modified: string,
  ignoreWhitespace: boolean,
  ignoreCase: boolean
): LineDiff[] {
  const normalize = (text: string): string => {
    let result = text;
    if (ignoreWhitespace) {
      result = result.replace(/\s+/g, ' ').trim();
    }
    if (ignoreCase) {
      result = result.toLowerCase();
    }
    return result;
  };

  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  
  const m = originalLines.length;
  const n = modifiedLines.length;
  
  // Build LCS table for lines
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (normalize(originalLines[i - 1]) === normalize(modifiedLines[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to build diff
  const result: LineDiff[] = [];
  let i = m, j = n;
  const stack: LineDiff[] = [];
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(originalLines[i - 1]) === normalize(modifiedLines[j - 1])) {
      stack.push({
        leftLine: originalLines[i - 1],
        rightLine: modifiedLines[j - 1],
        leftLineNumber: i,
        rightLineNumber: j,
        type: 'unchanged',
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({
        leftLine: null,
        rightLine: modifiedLines[j - 1],
        leftLineNumber: null,
        rightLineNumber: j,
        type: 'added',
      });
      j--;
    } else if (i > 0) {
      stack.push({
        leftLine: originalLines[i - 1],
        rightLine: null,
        leftLineNumber: i,
        rightLineNumber: null,
        type: 'removed',
      });
      i--;
    }
  }
  
  // Reverse and process
  while (stack.length > 0) {
    result.push(stack.pop()!);
  }
  
  // Post-process: merge adjacent removed+added into modified with word diff
  const merged: LineDiff[] = [];
  let idx = 0;
  
  while (idx < result.length) {
    const current = result[idx];
    
    // Look for removed followed by added (or vice versa) to merge into modified
    if (current.type === 'removed' && idx + 1 < result.length && result[idx + 1].type === 'added') {
      const next = result[idx + 1];
      const { leftWords, rightWords } = computeWordDiff(current.leftLine || '', next.rightLine || '');
      
      merged.push({
        leftLine: current.leftLine,
        rightLine: next.rightLine,
        leftLineNumber: current.leftLineNumber,
        rightLineNumber: next.rightLineNumber,
        type: 'modified',
        leftWords,
        rightWords,
      });
      idx += 2;
    } else if (current.type === 'added' && idx + 1 < result.length && result[idx + 1].type === 'removed') {
      const next = result[idx + 1];
      const { leftWords, rightWords } = computeWordDiff(next.leftLine || '', current.rightLine || '');
      
      merged.push({
        leftLine: next.leftLine,
        rightLine: current.rightLine,
        leftLineNumber: next.leftLineNumber,
        rightLineNumber: current.rightLineNumber,
        type: 'modified',
        leftWords,
        rightWords,
      });
      idx += 2;
    } else {
      merged.push(current);
      idx++;
    }
  }
  
  return merged;
}

// Component for rendering word-level diff
function DiffWords({ words, side }: { words: WordDiff[]; side: 'left' | 'right' }) {
  return (
    <span className="whitespace-pre-wrap break-all">
      {words.map((word, i) => {
        if (word.type === 'unchanged') {
          return <span key={i}>{word.text}</span>;
        }
        if (side === 'left' && word.type === 'removed') {
          return (
            <span key={i} className="bg-red-500/40 text-red-200 rounded-sm px-0.5">
              {word.text}
            </span>
          );
        }
        if (side === 'right' && word.type === 'added') {
          return (
            <span key={i} className="bg-emerald-500/40 text-emerald-200 rounded-sm px-0.5">
              {word.text}
            </span>
          );
        }
        return <span key={i}>{word.text}</span>;
      })}
    </span>
  );
}

export default function DiffCheckerPage() {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const diffRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Compute diff
  const diff = useMemo(() => {
    if (!originalText && !modifiedText) return [];
    return computeLineDiff(originalText, modifiedText, ignoreWhitespace, ignoreCase);
  }, [originalText, modifiedText, ignoreWhitespace, ignoreCase]);

  // Get indices of changed lines (for navigation)
  const changedIndices = useMemo(() => {
    return diff
      .map((line, index) => ({ index, type: line.type }))
      .filter(item => item.type !== 'unchanged')
      .map(item => item.index);
  }, [diff]);

  // Stats
  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const modified = diff.filter(d => d.type === 'modified').length;
    return { added, removed, modified };
  }, [diff]);

  // Synchronized scrolling
  const handleScroll = useCallback((source: 'left' | 'right') => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    
    if (!leftPanel || !rightPanel) return;
    
    if (source === 'left') {
      rightPanel.scrollTop = leftPanel.scrollTop;
    } else {
      leftPanel.scrollTop = rightPanel.scrollTop;
    }
  }, []);

  // Navigate to diff
  const navigateToDiff = useCallback((direction: 'next' | 'prev') => {
    if (changedIndices.length === 0) return;
    
    let newIndex: number;
    if (direction === 'next') {
      newIndex = currentDiffIndex < changedIndices.length - 1 ? currentDiffIndex + 1 : 0;
    } else {
      newIndex = currentDiffIndex > 0 ? currentDiffIndex - 1 : changedIndices.length - 1;
    }
    
    setCurrentDiffIndex(newIndex);
    
    const rowIndex = changedIndices[newIndex];
    const row = diffRowRefs.current[rowIndex];
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [changedIndices, currentDiffIndex]);

  // Reset diff index when diff changes
  useEffect(() => {
    setCurrentDiffIndex(0);
  }, [diff]);

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  const handleFileUpload = (side: 'left' | 'right') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (side === 'left') {
        setOriginalText(text);
      } else {
        setModifiedText(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Generate unified diff for copying
  const generateUnifiedDiff = () => {
    return diff.map(line => {
      if (line.type === 'added') return `+ ${line.rightLine}`;
      if (line.type === 'removed') return `- ${line.leftLine}`;
      if (line.type === 'modified') return `- ${line.leftLine}\n+ ${line.rightLine}`;
      return `  ${line.leftLine}`;
    }).join('\n');
  };

  // Calculate minimap markers
  const minimapMarkers = useMemo(() => {
    if (diff.length === 0) return [];
    
    return diff.map((line, index) => ({
      position: (index / diff.length) * 100,
      type: line.type,
    })).filter(m => m.type !== 'unchanged');
  }, [diff]);

  return (
    <ToolLayout
      title="Diff Checker"
      description="Compare two texts side-by-side and highlight the differences. Perfect for code reviews and text comparison."
      tool={tool}
      category={category}
    >
      <div className="space-y-6">
        {/* Options Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-cyan-400 focus:ring-cyan-400/20 focus:ring-offset-0"
            />
            <span className="text-sm text-slate-300">Ignore whitespace</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-cyan-400 focus:ring-cyan-400/20 focus:ring-offset-0"
            />
            <span className="text-sm text-slate-300">Ignore case</span>
          </label>
          
          <div className="flex-1" />
          
          {/* Navigation buttons */}
          {changedIndices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {currentDiffIndex + 1} / {changedIndices.length} changes
              </span>
              <button
                onClick={() => navigateToDiff('prev')}
                className="p-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-slate-300 hover:text-cyan-300 transition-all duration-300"
                aria-label="Previous difference"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateToDiff('next')}
                className="p-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-slate-300 hover:text-cyan-300 transition-all duration-300"
                aria-label="Next difference"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button
            onClick={handleSwap}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-300 hover:text-cyan-300 transition-all duration-300"
          >
            Swap texts
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/60 hover:border-red-400/50 rounded-lg text-xs text-slate-300 hover:text-red-300 transition-all duration-300 flex items-center gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          {diff.length > 0 && <CopyButton text={generateUnifiedDiff()} />}
        </div>

        {/* Input Text Areas */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Original Text</label>
              <label className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-400 hover:text-cyan-300 transition-all duration-300 cursor-pointer">
                <Upload className="w-3 h-3" />
                Upload
                <input
                  type="file"
                  accept=".txt,.js,.ts,.jsx,.tsx,.json,.md,.css,.html,.xml,.yaml,.yml,.py,.java,.c,.cpp,.h,.hpp,.cs,.go,.rs,.php,.rb,.swift,.kt"
                  onChange={handleFileUpload('left')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste original text here..."
              className="
                w-full h-[200px] p-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white font-mono text-sm resize-none
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Modified Text</label>
              <label className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/60 border border-slate-700/60 hover:border-cyan-400/50 rounded-lg text-xs text-slate-400 hover:text-cyan-300 transition-all duration-300 cursor-pointer">
                <Upload className="w-3 h-3" />
                Upload
                <input
                  type="file"
                  accept=".txt,.js,.ts,.jsx,.tsx,.json,.md,.css,.html,.xml,.yaml,.yml,.py,.java,.c,.cpp,.h,.hpp,.cs,.go,.rs,.php,.rb,.swift,.kt"
                  onChange={handleFileUpload('right')}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste modified text here..."
              className="
                w-full h-[200px] p-4 bg-slate-900/60 border border-slate-700/60
                rounded-xl text-white font-mono text-sm resize-none
                focus:border-cyan-400/50 focus:outline-none focus:ring-2
                focus:ring-cyan-400/20 transition-all duration-300
              "
            />
          </div>
        </div>

        {/* Stats */}
        {diff.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <span className="text-emerald-400 font-medium">+{stats.added}</span>
              <span className="text-slate-400 text-sm ml-2">added</span>
            </div>
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <span className="text-red-400 font-medium">-{stats.removed}</span>
              <span className="text-slate-400 text-sm ml-2">removed</span>
            </div>
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <span className="text-amber-400 font-medium">{stats.modified}</span>
              <span className="text-slate-400 text-sm ml-2">modified</span>
            </div>
          </div>
        )}

        {/* Side-by-Side Diff View */}
        <div className="relative">
          {/* Minimap */}
          {minimapMarkers.length > 0 && (
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-slate-800/40 rounded-r-xl z-10">
              {minimapMarkers.map((marker, i) => (
                <div
                  key={i}
                  className={`
                    absolute right-0.5 w-2 h-1 rounded-sm
                    ${marker.type === 'added' ? 'bg-emerald-500' : ''}
                    ${marker.type === 'removed' ? 'bg-red-500' : ''}
                    ${marker.type === 'modified' ? 'bg-amber-500' : ''}
                  `}
                  style={{ top: `${marker.position}%` }}
                />
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-0 border border-slate-700/60 rounded-xl overflow-hidden">
            {/* Left Panel Header */}
            <div className="bg-slate-800/80 px-4 py-2 border-b border-r border-slate-700/60">
              <span className="text-sm font-medium text-slate-300">Original</span>
            </div>
            {/* Right Panel Header */}
            <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/60">
              <span className="text-sm font-medium text-slate-300">Modified</span>
            </div>
            
            {/* Left Panel */}
            <div
              ref={leftPanelRef}
              onScroll={() => handleScroll('left')}
              className="h-[400px] overflow-auto bg-slate-900/60 font-mono text-sm border-r border-slate-700/60"
            >
              {diff.length > 0 ? (
                <div>
                  {diff.map((line, index) => {
                    const isCurrentDiff = changedIndices[currentDiffIndex] === index;
                    return (
                      <div
                        key={index}
                        ref={el => { diffRowRefs.current[index] = el; }}
                        className={`
                          flex min-h-[24px]
                          ${line.type === 'removed' ? 'bg-red-500/15' : ''}
                          ${line.type === 'modified' ? 'bg-amber-500/10' : ''}
                          ${line.type === 'added' ? 'bg-slate-800/30' : ''}
                          ${isCurrentDiff ? 'ring-2 ring-inset ring-cyan-400/50' : ''}
                        `}
                      >
                        <span className="w-12 text-right pr-3 py-0.5 text-slate-600 select-none shrink-0 bg-slate-800/30 border-r border-slate-700/40">
                          {line.leftLineNumber || ''}
                        </span>
                        <span className="px-2 py-0.5 flex-1">
                          {line.type === 'modified' && line.leftWords ? (
                            <DiffWords words={line.leftWords} side="left" />
                          ) : line.type === 'removed' ? (
                            <span className="text-red-300">{line.leftLine}</span>
                          ) : line.type === 'added' ? (
                            <span className="text-slate-600">&nbsp;</span>
                          ) : (
                            <span className="text-slate-300">{line.leftLine}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Original text will appear here
                </div>
              )}
            </div>
            
            {/* Right Panel */}
            <div
              ref={rightPanelRef}
              onScroll={() => handleScroll('right')}
              className="h-[400px] overflow-auto bg-slate-900/60 font-mono text-sm"
            >
              {diff.length > 0 ? (
                <div>
                  {diff.map((line, index) => {
                    const isCurrentDiff = changedIndices[currentDiffIndex] === index;
                    return (
                      <div
                        key={index}
                        className={`
                          flex min-h-[24px]
                          ${line.type === 'added' ? 'bg-emerald-500/15' : ''}
                          ${line.type === 'modified' ? 'bg-amber-500/10' : ''}
                          ${line.type === 'removed' ? 'bg-slate-800/30' : ''}
                          ${isCurrentDiff ? 'ring-2 ring-inset ring-cyan-400/50' : ''}
                        `}
                      >
                        <span className="w-12 text-right pr-3 py-0.5 text-slate-600 select-none shrink-0 bg-slate-800/30 border-r border-slate-700/40">
                          {line.rightLineNumber || ''}
                        </span>
                        <span className="px-2 py-0.5 flex-1">
                          {line.type === 'modified' && line.rightWords ? (
                            <DiffWords words={line.rightWords} side="right" />
                          ) : line.type === 'added' ? (
                            <span className="text-emerald-300">{line.rightLine}</span>
                          ) : line.type === 'removed' ? (
                            <span className="text-slate-600">&nbsp;</span>
                          ) : (
                            <span className="text-slate-300">{line.rightLine}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Modified text will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
