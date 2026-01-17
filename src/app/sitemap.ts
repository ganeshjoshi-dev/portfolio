import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils/seo";
import { projects } from "@/lib/data/projects";
import { tools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Main routes with SEO priorities
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Tools hub page - high priority for tool discovery
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ];

  // Project routes
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Individual tool routes - high priority for search visibility
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}${tool.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    // New/featured tools get higher priority
    priority: tool.isNew ? 0.9 : 0.85,
  }));

  return [...mainRoutes, ...projectRoutes, ...toolRoutes];
}
