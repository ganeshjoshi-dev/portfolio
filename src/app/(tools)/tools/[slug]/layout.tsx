import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolById } from '@/config/tools';
import { generateToolMetadata } from '@/lib/utils/tool-seo';

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) return {};
  return generateToolMetadata(tool);
}

export default async function ToolSlugLayout({ children, params }: Props) {
  const { slug } = await params;
  const tool = getToolById(slug);
  if (!tool) notFound();
  return <>{children}</>;
}
