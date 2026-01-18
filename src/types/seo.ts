export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
}

export interface BreadcrumbSchemaItem {
  name: string;
  item: string;
}

export interface PersonSchemaOptions {
  name: string;
  url: string;
  jobTitle: string;
  worksFor?: {
    name: string;
    type?: string;
  };
  address?: {
    locality: string;
    country: string;
  };
  knowsAbout?: string[];
  sameAs?: string[];
}

export interface WebSiteSchemaOptions {
  name: string;
  url: string;
  searchAction?: {
    target: string;
    queryInput: string;
  };
}

export interface ProjectSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  author: string;
  datePublished: string;
  technologies?: string[];
}
