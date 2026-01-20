import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { siteConfig, generateBreadcrumbSchema } from '@/lib/utils/seo';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  includeSchema?: boolean;
  currentPageUrl?: string; // Full URL of the current page for schema
}

export default function Breadcrumbs({ items, includeSchema = true, currentPageUrl }: BreadcrumbsProps) {
  const schemaItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    
    // Determine the URL for schema
    let itemUrl: string;
    if (item.href) {
      // Item has explicit href
      itemUrl = `${siteConfig.url}${item.href}`;
    } else if (isLast && currentPageUrl) {
      // Last item without href - use currentPageUrl if provided
      itemUrl = currentPageUrl;
    } else {
      // Fallback to base URL (should rarely happen)
      itemUrl = `${siteConfig.url}`;
    }
    
    return {
      name: item.label,
      item: itemUrl,
    };
  });

  const schemaData = generateBreadcrumbSchema(schemaItems);

  return (
    <>
      {includeSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap pb-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <span key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
                >
                  {isFirst ? (
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              ) : (
                <span className="text-cyan-400 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
