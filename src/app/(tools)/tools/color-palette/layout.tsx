import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('color-palette')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function ColorPaletteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
