import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes Online Free',
  description: 'Free QR code generator. Create custom QR codes with logo, colors, and multiple formats. Download as PNG or SVG. Perfect for URLs, text, WiFi, and vCards.',
  keywords: [
    'qr code generator',
    'create qr code',
    'qr code maker',
    'free qr code',
    'custom qr code',
    'qr generator online',
    'qr code with logo',
    'download qr code',
    'qr code png',
    'qr code svg',
    'url to qr code',
    'wifi qr code',
    'vcard qr code',
  ],
  openGraph: {
    title: 'QR Code Generator - Create Custom QR Codes Free',
    description: 'Generate QR codes for URLs, text, WiFi, and more. Customize colors, add logos, download as PNG or SVG. Free online QR code generator.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator - Free Custom QR Codes',
    description: 'Create QR codes with custom colors and logos. Download as PNG or SVG. Fast, free, and easy to use.',
  },
};

export default function QRCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
