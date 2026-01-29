import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('favicon-generator')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function FaviconGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
