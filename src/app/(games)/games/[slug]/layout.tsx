import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getGameById } from '@/config/games';
import { generateGameMetadata } from '@/lib/utils/game-seo';
import { siteConfig } from '@/lib/utils/seo';

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

function gameStructuredData(slug: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Game' as const,
    name,
    description,
    url: `${siteConfig.url}/games/${slug}`,
    author: {
      '@type': 'Person' as const,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    isAccessibleForFree: true,
    gamePlatform: 'Web browser',
  };
}

export default async function GameSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const game = getGameById(slug);
  if (!game) notFound();
  const schema = gameStructuredData(slug, game.name, game.description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
