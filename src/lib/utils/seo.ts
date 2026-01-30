import type { Metadata } from 'next';
import type {
  PageMetadataOptions,
  BreadcrumbSchemaItem,
  PersonSchemaOptions,
  WebSiteSchemaOptions,
  ProjectSchemaOptions,
} from '@/types/seo';

export const siteConfig = {
  name: "Ganesh Joshi",
  title: "Ganesh Joshi – Full Stack Developer & Creative Problem Solver",
  description:
    "Full Stack Developer specializing in eCommerce, modern web tech, and user-centric design. Adobe Certified Expert building fast, scalable web experiences.",
  url: "https://ganeshjoshi.dev",
  /** Default OG image: dynamic image from app/opengraph-image.tsx (served at /opengraph-image) */
  ogImage: "/opengraph-image",
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Adobe Commerce",
    "eCommerce",
    "Frontend Developer",
    "Web Performance",
    // Developer Tools Keywords
    "free developer tools",
    "online dev tools",
    "CSS generator",
    "gradient generator",
    "JSON to TypeScript",
    "Tailwind CSS tools",
    "web development tools",
    "code converter online",
  ],
  // Tools-specific SEO
  toolsTitle: "Free Developer Tools | GJ Dev Tools",
  toolsDescription:
    "Free online developer tools for CSS, converters, and utilities. Gradient generator, JSON to TypeScript, regex tester, and more. Beautiful UI, no ads.",
  toolsKeywords: [
    "developer tools",
    "free online tools",
    "CSS generator",
    "gradient maker",
    "JSON to TypeScript converter",
    "regex tester online",
    "Tailwind tools",
    "code converter",
    "UUID generator",
    "Base64 encoder",
    "color palette generator",
    "shadow generator",
  ],
  // Games-specific SEO
  gamesTitle: "Free Browser Games | Ganesh Joshi",
  gamesDescription:
    "Free online browser games. Play memory, puzzle, and arcade games — no sign-up, no ads. Built as portfolio projects.",
  gamesKeywords: [
    "free browser games",
    "online games",
    "memory game",
    "card matching game",
    "browser games",
    "puzzle games",
  ],
};

/**
 * Generate metadata for a page
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, path, ogImage, keywords } = options;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: keywords || siteConfig.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: image }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Generate Person structured data schema
 */
export function generatePersonSchema(options?: Partial<PersonSchemaOptions>) {
  const defaults: PersonSchemaOptions = {
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: 'Full Stack Developer',
    worksFor: { name: 'Kitchen365', type: 'Organization' },
    address: { locality: 'Ahmedabad', country: 'India' },
    knowsAbout: ['Next.js', 'React', 'TypeScript', 'eCommerce', 'Adobe Commerce'],
    sameAs: ['https://www.linkedin.com/in/joshiganesh', 'https://github.com/GJ-MCA'],
  };

  const merged = { ...defaults, ...options };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: merged.name,
    url: merged.url,
    jobTitle: merged.jobTitle,
    ...(merged.worksFor && {
      worksFor: {
        '@type': merged.worksFor.type || 'Organization',
        name: merged.worksFor.name,
      },
    }),
    ...(merged.address && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: merged.address.locality,
        addressCountry: merged.address.country,
      },
    }),
    ...(merged.knowsAbout && { knowsAbout: merged.knowsAbout }),
    ...(merged.sameAs && { sameAs: merged.sameAs }),
  };
}

/**
 * Generate WebSite structured data schema with optional SearchAction
 */
export function generateWebSiteSchema(options?: Partial<WebSiteSchemaOptions>) {
  const defaults: WebSiteSchemaOptions = {
    name: 'Ganesh Joshi Portfolio',
    url: siteConfig.url,
    searchAction: {
      target: `${siteConfig.url}/tools?q={search_term_string}`,
      queryInput: 'required name=search_term_string',
    },
  };

  const merged = { ...defaults, ...options };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: merged.name,
    url: merged.url,
    ...(merged.searchAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: merged.searchAction.target,
        'query-input': merged.searchAction.queryInput,
      },
    }),
  };
}

/**
 * Generate BreadcrumbList structured data schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

/**
 * Generate CreativeWork/SoftwareSourceCode schema for projects
 */
export function generateProjectSchema(options: ProjectSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: options.name,
    description: options.description,
    url: options.url,
    ...(options.image && { image: options.image }),
    author: {
      '@type': 'Person',
      name: options.author,
    },
    datePublished: options.datePublished,
    ...(options.technologies && {
      programmingLanguage: options.technologies,
    }),
  };
}
