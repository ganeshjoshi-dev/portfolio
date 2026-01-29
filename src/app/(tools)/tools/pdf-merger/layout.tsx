import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('pdf-merger')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function PdfMergerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
