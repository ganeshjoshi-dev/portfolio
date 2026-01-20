import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Minifier - Minify HTML, CSS, JavaScript Online Free',
  description: 'Free code minifier for HTML, CSS, and JavaScript. Reduce file sizes, remove comments and whitespace. Fast, secure, and easy to use.',
  keywords: [
    'code minifier',
    'html minifier',
    'css minifier',
    'javascript minifier',
    'js minifier',
    'minify code',
    'compress code',
    'reduce file size',
    'optimize code',
    'minify online',
  ],
  openGraph: {
    title: 'Code Minifier - Minify HTML, CSS, JS Online',
    description: 'Minify HTML, CSS, and JavaScript code to reduce file sizes. Remove whitespace, comments, and optimize for production.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Code Minifier - HTML, CSS, JavaScript',
    description: 'Minify your code instantly. Reduce file sizes by removing whitespace and comments.',
  },
};

export default function CodeMinifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
