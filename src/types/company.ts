export type CompanyOrigin =
  | 'CareerConnect Verified Employer'
  | 'External Organization'
  | 'Hiring Organization'
  | 'Partner Provider'
  | 'internal'
  | 'external';

export type Company = CompanyItem;

export interface CompanyItem {
  id: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline: string;
  description: string;
  industry: string;
  companySize: string;
  headquarters: string;
  country?: string;
  city?: string;
  website: string;
  websiteUrl?: string;
  openJobsCount: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  benefits?: string[];
  verified?: boolean;
  companyOrigin?: CompanyOrigin;
  customAccentColor?: string;
  brandAssets?: Array<{ id: string; name: string; url: string; type: string; size?: string; category?: string; uploadedAt: string }>;
  galleryPhotos?: string[];
  mission?: string;
  vision?: string;
  culture?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  externalId?: string;
}
