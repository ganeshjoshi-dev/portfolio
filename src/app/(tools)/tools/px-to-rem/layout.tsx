import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('px-to-rem')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function PxToRemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
