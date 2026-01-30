import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils/seo";
import { projects } from "@/lib/data/projects";
import { tools } from "@/config/tools";
import { games } from "@/config/games";

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
    // Tools hub page - high priority for tool discovery
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // Games hub page
    {
      url: `${siteConfig.url}/games`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Project routes - use actual project dates
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    // Convert "YYYY-MM" format to Date object (use first day of month)
    const projectDate = project.date.includes('-') 
      ? new Date(`${project.date}-01`)
      : new Date(project.date);
    
    return {
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: projectDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Individual tool routes - high priority for search visibility
  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}${tool.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    // New/featured tools get higher priority
    priority: tool.isNew ? 0.9 : 0.85,
  }));

  // Individual game routes
  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${siteConfig.url}${game.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: game.isNew ? 0.85 : 0.8,
  }));

  return [...mainRoutes, ...projectRoutes, ...toolRoutes, ...gameRoutes];
}
