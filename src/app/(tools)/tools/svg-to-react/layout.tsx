import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('svg-to-react')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function SvgToReactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
