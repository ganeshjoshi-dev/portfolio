import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 Online',
  description: 'Free hash generator for text and files. Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Secure cryptographic hash functions for checksums and integrity verification.',
  keywords: [
    'hash generator',
    'md5 generator',
    'sha256 generator',
    'sha512',
    'sha1',
    'checksum',
    'hash calculator',
    'crypto hash',
    'text to hash',
    'file hash',
    'hash tool',
  ],
  openGraph: {
    title: 'Hash Generator - MD5, SHA-256, SHA-512 Hashing Tool',
    description: 'Generate cryptographic hashes for text and files. Supports MD5, SHA-1, SHA-256, and SHA-512 algorithms.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hash Generator - Generate MD5, SHA Hashes',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for text and files instantly.',
  },
};

export default function HashGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
