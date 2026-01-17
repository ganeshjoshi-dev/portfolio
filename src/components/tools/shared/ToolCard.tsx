import Link from 'next/link';
import {
  Palette,
  Paintbrush,
  Square,
  RectangleHorizontal,
  FileJson,
  Code,
  FileCode,
  FileDiff,
  Ruler,
  Binary,
  Fingerprint,
  Type,
  Link as LinkIcon,
  Droplets,
  ArrowUpDown,
  ArrowLeftRight,
  Wrench,
  Wind,
  LucideIcon,
} from 'lucide-react';
import { Tool } from '@/types/tools';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Palette,
  Paintbrush,
  Square,
  RectangleHorizontal,
  FileJson,
  Code,
  FileCode,
  FileDiff,
  Ruler,
  Regex: Code, // Fallback for Regex
  Binary,
  Fingerprint,
  Type,
  Link: LinkIcon,
  Droplets,
  ArrowUpDown,
  ArrowLeftRight,
  Wrench,
  Wind,
};

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || Wrench;

  return (
    <Link
      href={tool.path}
      className="
        group block p-6 bg-slate-900/60 backdrop-blur-sm rounded-xl
        border border-slate-700/60 hover:border-cyan-400/50
        transition-all duration-300 hover:translate-y-[-4px]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
        focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
      "
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="
          p-3 rounded-lg bg-slate-800/60 border border-slate-700/60
          group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10
          transition-all duration-300
        ">
          <IconComponent className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
              {tool.name}
            </h3>
            {tool.isNew && (
              <span className="px-2 py-0.5 text-xs font-medium bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
                New
              </span>
            )}
            {tool.isBeta && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                Beta
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
