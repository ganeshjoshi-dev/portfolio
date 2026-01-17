import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('slug-generator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SlugGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
