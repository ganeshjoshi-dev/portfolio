import { Metadata } from 'next';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

const tool = getToolById('base64')!;

export const metadata: Metadata = generateToolMetadata(tool);

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
