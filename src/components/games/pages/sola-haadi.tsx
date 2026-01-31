'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Info } from 'lucide-react';
import { getGameById } from '@/config/games';
import { GameLayout } from '@/components/games/shared';
import { Button, Accordion, Select, Input, ConfirmDialog, Modal } from '@/components/ui';

const N_POINTS = 37;

type Player = 'P1' | 'P2';
type Board = (Player | null)[];

// N = Top, M = Bottom, B = Blank Row (middle row — empty at start, playable).
// Index mapping from handwritten layout (top→bottom): N1-N3(0-2), N4-N6(3-5), N7-N11(6-10), N12-N16(11-15), B1-B5(16-20), M12-M16(21-25), M7-M11(26-30), M4-M6(31-33), M1-M3(34-36).
// GRAPH from handwritten adjacency lists; center B3 (18) has diagonals ONLY to NE,NW,SE,SW.

const GRAPH: Record<string, string[]> = (() => {
  const g: Record<string, string[]> = {};
  const addBi = (a: number, b: number) => {
    const ka = String(a);
    const kb = String(b);
    if (!g[ka]) g[ka] = [];
    if (!g[ka].includes(kb)) g[ka].push(kb);
    if (!g[kb]) g[kb] = [];
    if (!g[kb].includes(ka)) g[kb].push(ka);
  };

  // --- N (Top) from handwritten list ---
  addBi(0, 1); addBi(0, 3);   // N1 -> N2, N4
  addBi(1, 2); addBi(1, 4);   // N2 -> N1, N3, N5
  addBi(2, 5);                // N3 -> N2, N6
  addBi(3, 4); addBi(3, 8);   // N4 -> N5, N9, N1
  addBi(4, 5); addBi(4, 8);   // N5 -> N4, N6, N9, N2
  addBi(5, 8);                // N6 -> N5, N9, N3
  addBi(6, 7); addBi(6, 11); addBi(6, 12);   // N7
  addBi(7, 8); addBi(7, 12);                 // N8
  addBi(8, 9); addBi(8, 12); addBi(8, 13); addBi(8, 14);   // N9 → N10, N13, N14, N15 (center column: N9–N14–B3–M14–M9, no direct N9–M14)
  addBi(9, 10); addBi(9, 14);                // N10
  addBi(10, 14); addBi(10, 15);             // N11
  addBi(11, 12); addBi(11, 16);             // N12
  addBi(12, 13); addBi(12, 16); addBi(12, 17); addBi(12, 18);  // N13
  addBi(13, 14); addBi(13, 18);             // N14
  addBi(14, 15); addBi(14, 18); addBi(14, 19); addBi(14, 20);  // N15
  addBi(15, 20);                             // N16

  // --- B (Blank row) ---
  addBi(16, 17); addBi(16, 21); addBi(16, 22);  // B1
  addBi(17, 18); addBi(17, 22);                 // B2
  addBi(18, 19); addBi(18, 22); addBi(18, 23); addBi(18, 24);  // B3 (center)
  addBi(19, 20); addBi(19, 24);                 // B4
  addBi(20, 24); addBi(20, 25);                 // B5

  // --- M (Bottom) from handwritten list; indices: M12-M16=21-25, M7-M11=26-30, M4-M6=31-33, M1-M3=34-36 ---
  addBi(21, 22); addBi(21, 26);   // M12
  addBi(22, 23); addBi(22, 26); addBi(22, 27);  // M13
  addBi(23, 24); addBi(23, 28);   // M14
  addBi(24, 25); addBi(24, 28); addBi(24, 29); addBi(24, 30);  // M15
  addBi(25, 30);                 // M16
  addBi(26, 27);                 // M7
  addBi(27, 28);                 // M8
  addBi(28, 29); addBi(28, 31); addBi(28, 32); addBi(28, 33); addBi(28, 22); addBi(28, 23); addBi(28, 24);  // M9
  addBi(29, 30);                 // M10
  addBi(30, 25);                 // M11 (M10-M11-M16)
  addBi(31, 32); addBi(31, 34);  // M4 (M4->M5,M9; M1->M2,M4)
  addBi(32, 33); addBi(32, 35);  // M5
  addBi(33, 36);                 // M6
  addBi(34, 35);                 // M1
  addBi(35, 36);                 // M2
  addBi(36, 33);                 // M3

  // Center B3 (18): diagonals ONLY to NE,NW,SE,SW → N13(12), N15(14), M13(22), M15(24); orthogonal N14(13), B2(17), B4(19), M14(23)
  g['18'] = ['12', '13', '14', '17', '19', '22', '23', '24'];
  for (const n of [12, 13, 14, 17, 19, 22, 23, 24]) {
    if (!g[String(n)].includes('18')) g[String(n)].push('18');
  }
  for (const id of Object.keys(g)) {
    const num = Number(id);
    if (num === 18) continue;
    const list = g[id];
    const allowed = [12, 13, 14, 17, 19, 22, 23, 24];
    if (list.includes('18') && !allowed.includes(num)) {
      g[id] = list.filter((x) => x !== '18');
    }
  }

  return g;
})();

/** Neighbors of a node (by index). Derived only from GRAPH. */
function getNeighbors(nodeIndex: number): number[] {
  const list = GRAPH[String(nodeIndex)];
  return list ? list.map(Number) : [];
}

