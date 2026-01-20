import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Counter - Character Count, Reading Time Calculator',
  description: 'Free word counter and character counter. Count words, characters, sentences, paragraphs, and estimate reading time. Perfect for writers, students, and content creators.',
  keywords: [
    'word counter',
    'character counter',
    'word count',
    'character count',
    'reading time',
    'sentence counter',
    'paragraph counter',
    'text analysis',
    'word count tool',
    'character count online',
    'text counter',
  ],
  openGraph: {
    title: 'Word Counter - Count Words, Characters & Reading Time',
    description: 'Real-time word and character counter with reading time estimation. Perfect for essays, articles, and social media posts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word Counter - Free Text Analysis Tool',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading time instantly.',
  },
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
