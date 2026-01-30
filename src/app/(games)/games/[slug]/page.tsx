import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getGameById } from '@/config/games';
import { gamePageRegistry, gameSlugs } from '@/components/games/pages/registry';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return gameSlugs.map((slug) => ({ slug }));
}

function GameLoadingFallback() {
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

export default async function GameSlugPage({ params }: Props) {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) notFound();
  const Component = gamePageRegistry[slug];
  if (!Component) notFound();
  return (
    <Suspense fallback={<GameLoadingFallback />}>
      <Component slug={slug} />
    </Suspense>
  );
}