// Board layout: LOCKED DESIGN. N (top), B (blank row), M (bottom). Triangle tips use diagonal (cross) lines; square uses squareHSpacing for horizontal spacing.
const POINT_COORDS: { x: number; y: number }[] = (() => {
  const out: { x: number; y: number }[] = [];
  const cx = 60;
  const spacing = 18;
  const squareHSpacing = 24; // wider horizontal spacing inside the 5×5 square (N7–N16, B1–B5, M7–M16)
  const rowY = (row: number) => 22 + row * spacing;

  // N (Top): Row0 N1-N3(3), Row1 N4-N6(3), Row2 N7-N11(5), Row3 N12-N16(5)
  // N1 and N3 shifted outward so N1–N4 and N3–N6 are diagonal (cross) lines
  out[0] = { x: cx - 2 * spacing, y: rowY(0) };
  out[1] = { x: cx, y: rowY(0) };
  out[2] = { x: cx + 2 * spacing, y: rowY(0) };
  out[3] = { x: cx - spacing, y: rowY(1) };
  out[4] = { x: cx, y: rowY(1) };
  out[5] = { x: cx + spacing, y: rowY(1) };
  for (let c = 0; c < 5; c++) out.push({ x: cx + (c - 2) * squareHSpacing, y: rowY(2) });
  for (let c = 0; c < 5; c++) out.push({ x: cx + (c - 2) * squareHSpacing, y: rowY(3) });

  // B (Blank row): B1-B5
  const bY = rowY(4);
  for (let c = 0; c < 5; c++) out.push({ x: cx + (c - 2) * squareHSpacing, y: bY });

  // M (Bottom): Row6 M12-M16(5), Row7 M7-M11(5), Row8 M4-M6(3), Row9 M1-M3(3)
  const mBase = rowY(5);
  for (let c = 0; c < 5; c++) out.push({ x: cx + (c - 2) * squareHSpacing, y: mBase });
  for (let c = 0; c < 5; c++) out.push({ x: cx + (c - 2) * squareHSpacing, y: mBase + spacing });
  // M4–M6 row; M1 and M3 shifted outward so M1–M4 and M3–M6 are diagonal (cross) lines
  out[31] = { x: cx - spacing, y: mBase + spacing * 2 };
  out[32] = { x: cx, y: mBase + spacing * 2 };
  out[33] = { x: cx + spacing, y: mBase + spacing * 2 };
  out[34] = { x: cx - 2 * spacing, y: mBase + spacing * 3 };
  out[35] = { x: cx, y: mBase + spacing * 3 };
  out[36] = { x: cx + 2 * spacing, y: mBase + spacing * 3 };

  return out;
})();

// Readable node names for move history: N1–N16 (top), B1–B5 (middle), M1–M16 (bottom).
const NODE_NAMES: string[] = (() => {
  const names: string[] = [];
  ['N1', 'N2', 'N3'].forEach((n, i) => { names[i] = n; });
  ['N4', 'N5', 'N6'].forEach((n, i) => { names[3 + i] = n; });
  ['N7', 'N8', 'N9', 'N10', 'N11'].forEach((n, i) => { names[6 + i] = n; });
  ['N12', 'N13', 'N14', 'N15', 'N16'].forEach((n, i) => { names[11 + i] = n; });
  ['B1', 'B2', 'B3', 'B4', 'B5'].forEach((n, i) => { names[16 + i] = n; });
  ['M12', 'M13', 'M14', 'M15', 'M16'].forEach((n, i) => { names[21 + i] = n; });
  ['M7', 'M8', 'M9', 'M10', 'M11'].forEach((n, i) => { names[26 + i] = n; });
  ['M4', 'M5', 'M6'].forEach((n, i) => { names[31 + i] = n; });
  ['M1', 'M2', 'M3'].forEach((n, i) => { names[34 + i] = n; });
  return names;
})();

const NODE_R = 5;
const PIECE_R = 4;
const HIT_R = 10;

const PIECE_COLORS = [
  { value: 'amber', label: 'Yellow', fill: 'fill-amber-400', stroke: 'stroke-amber-500/80' },
  { value: 'cyan', label: 'Cyan', fill: 'fill-cyan-400', stroke: 'stroke-cyan-500/80' },
  { value: 'emerald', label: 'Green', fill: 'fill-emerald-400', stroke: 'stroke-emerald-500/80' },
  { value: 'rose', label: 'Pink', fill: 'fill-rose-400', stroke: 'stroke-rose-500/80' },
  { value: 'violet', label: 'Purple', fill: 'fill-violet-400', stroke: 'stroke-violet-500/80' },
  { value: 'orange', label: 'Orange', fill: 'fill-orange-400', stroke: 'stroke-orange-500/80' },
] as const;

const PIECE_SHAPES = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
] as const;

// N side (top): indices 0–15. M side (bottom): indices 21–36.
const N_SIDE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const M_SIDE = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

/** First mover gets M (bottom) side, other gets N (top) side. */
function createInitialBoard(firstMover: Player): Board {
  const board: Board = Array(N_POINTS).fill(null);
  if (firstMover === 'P1') {
    for (const i of M_SIDE) board[i] = 'P1';
    for (const i of N_SIDE) board[i] = 'P2';
  } else {
    for (const i of M_SIDE) board[i] = 'P2';
    for (const i of N_SIDE) board[i] = 'P1';
  }
  return board;
}

interface SimpleMove {
  kind: 'simple';
  from: number;
  to: number;
}
interface CaptureMove {
  kind: 'capture';
  from: number;
  to: number;
  captured: number[];
}
type Move = SimpleMove | CaptureMove;

interface MoveHistoryEntry {
  player: Player;
  kind: 'simple' | 'capture';
  from: number;
  to: number;
  captured?: number[];
}

/** Normal move: move to a directly adjacent empty node (from GRAPH). */
function getValidMoves(
  board: Board,
  from: number,
  _player: Player,
  lastTo?: number
): number[] {
  const valid: number[] = [];
  for (const to of getNeighbors(from)) {
    if (board[to] !== null) continue;
    if (lastTo !== undefined && to === lastTo) continue;
    valid.push(to);
  }
  return valid;
}

