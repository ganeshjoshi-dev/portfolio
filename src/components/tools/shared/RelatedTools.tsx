import { getToolById } from '@/config/tools';
import ToolCard from './ToolCard';

interface RelatedToolsProps {
  toolIds: string[];
  title?: string;
}

export default function RelatedTools({ toolIds, title = 'Related Tools' }: RelatedToolsProps) {
  // Filter out any invalid tool IDs
  const tools = toolIds
    .map(id => getToolById(id))
    .filter(tool => tool !== undefined);

  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
