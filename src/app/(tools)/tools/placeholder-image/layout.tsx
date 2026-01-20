import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placeholder Image Generator - Custom Dummy Images Online',
  description: 'Free placeholder image generator. Create custom dummy images with adjustable dimensions, colors, and text. Perfect for mockups, prototypes, and development.',
  keywords: [
    'placeholder image',
    'dummy image',
    'placeholder generator',
    'image placeholder',
    'mockup image',
    'test image',
    'placeholder.com',
    'via.placeholder',
    'dummy image generator',
  ],
  openGraph: {
    title: 'Placeholder Image Generator - Custom Dummy Images',
    description: 'Generate custom placeholder images with adjustable size, colors, and text. Download or copy URL for instant use.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Placeholder Image Generator - Free Dummy Images',
    description: 'Create custom placeholder images for mockups and prototypes. Adjustable size, colors, and text.',
  },
};

export default function PlaceholderImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