/** True only when from–mid–to are on one straight line and mid is between from and to (no “turn” – capture is a single straight jump). */
/** Allowed angle (degrees) between jump segments so near-straight board lines (e.g. M4–M9–M15) count as one straight jump. */
const CAPTURE_ANGLE_TOLERANCE_DEG = 15;

function isStraightLineCapture(from: number, mid: number, to: number): boolean {
  const a = POINT_COORDS[from];
  const b = POINT_COORDS[mid];
  const c = POINT_COORDS[to];
  const ux = b.x - a.x;
  const uy = b.y - a.y;
  const vx = c.x - b.x;
  const vy = c.y - b.y;
  const dot = ux * vx + uy * vy;
  if (dot <= 0) return false;
  const ulen = Math.hypot(ux, uy) || 1;
  const vlen = Math.hypot(vx, vy) || 1;
  const cosAngle = dot / (ulen * vlen);
  const cosThreshold = Math.cos((CAPTURE_ANGLE_TOLERANCE_DEG * Math.PI) / 180);
  return cosAngle >= cosThreshold;
}

/** Capture = one straight jump over an opponent: from–mid–to within angle tolerance (no sharp turn). Both steps must be edges in GRAPH. */
function getCaptureMoves(
  board: Board,
  from: number,
  player: Player,
  lastTo?: number
): { to: number; captured: number }[] {
  const opponent = player === 'P1' ? 'P2' : 'P1';
  const result: { to: number; captured: number }[] = [];
  for (const mid of getNeighbors(from)) {
    if (board[mid] !== opponent) continue;
    for (const to of getNeighbors(mid)) {
      if (board[to] !== null || to === from) continue;
      if (lastTo !== undefined && to === lastTo) continue;
      if (!isStraightLineCapture(from, mid, to)) continue;
      result.push({ to, captured: mid });
    }
  }
  return result;
}

/** Multi-capture paths via DFS on the graph. */
function getMultiCapturePaths(
  board: Board,
  from: number,
  player: Player,
  capturedSoFar: number[],
  lastTo?: number
): CaptureMove[] {
  const jumps = getCaptureMoves(board, from, player, lastTo);
  if (jumps.length === 0) {
    if (capturedSoFar.length > 0) {
      return [{ kind: 'capture', from, to: from, captured: capturedSoFar }];
    }
    return [];
  }
  const result: CaptureMove[] = [];
  for (const { to, captured } of jumps) {
    const newBoard = board.slice();
    newBoard[from] = null;
    newBoard[captured] = null;
    newBoard[to] = player;
    const chain = getMultiCapturePaths(newBoard, to, player, [...capturedSoFar, captured], from);
    for (const m of chain) {
      if (m.kind === 'capture' && m.captured.length > capturedSoFar.length) {
        result.push({ kind: 'capture', from, to: m.to, captured: m.captured });
      }
    }
    result.push({
      kind: 'capture',
      from,
      to,
      captured: [...capturedSoFar, captured],
    });
  }
  return result;
}

function getAllMoves(board: Board, player: Player): Move[] {
  const moves: Move[] = [];
  for (let from = 0; from < N_POINTS; from++) {
    if (board[from] !== player) continue;
    const captures = getMultiCapturePaths(board, from, player, []);
    for (const c of captures) {
      if (c.captured.length > 0 && c.from !== c.to) moves.push(c);
    }
  }
  if (moves.length > 0) return moves;
  for (let from = 0; from < N_POINTS; from++) {
    if (board[from] !== player) continue;
    const tos = getValidMoves(board, from, player);
    for (const to of tos) {
      moves.push({ kind: 'simple', from, to });
    }
  }
  return moves;
}

function applyMove(board: Board, move: Move): Board {
  const next = board.slice();
  if (move.kind === 'simple') {
    next[move.to] = next[move.from];
    next[move.from] = null;
  } else {
    next[move.to] = next[move.from];
    next[move.from] = null;
    for (const c of move.captured) next[c] = null;
  }
  return next;
}

function checkWinner(board: Board, currentTurn: Player): Player | null {
  const p1Count = board.filter((c) => c === 'P1').length;
  const p2Count = board.filter((c) => c === 'P2').length;
  if (p1Count === 0) return 'P2';
  if (p2Count === 0) return 'P1';
  const moves = getAllMoves(board, currentTurn);
  if (moves.length === 0) return currentTurn === 'P1' ? 'P2' : 'P1';
  return null;
}

function evaluatePosition(board: Board): number {
  let score = 0;
  const p2Count = board.filter((c) => c === 'P2').length;
  const p1Count = board.filter((c) => c === 'P1').length;
  score += (p2Count - p1Count) * 10;
  const p2Moves = getAllMoves(board, 'P2').length;
  const p1Moves = getAllMoves(board, 'P1').length;
  score += (p2Moves - p1Moves) * 0.5;
  return score;
}

const AI_DEPTH = 3;

