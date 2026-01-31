import { Button } from '@/components/ui';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Page Not Found | Ganesh Joshi',
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Page Not Found | Ganesh Joshi',
    description: "The page you're looking for doesn't exist or has been moved.",
    url: `${siteConfig.url}/404`,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Not Found | Ganesh Joshi',
    description: "The page you're looking for doesn't exist or has been moved.",
    images: [siteConfig.ogImage],
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0a0e27] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl sm:text-9xl font-bold text-cyan-400 mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-300 max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
          <Button href="/projects" variant="secondary" size="lg">
            View Projects
          </Button>
          <Button href="/games" variant="secondary" size="lg">
            All Games
          </Button>
          <Button href="/tools" variant="ghost" size="lg">
            Explore Tools
          </Button>
        </div>
      </div>
    </main>
  );
}
