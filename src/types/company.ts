export type Company = CompanyItem;
export interface CompanyItem {
  id: string;
  name: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline: string;
  description: string;
  industry: string;
  companySize: string;
  headquarters: string;
  website: string;
  openJobsCount: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  benefits?: string[];
  verified?: boolean;
}
