import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Formatter - Beautify HTML, CSS, JavaScript, JSON Online',
  description: 'Free code formatter and beautifier. Format HTML, CSS, JavaScript, and JSON with custom indentation. Prettier-powered code formatting online.',
  keywords: [
    'code formatter',
    'code beautifier',
    'format code',
    'beautify code',
    'prettier online',
    'format javascript',
    'format html',
    'format css',
    'format json',
    'code formatter online',
  ],
  openGraph: {
    title: 'Code Formatter - Beautify & Format Code Online',
    description: 'Format and beautify HTML, CSS, JavaScript, and JSON code. Customizable indentation and formatting options.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Formatter - Free Online Code Beautifier',
    description: 'Format HTML, CSS, JS, and JSON instantly. Prettier-powered formatting.',
  },
};

export default function CodeFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
