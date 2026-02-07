'use client';

import { useState, useCallback, useMemo } from 'react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button } from '@/components/ui';
import {
  cardRank,
  cardLabel,
  isRed,
  createInitialState,
} from '@/lib/data/solitaire';

type Selection = { type: 'waste'; card: number } | { type: 'column'; col: number; run: number[] };

function getColumnRun(column: { cards: number[]; hidden: number }): number[] {
  const { cards, hidden } = column;
  const faceUp = cards.slice(hidden);
  if (faceUp.length === 0) return [];
  const run: number[] = [faceUp[faceUp.length - 1]!];
  for (let i = faceUp.length - 2; i >= 0; i--) {
    const cur = faceUp[i]!;
    const prev = run[0]!;
    if (isRed(cur) !== isRed(prev) && cardRank(cur) === cardRank(prev) + 1) {
      run.unshift(cur);
    } else break;
  }
  return run;
}

function canPlaceOnColumn(card: number, column: { cards: number[]; hidden: number }): boolean {
  if (column.cards.length === column.hidden) return cardRank(card) === 12; // King on empty
  const top = column.cards[column.cards.length - 1]!;
  return isRed(card) !== isRed(top) && cardRank(card) === cardRank(top) - 1;
}

function canPlaceOnFoundation(card: number, foundation: number[]): boolean {
  if (foundation.length === 0) return cardRank(card) === 12; // Ace
  const top = foundation[foundation.length - 1]!;
  return cardRank(card) === cardRank(top) + 1 && Math.floor(card / 13) === Math.floor(top / 13);
}

