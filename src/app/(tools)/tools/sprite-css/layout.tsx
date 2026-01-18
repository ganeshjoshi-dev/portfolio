import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('sprite-css')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SpriteCSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
