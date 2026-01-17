import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('json-to-typescript')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function JsonToTypeScriptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
