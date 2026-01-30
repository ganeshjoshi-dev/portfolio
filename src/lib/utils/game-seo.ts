import type { Metadata } from 'next';
import { Game } from '@/types/games';
import { siteConfig } from './seo';

/**
 * Generate metadata for a game page
 */
export function generateGameMetadata(game: Game): Metadata {
  const title = `${game.name} - Free Online Game`;
  const description = game.description;
  const keywords = [
    ...(game.keywords || []),
    'free online game',
    'browser game',
    'play online',
  ];
  const canonicalUrl = `${siteConfig.url}${game.path}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
