'use client';

import { Tool, ToolCategoryConfig } from '@/types/tools';
import { getAllToolStructuredData } from '@/lib/utils/tool-seo';

interface ToolStructuredDataProps {
  tool: Tool;
  category: ToolCategoryConfig;
}

/**
 * Injects structured data (JSON-LD) for tool pages
 * Includes WebApplication, FAQ, and Breadcrumb schemas
 */
export function ToolStructuredData({ tool, category }: ToolStructuredDataProps) {
  const structuredDataItems = getAllToolStructuredData(tool, category);

  return (
    <>
      {structuredDataItems.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
