import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGameById } from '@/config/games';
import { generateGameMetadata } from '@/lib/utils/game-seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) return {};
  return generateGameMetadata(game);
}

export default async function GameSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) notFound();
  return <>{children}</>;
}
