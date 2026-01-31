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

  const ogImageUrl = `${siteConfig.url}${game.path}/opengraph-image`;

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
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${game.name} - Free Online Game` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
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