export default function SolitairePage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [state, setState] = useState(createInitialState);
  const [selection, setSelection] = useState<Selection | null>(null);

  const { columns, foundations, stock, waste } = state;

  const drawCard = useCallback(() => {
    setState((prev) => {
      if (prev.stock.length > 0) {
        const card = prev.stock[prev.stock.length - 1]!;
        return {
          ...prev,
          stock: prev.stock.slice(0, -1),
          waste: [...prev.waste, card],
        };
      }
      return {
        ...prev,
        stock: [...prev.waste].reverse(),
        waste: [],
      };
    });
  }, []);

  const selectedCards = useMemo((): number[] => {
    if (!selection) return [];
    if (selection.type === 'waste') return [selection.card];
    return selection.run;
  }, [selection]);

  const moveToFoundation = useCallback(
    (foundationIndex: number) => {
      if (selectedCards.length !== 1) return;
      const card = selectedCards[0]!;
      const found = foundations[foundationIndex]!;
      if (!canPlaceOnFoundation(card, found)) return;
      setState((prev) => {
        const next = { ...prev, foundations: prev.foundations.map((f) => [...f]) };
        next.foundations[foundationIndex] = [...found, card];
        if (selection!.type === 'waste') {
          next.waste = prev.waste.slice(0, -1);
        } else {
          const col = selection!.col;
          const colData = prev.columns[col]!;
          const run = selection!.run;
          const newCards = colData.cards.slice(0, -run.length);
          let newHidden = colData.hidden;
          if (newCards.length > 0 && newCards.length <= colData.hidden) newHidden = newCards.length - 1;
          next.columns = prev.columns.map((c, i) =>
            i === col ? { cards: newCards, hidden: newHidden } : { ...c }
          );
        }
        return next;
      });
      setSelection(null);
    },
    [selectedCards, foundations, selection]
  );

  const moveToColumn = useCallback(
    (targetCol: number) => {
      if (selectedCards.length === 0) return;
      const bottomCard = selectedCards[0]!;
      const target = columns[targetCol]!;
      if (!canPlaceOnColumn(bottomCard, target)) return;
      if (selection!.type === 'column' && selection!.col === targetCol) return;
      setState((prev) => {
        const next = { ...prev, columns: prev.columns.map((c) => ({ ...c, cards: [...c.cards] })) };
        if (selection!.type === 'waste') {
          next.waste = prev.waste.slice(0, -1);
          next.columns[targetCol]!.cards.push(selection!.card);
        } else {
          const srcCol = selection!.col;
          const colData = prev.columns[srcCol]!;
          const run = selection!.run;
          const newCards = colData.cards.slice(0, colData.cards.length - run.length);
          next.columns[srcCol]!.cards = newCards;
          let newHidden = colData.hidden;
          if (newCards.length > 0 && newCards.length <= colData.hidden) newHidden = newCards.length - 1;
          next.columns[srcCol]!.hidden = newHidden;
          for (const c of run) next.columns[targetCol]!.cards.push(c);
        }
        return next;
      });
      setSelection(null);
    },
    [selectedCards, columns, selection]
  );

  const win = useMemo(
    () => foundations.every((f) => f.length === 13),
    [foundations]
  );

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
      currentGameId={slug}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {win && <p className="text-green-400 font-medium">You won!</p>}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setState(createInitialState());
              setSelection(null);
            }}
          >
            New game
          </Button>
        </div>

        <p className="text-slate-500 text-sm">
          Click a card to select, then click a valid destination. Draw from the stock on the left.
        </p>

        <div className="flex flex-wrap gap-4 items-start">
          {/* Stock & Waste */}
          <div className="flex gap-2 items-start">
            <button
              type="button"
              onClick={drawCard}
              className="w-14 h-20 rounded-lg bg-slate-700/80 border-2 border-slate-600 flex items-center justify-center text-slate-400 hover:bg-slate-600/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Draw card"
            >
              {stock.length > 0 ? (
                <span className="text-xs">{stock.length}</span>
              ) : (
                <span className="text-lg">↻</span>
              )}
            </button>
            <div className="w-14 h-20 rounded-lg bg-slate-800/80 border-2 border-slate-600 flex items-center justify-center overflow-hidden">
              {waste.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelection(
                      selection?.type === 'waste' ? null : { type: 'waste', card: waste[waste.length - 1]! }
                    )
                  }
                  className={`
                    w-full h-full flex items-center justify-center text-sm font-medium
                    border-2 rounded-lg
                    ${isRed(waste[waste.length - 1]!) ? 'text-red-600' : 'text-slate-800'}
                    bg-white
                    ${selection?.type === 'waste' ? 'ring-2 ring-cyan-400' : 'border-slate-500'}
                  `}
                >
                  {cardLabel(waste[waste.length - 1]!)}
                </button>
              )}
            </div>
          </div>

          {/* Foundations */}
          <div className="flex gap-2">
            {foundations.map((pile, i) => (
              <div
                key={i}
                className="w-14 h-20 rounded-lg bg-slate-700/40 border-2 border-dashed border-slate-600 flex items-center justify-center min-w-[3.5rem]"
              >
                {pile.length > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      selectedCards.length === 1 && canPlaceOnFoundation(selectedCards[0]!, pile) && moveToFoundation(i)
                    }
                    className={`
                      w-full h-full flex items-center justify-center text-sm font-medium rounded-lg
                      ${isRed(pile[pile.length - 1]!) ? 'text-red-600' : 'text-slate-800'}
                      bg-white border-2 border-slate-500
                      ${selectedCards.length === 1 && canPlaceOnFoundation(selectedCards[0]!, pile) ? 'ring-2 ring-cyan-400' : ''}
                    `}
                  >
                    {cardLabel(pile[pile.length - 1]!)}
                  </button>
                ) : (
                  <span
                    className={`
                      text-slate-500 text-xs
                      ${selectedCards.length === 1 && cardRank(selectedCards[0]!) === 12 ? 'ring-2 ring-cyan-400 rounded-lg w-full h-full flex items-center justify-center' : ''}
                    `}
                    onClick={() =>
                      selectedCards.length === 1 && cardRank(selectedCards[0]!) === 12 && moveToFoundation(i)
                    }
                  >
                    A
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ minHeight: 140 }}>
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className="flex flex-col items-center gap-0 min-w-[3.5rem]"
            >
              {col.cards.map((card, cardIndex) => {
                const isHidden = cardIndex < col.hidden;
                const run = getColumnRun(col);
                const runStart = col.cards.length - run.length;
                const isInRun = cardIndex >= runStart;
                const selected =
                  selection?.type === 'column' &&
                  selection.col === colIndex &&
                  selection.run.includes(card);

                return (
                  <button
                    key={cardIndex}
                    type="button"
                    onClick={() => {
                      if (isHidden) return;
                      if (isInRun) {
                        if (selection?.type === 'column' && selection.col === colIndex) {
                          setSelection(null);
                          return;
                        }
                        const runToMove = col.cards.slice(runStart);
                        setSelection({ type: 'column', col: colIndex, run: runToMove });
                        return;
                      }
                      if (selection) {
                        if (selectedCards.length === 1 && canPlaceOnColumn(selectedCards[0]!, col))
                          moveToColumn(colIndex);
                        else if (
                          selection.type === 'column' &&
                          run.length > 0 &&
                          canPlaceOnColumn(run[0]!, col)
                        )
                          moveToColumn(colIndex);
                        return;
                      }
                    }}
                    className={`
                      w-14 rounded-lg border-2 flex items-center justify-center text-sm font-medium
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                      ${isHidden ? 'bg-cyan-800/60 border-cyan-700 text-cyan-200' : 'bg-white border-slate-500'}
                      ${isRed(card) && !isHidden ? 'text-red-600' : !isHidden ? 'text-slate-800' : ''}
                      ${selected ? 'ring-2 ring-cyan-400 -translate-y-0.5' : ''}
                      ${isInRun ? 'cursor-pointer' : 'cursor-default'}
                      -mt-4 first:mt-0
                    `}
                    style={{ marginTop: cardIndex === 0 ? 0 : -16 }}
                  >
                    {isHidden ? '?' : cardLabel(card)}
                  </button>
                );
              })}
              {col.cards.length === col.hidden && (
                <div
                  className={`
                    w-14 h-20 rounded-lg border-2 border-dashed border-slate-600 -mt-4 first:mt-0 flex items-center justify-center
                    ${selection && selectedCards.length > 0 && canPlaceOnColumn(selectedCards[0]!, col) ? 'ring-2 ring-cyan-400 bg-cyan-400/10' : 'bg-slate-700/20'}
                  `}
                  style={{ marginTop: col.cards.length ? -16 : 0 }}
                  onClick={() => selection && selectedCards.length > 0 && canPlaceOnColumn(selectedCards[0]!, col) && moveToColumn(colIndex)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </GameLayout>
  );
}
