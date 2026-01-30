import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getToolById } from '@/config/tools';
import { toolPageRegistry, toolSlugs } from '@/components/tools/pages/registry';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return toolSlugs.map((slug) => ({ slug }));
}

function ToolLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-700/60" />
        <div className="h-4 w-48 rounded bg-slate-700/60" />
        <div className="h-4 w-64 rounded bg-slate-700/60" />
      </div>
    </div>
  );
}

export default async function ToolSlugPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) notFound();
  const Component = toolPageRegistry[slug];
  if (!Component) notFound();
  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      <Component slug={slug} />
    </Suspense>
  );
}
