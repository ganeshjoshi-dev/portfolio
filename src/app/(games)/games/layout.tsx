import { Metadata } from 'next';
import { siteConfig } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: {
    template: '%s | Games',
    default: siteConfig.gamesTitle,
  },
  description: siteConfig.gamesDescription,
  keywords: siteConfig.gamesKeywords,
  alternates: {
    canonical: `${siteConfig.url}/games`,
  },
  openGraph: {
    title: siteConfig.gamesTitle,
    description: siteConfig.gamesDescription,
    url: `${siteConfig.url}/games`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.gamesTitle,
    description: siteConfig.gamesDescription,
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

const gamesCollectionStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Browser Games',
  description: siteConfig.gamesDescription,
  url: `${siteConfig.url}/games`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: {
    '@type': 'Thing',
    name: 'Browser Games',
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#252d47]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gamesCollectionStructuredData) }}
      />
      {children}
    </div>
  );
}
