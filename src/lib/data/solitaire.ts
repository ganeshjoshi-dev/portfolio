/** Klondike Solitaire: card representation and shuffle. Cards 0-51: 2♠..A♠, 2♥..A♥, 2♦..A♦, 2♣..A♣. */

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
export const SUITS = ['♠', '♥', '♦', '♣'] as const;
export const SUIT_COLOR: ('red' | 'black')[] = ['black', 'red', 'red', 'black'];

export function cardRank(card: number): number {
  return card % 13;
}

export function cardSuit(card: number): number {
  return Math.floor(card / 13);
}

export function cardLabel(card: number): string {
  return RANKS[cardRank(card)]! + SUITS[cardSuit(card)]!;
}

export function isRed(card: number): boolean {
  return SUIT_COLOR[cardSuit(card)] === 'red';
}

export function shuffleDeck(): number[] {
  const deck = Array.from({ length: 52 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  return deck;
}

export function createInitialState(): {
  columns: { cards: number[]; hidden: number }[];
  foundations: number[][];
  stock: number[];
  waste: number[];
} {
  const deck = shuffleDeck();
  const columns: { cards: number[]; hidden: number }[] = [];
  let idx = 0;
  for (let col = 0; col < 7; col++) {
    const count = col + 1;
    const cards: number[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(deck[idx++]!);
    }
    columns.push({ cards, hidden: count - 1 });
  }
  const stock = deck.slice(idx);
  return {
    columns,
    foundations: [[], [], [], []],
    stock,
    waste: [],
  };
}
