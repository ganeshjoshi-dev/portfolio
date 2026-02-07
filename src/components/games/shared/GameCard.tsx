import Link from 'next/link';
import {
  Brain,
  Puzzle,
  Gamepad2,
  Type,
  Grid3X3,
  LayoutGrid,
  Worm,
  HelpCircle,
  Layers,
  CircleDot,
  Hand,
  Circle,
  Grid2X2,
  Flame,
  Square,
  Shuffle,
  Hash,
  Bomb,
  Library,
  Search,
  Keyboard,
  LucideIcon,
} from 'lucide-react';
import { Game } from '@/types/games';

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Puzzle,
  Gamepad2,
  Type,
  Grid3X3,
  LayoutGrid,
  Worm,
  HelpCircle,
  Layers,
  CircleDot,
  Hand,
  Circle,
  Grid2X2,
  Flame,
  Square,
  Shuffle,
  Hash,
  Bomb,
  Library,
  Search,
  Keyboard,
};

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const IconComponent = iconMap[game.icon] || Puzzle;

  return (
    <Link
      href={game.path}
      scroll={true}
      className="
        group block p-6 bg-slate-900/60 backdrop-blur-sm rounded-xl
        border border-slate-700/60 hover:border-cyan-400/50
        transition-all duration-300 hover:translate-y-[-4px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      "
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="
          p-3 rounded-lg bg-slate-800/60 border border-slate-700/60
          group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10
          transition-all duration-300
        ">
          <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {game.name}
            </h3>
            {game.isNew && (
              <span className="px-2 py-0.5 text-xs font-medium bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
                New
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
