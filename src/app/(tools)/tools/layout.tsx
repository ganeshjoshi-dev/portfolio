import { Metadata } from 'next';
import { siteConfig } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: {
    template: '%s | GJ Dev Tools',
    default: siteConfig.toolsTitle,
  },
  description: siteConfig.toolsDescription,
  keywords: siteConfig.toolsKeywords,
  alternates: {
    canonical: `${siteConfig.url}/tools`,
  },
  openGraph: {
    title: siteConfig.toolsTitle,
    description: siteConfig.toolsDescription,
    url: `${siteConfig.url}/tools`,
    siteName: 'GJ Dev Tools',
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/tools/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'GJ Dev Tools - Free Developer Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.toolsTitle,
    description: siteConfig.toolsDescription,
    images: [`${siteConfig.url}/tools/opengraph-image`],
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

// Structured data for the tools hub page
const toolsCollectionStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Developer Tools',
  description: siteConfig.toolsDescription,
  url: `${siteConfig.url}/tools`,
  isPartOf: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  about: {
    '@type': 'Thing',
    name: 'Web Development Tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#252d47]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsCollectionStructuredData) }}
      />
      {children}
    </div>
  );
}
