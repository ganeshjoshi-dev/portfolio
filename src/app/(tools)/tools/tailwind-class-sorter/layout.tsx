import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('tailwind-class-sorter')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function TailwindClassSorterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
