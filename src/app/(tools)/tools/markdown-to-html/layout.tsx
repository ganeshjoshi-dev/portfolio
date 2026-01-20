import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter - Convert MD to HTML Online',
  description: 'Free Markdown to HTML converter with live preview. Supports GitHub-flavored markdown, tables, code blocks, and more. Convert .md files to HTML instantly.',
  keywords: [
    'markdown to html',
    'md to html',
    'markdown converter',
    'github markdown',
    'markdown preview',
    'convert markdown',
    'markdown parser',
    'gfm to html',
    'markdown online',
  ],
  openGraph: {
    title: 'Markdown to HTML Converter - Live Preview & Export',
    description: 'Convert Markdown to HTML with live preview. Supports GitHub-flavored markdown, tables, and code syntax highlighting.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markdown to HTML - Free Converter with Preview',
    description: 'Convert Markdown to HTML instantly with live preview and syntax highlighting.',
  },
};

export default function MarkdownToHTMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
