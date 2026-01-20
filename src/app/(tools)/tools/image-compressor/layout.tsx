import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - Compress JPEG, PNG, WebP, AVIF Online Free',
  description: 'Free online image compressor. Reduce image file sizes by up to 80% with smart compression. Convert between JPEG, PNG, WebP, and AVIF formats. Batch processing supported.',
  keywords: [
    'image compressor',
    'compress image online',
    'reduce image size',
    'jpeg compressor',
    'png optimizer',
    'webp converter',
    'avif',
    'batch image compression',
    'free image optimizer',
    'image optimization tool',
    'reduce file size',
    'compress photos',
    'image converter',
    'optimize images',
    'compress pictures',
  ],
  openGraph: {
    title: 'Image Compressor - Compress Images Up to 80% Smaller',
    description: 'Free online tool to compress JPEG, PNG, WebP, and AVIF images. Smart optimization reduces file sizes while maintaining quality. Batch processing available.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Compressor - Reduce Image Sizes Up to 80%',
    description: 'Compress JPEG, PNG, WebP, AVIF images online for free. Smart optimization, batch processing, format conversion.',
  },
};

export default function ImageCompressorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