function minimax(
  board: Board,
  depth: number,
  isP2: boolean,
  alpha: number,
  beta: number
): number {
  const winner = checkWinner(board, isP2 ? 'P2' : 'P1');
  if (winner === 'P2') return 1000 - depth;
  if (winner === 'P1') return -1000 + depth;
  if (depth >= AI_DEPTH) return evaluatePosition(board);
  const player: Player = isP2 ? 'P2' : 'P1';
  const moves = getAllMoves(board, player);
  if (moves.length === 0) return isP2 ? -1000 : 1000;
  if (isP2) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const next = applyMove(board, move);
      const eval_ = minimax(next, depth + 1, false, alpha, beta);
      maxEval = Math.max(maxEval, eval_);
      alpha = Math.max(alpha, eval_);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const next = applyMove(board, move);
      const eval_ = minimax(next, depth + 1, true, alpha, beta);
      minEval = Math.min(minEval, eval_);
      beta = Math.min(beta, eval_);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getAiMove(board: Board): Move | null {
  const moves = getAllMoves(board, 'P2');
  if (moves.length === 0) return null;
  let best: Move = moves[0];
  let bestScore = -Infinity;
  for (const move of moves) {
    const next = applyMove(board, move);
    const score = minimax(next, 1, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

const CAPTURED_ICON_SIZE = 10;

function CapturedPieceIcon({ color, shape }: { color: string; shape: string }) {
  const fillClass = PIECE_COLORS.find((c) => c.value === color)?.fill ?? 'fill-slate-400';
  const strokeClass = PIECE_COLORS.find((c) => c.value === color)?.stroke ?? 'stroke-slate-500/80';
  const r = CAPTURED_ICON_SIZE / 2;
  const cx = r;
  const cy = r;
  const size = CAPTURED_ICON_SIZE;
  const common = { className: `${fillClass} ${strokeClass}`, strokeWidth: 0.8 };
  if (shape === 'round') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
        <circle {...common} cx={cx} cy={cy} r={r - 0.5} />
      </svg>
    );
  }
  if (shape === 'square') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
        <rect {...common} x={0.5} y={0.5} width={size - 1} height={size - 1} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      <polygon
        {...common}
        points={`${cx},0.5 ${size - 0.5},${cy} ${cx},${size - 0.5} 0.5,${cy}`}
      />
    </svg>
  );
}

export default function SolaHaadiPage({ slug }: { slug: string }) {
  const game = getGameById(slug)!;
  const [board, setBoard] = useState<Board>(() => createInitialBoard('P1'));
  const [turn, setTurn] = useState<Player>('P1');
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<'2p' | 'ai'>('2p');
  const [gameStarted, setGameStarted] = useState(false);
  const [multiCaptureFrom, setMultiCaptureFrom] = useState<number | null>(null);
  const [lastTo, setLastTo] = useState<number | undefined>(undefined);
  const [pieceColorP1, setPieceColorP1] = useState<string>('amber');
  const [pieceColorP2, setPieceColorP2] = useState<string>('cyan');
  const [pieceShapeP1, setPieceShapeP1] = useState<string>('round');
  const [pieceShapeP2, setPieceShapeP2] = useState<string>('square');
  const [firstPlayer, setFirstPlayer] = useState<'P1' | 'P2' | 'random'>('P2');
  const [playerNameP1, setPlayerNameP1] = useState<string>('Player 1');
  const [playerNameP2, setPlayerNameP2] = useState<string>('Player 2');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [capturesByP1, setCapturesByP1] = useState(0);
  const [capturesByP2, setCapturesByP2] = useState(0);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [showBoardRefModal, setShowBoardRefModal] = useState(false);
  const [focusedPoint, setFocusedPoint] = useState<number | null>(null);

  const displayNameP1 = (playerNameP1?.trim() || 'Player 1');
  const displayNameP2 = (playerNameP2?.trim() || 'Player 2');

  useEffect(() => {
    if (pieceColorP1 === pieceColorP2) {
      const other = PIECE_COLORS.find((c) => c.value !== pieceColorP1);
      if (other) setPieceColorP2(other.value);
    }
  }, [pieceColorP1, pieceColorP2]);

  const winner = useMemo(() => checkWinner(board, turn), [board, turn]);
  const gameOver = winner !== null;

  const validSimpleTargets = useMemo(() => {
    if (selected === null || board[selected] !== turn) return [];
    if (multiCaptureFrom !== null) return [];
    return getValidMoves(board, selected, turn, lastTo);
  }, [board, turn, selected, multiCaptureFrom, lastTo]);

  const validCaptureTargets = useMemo(() => {
    if (selected === null || board[selected] !== turn) return [];
    const from = multiCaptureFrom ?? selected;
    const jumps = getCaptureMoves(board, from, turn, lastTo);
    return jumps.map((j) => j.to);
  }, [board, turn, selected, multiCaptureFrom, lastTo]);

  const validTargets = useMemo(() => {
    // Show both simple moves and captures so player can choose (capture is optional).
    return [...new Set([...validCaptureTargets, ...validSimpleTargets])];
  }, [validCaptureTargets, validSimpleTargets]);

  const handlePointClick = useCallback(
    (index: number) => {
      if (gameOver) return;
      if (mode === 'ai' && turn === 'P2') return;

      const cell = board[index];
      if (cell === turn) {
        setSelected(index);
        setMultiCaptureFrom(null);
        setLastTo(undefined);
        return;
      }
      if (multiCaptureFrom !== null && !validTargets.includes(index)) {
        setSelected(null);
        setMultiCaptureFrom(null);
        setLastTo(undefined);
        setTurn(turn === 'P1' ? 'P2' : 'P1');
        return;
      }
      if (validTargets.includes(index)) {
        const from = multiCaptureFrom ?? selected!;
        const jumps = getCaptureMoves(board, from, turn, lastTo);
        const isCapture = jumps.some((j) => j.to === index);
        if (isCapture) {
          const jump = jumps.find((j) => j.to === index)!;
          const newBoard = board.slice();
          newBoard[from] = null;
          newBoard[jump.captured] = null;
          newBoard[index] = turn;
          if (turn === 'P1') setCapturesByP1((prev) => prev + 1);
          else setCapturesByP2((prev) => prev + 1);
          setMoveHistory((prev) => [...prev, { player: turn, kind: 'capture', from, to: index, captured: [jump.captured] }]);
          setBoard(newBoard);
          const moreJumps = getCaptureMoves(newBoard, index, turn, from);
          if (moreJumps.length > 0) {
            setSelected(index);
            setMultiCaptureFrom(index);
            setLastTo(from);
          } else {
            setSelected(null);
            setMultiCaptureFrom(null);
            setLastTo(undefined);
            setTurn(turn === 'P1' ? 'P2' : 'P1');
          }
        } else {
          const newBoard = board.slice();
          newBoard[index] = turn;
          newBoard[from] = null;
          setMoveHistory((prev) => [...prev, { player: turn, kind: 'simple', from, to: index }]);
          setBoard(newBoard);
          setSelected(null);
          setMultiCaptureFrom(null);
          setLastTo(undefined);
          setTurn(turn === 'P1' ? 'P2' : 'P1');
        }
        return;
      }
      setSelected(null);
      setMultiCaptureFrom(null);
      setLastTo(undefined);
    },
    [board, turn, selected, multiCaptureFrom, lastTo, validTargets, gameOver, mode]
  );

  useEffect(() => {
    if (mode !== 'ai' || turn !== 'P2' || gameOver) return;
    const timer = setTimeout(() => {
      const aiMove = getAiMove(board);
      if (aiMove) {
        if (aiMove.kind === 'capture') {
          setCapturesByP2((prev) => prev + aiMove.captured.length);
        }
        setMoveHistory((prev) => [
          ...prev,
          {
            player: 'P2',
            kind: aiMove.kind,
            from: aiMove.from,
            to: aiMove.to,
            captured: aiMove.kind === 'capture' ? aiMove.captured : undefined,
          },
        ]);
        setBoard(applyMove(board, aiMove));
        setTurn('P1');
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [mode, turn, gameOver, board]);

  const getInitialTurn = useCallback((): Player => {
    if (firstPlayer === 'random') return Math.random() < 0.5 ? 'P1' : 'P2';
    return firstPlayer;
  }, [firstPlayer]);

  const reset = useCallback(() => {
    const initialTurn = getInitialTurn();
    setBoard(createInitialBoard(initialTurn));
    setTurn(initialTurn);
    setSelected(null);
    setMultiCaptureFrom(null);
    setLastTo(undefined);
    setCapturesByP1(0);
    setCapturesByP2(0);
    setMoveHistory([]);
  }, [getInitialTurn]);

  const handleResetClick = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const handleResetConfirm = useCallback(() => {
    reset();
    setShowResetConfirm(false);
  }, [reset]);

  const handleResetCancel = useCallback(() => {
    setShowResetConfirm(false);
  }, []);

  const start2P = useCallback(() => {
    const initialTurn = getInitialTurn();
    setMode('2p');
    setGameStarted(true);
    setBoard(createInitialBoard(initialTurn));
    setSelected(null);
    setMultiCaptureFrom(null);
    setLastTo(undefined);
    setCapturesByP1(0);
    setCapturesByP2(0);
    setMoveHistory([]);
    setTurn(initialTurn);
  }, [getInitialTurn]);

  const startAi = useCallback(() => {
    const initialTurn = getInitialTurn();
    setMode('ai');
    setGameStarted(true);
    setBoard(createInitialBoard(initialTurn));
    setSelected(null);
    setMultiCaptureFrom(null);
    setLastTo(undefined);
    setCapturesByP1(0);
    setCapturesByP2(0);
    setMoveHistory([]);
    setTurn(initialTurn);
  }, [getInitialTurn]);

  const howToPlayItems = [
    {
      id: 'how-to-play',
      title: 'How to play',
      content: (
        <div className="space-y-3 text-slate-300">
          <p>
            <strong className="text-white">Also known as</strong> Sixteen Soldiers (Sholo Gutti). 
            Traditional board game with 37 points: a 5×5 alquerque grid plus two triangular camps. 
            Sola Haadi is famous in Rajasthan, India.
          </p>
          <p>
            <strong className="text-white">Objective:</strong> Capture all opponent pieces or block them completely.
          </p>
          <p>
            <strong className="text-white">Move:</strong> Move one piece to an adjacent empty point along a line, 
            OR jump over opponent pieces in a straight line to capture them. Multiple jumps in sequence are allowed.
          </p>
          <p>
            <strong className="text-white">Rule:</strong> During multi-jump captures, you cannot 
            immediately return to the point you just left.
          </p>
        </div>
      ),
    },
    ...(gameStarted
      ? [
          {
            id: 'move-history',
            title: `Move history (${moveHistory.length})`,
            titleContent: `Move history (${moveHistory.length})`,
            titleAction: (
              <button
                type="button"
                onClick={() => setShowBoardRefModal(true)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-600/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="View board reference (node names)"
                title="View board reference (node names)"
              >
                <Info className="w-4 h-4" />
              </button>
            ),
            content: (
              <div className="max-h-52 overflow-y-auto rounded border border-slate-600/50 bg-slate-800/20 p-2 space-y-2">
                <p className="text-slate-400 text-xs">
                  Click the <span className="inline-flex align-middle"><Info className="w-3.5 h-3.5 text-slate-400" /></span> button above to see which position is N1, B5, M12, etc.
                </p>
                {moveHistory.length === 0 ? (
                  <p className="text-slate-500 text-sm italic py-1">No moves yet.</p>
                ) : (
                  moveHistory.map((entry, idx) => {
                    const name = entry.player === 'P1' ? displayNameP1 : displayNameP2;
                    const fillClass = entry.player === 'P1'
                      ? (PIECE_COLORS.find((c) => c.value === pieceColorP1)?.fill ?? 'fill-amber-400')
                      : (PIECE_COLORS.find((c) => c.value === pieceColorP2)?.fill ?? 'fill-cyan-400');
                    const fromName = NODE_NAMES[entry.from] ?? String(entry.from);
                    const toName = NODE_NAMES[entry.to] ?? String(entry.to);
                    const captureText = entry.captured?.length ? ` (+${entry.captured.length} capture${entry.captured.length > 1 ? 's' : ''})` : '';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-slate-700/30 min-w-0"
                      >
                        <span className="shrink-0 text-slate-500 tabular-nums w-6">{idx + 1}.</span>
                        <span className={`shrink-0 w-2.5 h-2.5 rounded-full ${fillClass}`} aria-hidden />
                        <span className="text-slate-300 truncate">{name}</span>
                        <span className="text-slate-400 shrink-0">
                          {fromName} → {toName}
                          {captureText && <span className="text-rose-400/90">{captureText}</span>}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  const historyMarksLegend = gameStarted ? (
    <div className="rounded-lg border border-slate-600/40 bg-slate-800/30 px-4 py-3 space-y-2 w-full h-full min-h-0">
      <p className="text-slate-300 text-sm font-medium">What the marks mean</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border-2 border-amber-400 bg-transparent shrink-0" aria-hidden title="Board highlight" />
          From
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border-2 border-green-500 bg-transparent shrink-0" aria-hidden title="Board highlight" />
          To
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full border-2 border-rose-400 bg-transparent shrink-0" aria-hidden title="Board highlight" />
          Captured
        </span>
      </div>
      <p className="text-slate-500 text-sm leading-snug">On the board, the last move is highlighted with these colors. In move history, <span className="text-slate-400">From → To</span> and <span className="text-rose-400/90">+n capture</span> mean the move and any pieces taken.</p>
    </div>
  ) : null;

  const boardRefModalContent = (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">Board reference (node names)</h3>
      <p className="text-slate-400 text-sm">
        Use this map to see which position is N1, B5, M12, etc. when reading move history.
      </p>
      <div className="rounded-lg border border-slate-600/50 bg-slate-800/30 p-2 flex justify-center">
        <svg
          viewBox="0 0 120 218"
          className="w-full max-w-[min(100%,20rem)] aspect-[120/218] text-slate-300"
          aria-label="Board with node names"
        >
          {Object.entries(GRAPH).flatMap(([nodeId, neighbors]) => {
            const i = Number(nodeId);
            const a = POINT_COORDS[i];
            return neighbors
              .filter((jStr) => Number(jStr) > i)
              .map((jStr) => {
                const j = Number(jStr);
                const b = POINT_COORDS[j];
                return (
                  <line
                    key={`ref-${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-500"
                    opacity={0.7}
                  />
                );
              });
          })}
          {POINT_COORDS.map((p, i) => (
            <circle
              key={`ref-node-${i}`}
              cx={p.x}
              cy={p.y}
              r={NODE_R}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-600"
              opacity={0.8}
            />
          ))}
          {POINT_COORDS.map((p, i) => (
            <text
              key={`ref-label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              className="text-slate-200 font-medium"
              style={{ fontSize: 5, pointerEvents: 'none' }}
            >
              {NODE_NAMES[i]}
            </text>
          ))}
        </svg>
      </div>
      <p className="text-slate-500 text-xs">
        <strong className="text-slate-400">N</strong> = top triangle, <strong className="text-slate-400">B</strong> = middle row, <strong className="text-slate-400">M</strong> = bottom triangle.
      </p>
    </div>
  );

  return (
    <GameLayout
      title={game.name}
      description={game.description}
      backLink="/games"
      backLabel="All Games"
    >
      <div className="space-y-6 w-full min-w-0 relative" data-game-container>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch w-full">
          <div className="sm:w-1/2 min-w-0">
            <Accordion items={howToPlayItems} />
          </div>
          {historyMarksLegend && (
            <div className="sm:w-1/2 min-w-0">
              {historyMarksLegend}
            </div>
          )}
        </div>

        <Modal
          open={showBoardRefModal}
          onClose={() => setShowBoardRefModal(false)}
          contentClassName="max-w-2xl w-full"
          aria-label="Board reference"
        >
          {boardRefModalContent}
        </Modal>

        <ConfirmDialog
          open={showResetConfirm}
          onClose={handleResetCancel}
          onConfirm={handleResetConfirm}
          title="New game?"
          description="Current game will be lost. Start fresh?"
          confirmLabel="Start new game"
          cancelLabel="Cancel"
        />

        {!gameStarted ? (
          <div className="w-full max-w-md mx-auto px-1 sm:px-0">
            <div className="rounded-xl border border-slate-600/60 bg-slate-800/40 p-6 space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Choose how to play</h2>
                <p className="text-slate-400 text-sm">
                  Two players on one device, or play against the computer.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-sm font-medium text-slate-300 mb-2">Player names</span>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Input
                        label="Player 1"
                        type="text"
                        value={playerNameP1}
                        onChange={(e) => setPlayerNameP1(e.target.value)}
                        placeholder="Player 1"
                        className="text-slate-800"
                      />
                    </div>
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Input
                        label="Player 2"
                        type="text"
                        value={playerNameP2}
                        onChange={(e) => setPlayerNameP2(e.target.value)}
                        placeholder="Player 2"
                        className="text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Who goes first?
                  </label>
                  <Select
                    options={[
                      { value: 'P1', label: displayNameP1 },
                      { value: 'P2', label: displayNameP2 },
                      { value: 'random', label: 'Random' },
                    ]}
                    value={firstPlayer}
                    onChange={(e) => setFirstPlayer(e.target.value as 'P1' | 'P2' | 'random')}
                    className="text-slate-800"
                  />
                </div>

                <div>
                  <span className="block text-sm font-medium text-slate-300 mb-2">Piece colors</span>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Select
                        label={displayNameP1}
                        options={PIECE_COLORS.map((c) => ({ value: c.value, label: c.label }))}
                        value={pieceColorP1}
                        onChange={(e) => setPieceColorP1(e.target.value)}
                        className="text-slate-800 flex-1 flex flex-col"
                      />
                    </div>
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Select
                        label={displayNameP2}
                        options={PIECE_COLORS.map((c) => ({
                          value: c.value,
                          label: c.label,
                          disabled: c.value === pieceColorP1,
                        }))}
                        value={pieceColorP2}
                        onChange={(e) => setPieceColorP2(e.target.value)}
                        className="text-slate-800 flex-1 flex flex-col"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-slate-300 mb-2">Piece shape</span>
                  <div className="grid grid-cols-2 gap-4 items-start">
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Select
                        label={displayNameP1}
                        options={PIECE_SHAPES.map((s) => ({ value: s.value, label: s.label }))}
                        value={pieceShapeP1}
                        onChange={(e) => setPieceShapeP1(e.target.value)}
                        className="text-slate-800 flex-1 flex flex-col"
                      />
                    </div>
                    <div className="min-h-[4.5rem] flex flex-col">
                      <Select
                        label={displayNameP2}
                        options={PIECE_SHAPES.map((s) => ({ value: s.value, label: s.label }))}
                        value={pieceShapeP2}
                        onChange={(e) => setPieceShapeP2(e.target.value)}
                        className="text-slate-800 flex-1 flex flex-col"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={start2P}
                  className="min-w-[10rem]"
                >
                  Two players
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={startAi}
                  className="min-w-[10rem]"
                >
                  Play vs AI
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 min-w-0">
                <p className="text-slate-400 text-xs sm:text-sm md:text-base min-w-0">
                  {gameOver
                    ? `Winner: ${winner === 'P1' ? `${displayNameP1} (${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.label ?? 'P1'})` : `${displayNameP2} (${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.label ?? 'P2'})`}`
                    : `Turn: ${turn === 'P1' ? `${displayNameP1} (${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.label ?? 'P1'})` : `${displayNameP2} (${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.label ?? 'P2'})`}`}
                  {mode === 'ai' && !gameOver && ` - You are ${displayNameP1}`}
                </p>
                <div className="flex gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleResetClick}>
                  New game
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setGameStarted(false)}
                >
                  Change mode
                </Button>
              </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 sm:gap-4 rounded-lg border border-slate-600/50 bg-slate-800/30 px-3 py-2.5 sm:px-4 sm:py-2.5 w-full min-w-0" aria-label="Captures">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 min-w-0 flex-1 sm:min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 shrink-0">
                    <span
                      className={`shrink-0 w-3 h-3 rounded-full ${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.fill ?? 'fill-amber-400'}`}
                      aria-hidden
                    />
                    <span className="text-slate-300 text-sm min-w-0 break-words">{displayNameP1}</span>
                    <span className="text-slate-500 text-sm shrink-0">captured</span>
                    <span className="text-white font-semibold tabular-nums text-sm shrink-0">{capturesByP1}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0 pl-5 sm:pl-0" aria-label={`${capturesByP1} pieces captured by ${displayNameP1}`}>
                    {Array.from({ length: capturesByP1 }, (_, i) => (
                      <CapturedPieceIcon
                        key={`p1-${i}`}
                        color={pieceColorP2}
                        shape={pieceShapeP2}
                      />
                    ))}
                    {capturesByP1 === 0 && (
                      <span className="text-slate-600 text-xs italic">none</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 w-full h-px sm:w-px sm:h-6 sm:min-h-0 bg-slate-600" aria-hidden />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 min-w-0 flex-1 sm:min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0 shrink-0">
                    <span
                      className={`shrink-0 w-3 h-3 rounded-full ${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.fill ?? 'fill-cyan-400'}`}
                      aria-hidden
                    />
                    <span className="text-slate-300 text-sm min-w-0 break-words">{displayNameP2}</span>
                    <span className="text-slate-500 text-sm shrink-0">captured</span>
                    <span className="text-white font-semibold tabular-nums text-sm shrink-0">{capturesByP2}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0 pl-5 sm:pl-0" aria-label={`${capturesByP2} pieces captured by ${displayNameP2}`}>
                    {Array.from({ length: capturesByP2 }, (_, i) => (
                      <CapturedPieceIcon
                        key={`p2-${i}`}
                        color={pieceColorP1}
                        shape={pieceShapeP1}
                      />
                    ))}
                    {capturesByP2 === 0 && (
                      <span className="text-slate-600 text-xs italic">none</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Modal
              open={!!(gameOver && winner)}
              dismissOnBackdrop={false}
              contentClassName="max-w-xs"
              aria-label="Game over"
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider text-slate-400">
                  Game over
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {winner === 'P1'
                    ? `${displayNameP1} (${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.label ?? 'P1'}) wins!`
                    : `${displayNameP2} (${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.label ?? 'P2'}) wins!`}
                </p>
                <p className="mt-2 text-slate-400 text-sm">🎉 Well played!</p>
              </div>
            </Modal>

            <div className="flex justify-center w-full min-w-0 overflow-x-auto">
              <div
                className="inline-block w-full max-w-[min(100%,28rem)] aspect-[120/218] touch-manipulation"
                role="img"
                aria-label="Sholo Gutti board"
              >
                <svg
                  viewBox="0 0 120 218"
                  className="w-full h-full select-none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Board lines: only edges from GRAPH */}
                  {Object.entries(GRAPH).flatMap(([nodeId, neighbors]) => {
                    const i = Number(nodeId);
                    const a = POINT_COORDS[i];
                    return neighbors
                      .filter((jStr) => Number(jStr) > i)
                      .map((jStr) => {
                        const j = Number(jStr);
                        const b = POINT_COORDS[j];
                        return (
                          <line
                            key={`${i}-${j}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            stroke="currentColor"
                            strokeWidth="1.2"
                            className="text-slate-500"
                            style={{ pointerEvents: 'none' }}
                          />
                        );
                      });
                  })}
                  {/* Node circles */}
                  {POINT_COORDS.map((p, i) => (
                    <circle
                      key={`node-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-slate-600"
                      style={{ pointerEvents: 'none' }}
                    />
                  ))}
                  {/* Last move highlight */}
                  {moveHistory.length > 0 && (() => {
                    const last = moveHistory[moveHistory.length - 1];
                    const nodes = [
                      { i: last.from, fill: 'rgba(251,191,36,0.35)', stroke: 'rgba(251,191,36,0.7)' },
                      { i: last.to, fill: 'rgba(34,197,94,0.35)', stroke: 'rgba(34,197,94,0.7)' },
                      ...(last.captured ?? []).map((i) => ({ i, fill: 'rgba(244,63,94,0.3)', stroke: 'rgba(244,63,94,0.6)' })),
                    ];
                    return (
                      <g style={{ pointerEvents: 'none' }}>
                        {nodes.map(({ i: idx, fill, stroke }) => {
                          const p = POINT_COORDS[idx];
                          return (
                            <circle
                              key={`last-${idx}`}
                              cx={p.x}
                              cy={p.y}
                              r={NODE_R + 2}
                              fill={fill}
                              stroke={stroke}
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </g>
                    );
                  })()}
                  {/* Pieces */}
                  {POINT_COORDS.map((p, i) => {
                    if (!board[i]) return null;
                    const pieceClass =
                      board[i] === 'P1'
                        ? `${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.fill ?? 'fill-amber-400'} ${PIECE_COLORS.find((c) => c.value === pieceColorP1)?.stroke ?? 'stroke-amber-500/80'}`
                        : `${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.fill ?? 'fill-cyan-400'} ${PIECE_COLORS.find((c) => c.value === pieceColorP2)?.stroke ?? 'stroke-cyan-500/80'}`;
                    const pieceProps = {
                      className: pieceClass,
                      strokeWidth: 0.8,
                      style: { pointerEvents: 'none' as const },
                    };
                    const shape = board[i] === 'P1' ? pieceShapeP1 : pieceShapeP2;
                    if (shape === 'round') {
                      return (
                        <circle
                          key={`piece-${i}`}
                          {...pieceProps}
                          cx={p.x}
                          cy={p.y}
                          r={PIECE_R}
                        />
                      );
                    }
                    if (shape === 'square') {
                      return (
                        <rect
                          key={`piece-${i}`}
                          {...pieceProps}
                          x={p.x - PIECE_R}
                          y={p.y - PIECE_R}
                          width={PIECE_R * 2}
                          height={PIECE_R * 2}
                        />
                      );
                    }
                    return (
                      <polygon
                        key={`piece-${i}`}
                        {...pieceProps}
                        points={`${p.x},${p.y - PIECE_R} ${p.x + PIECE_R},${p.y} ${p.x},${p.y + PIECE_R} ${p.x - PIECE_R},${p.y}`}
                      />
                    );
                  })}
                  {/* Selection and valid targets */}
                  {selected !== null && (
                    <g style={{ pointerEvents: 'none' }}>
                      {validTargets.map((to) => (
                        <circle
                          key={to}
                          cx={POINT_COORDS[to].x}
                          cy={POINT_COORDS[to].y}
                          r={NODE_R}
                          fill="currentColor"
                          fillOpacity="0.3"
                          className="text-green-400"
                        />
                      ))}
                    </g>
                  )}
                  {/* Keyboard focus ring (visible when focus is set to none globally) */}
                  {focusedPoint !== null && (
                    <g style={{ pointerEvents: 'none' }}>
                      <circle
                        cx={POINT_COORDS[focusedPoint].x}
                        cy={POINT_COORDS[focusedPoint].y}
                        r={NODE_R + 1}
                        fill="none"
                        stroke="rgb(251, 191, 36)"
                        strokeWidth="1.5"
                        strokeOpacity="0.95"
                        strokeDasharray="3 2"
                      />
                    </g>
                  )}
                  {/* Hit areas */}
                  {POINT_COORDS.map((p, i) => (
                    <circle
                      key={`hit-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={HIT_R}
                      fill="transparent"
                      className="cursor-pointer hover:fill-white/5"
                      style={{
                        pointerEvents: gameOver || (mode === 'ai' && turn === 'P2') ? 'none' : 'auto',
                      }}
                      onClick={() => handlePointClick(i)}
                      role="button"
                      tabIndex={gameOver || (mode === 'ai' && turn === 'P2') ? -1 : 0}
                      aria-label={
                        board[i]
                          ? `${board[i]} piece`
                          : validTargets.includes(i)
                            ? 'Valid move'
                            : 'Empty'
                      }
                      onFocus={() => setFocusedPoint(i)}
                      onBlur={() => setFocusedPoint(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePointClick(i);
                        }
                      }}
                    />
                  ))}
                </svg>
              </div>
            </div>

            {multiCaptureFrom !== null && (
              <p className="text-sm text-cyan-400 text-center">
                Continue jumping or click elsewhere to end your turn
              </p>
            )}
          </>
        )}
      </div>
    </GameLayout>
  );
}