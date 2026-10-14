import React from 'react';
import { 
  Briefcase, 
  Sparkles, 
  GraduationCap, 
  Rocket, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Globe, 
  Cpu, 
  Compass, 
  MapPin, 
  UserPlus, 
  Layers
} from 'lucide-react';

export interface NewsCategoryConfig {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  badgeVariant: 'default' | 'accent' | 'success' | 'warning' | 'info' | 'purple';
  color: string;
}

export const NEWS_CATEGORIES: NewsCategoryConfig[] = [
  {
    id: 'all',
    label: 'All News',
    shortLabel: 'All',
    description: 'All verified career and recruitment news across industries',
    icon: Layers,
    badgeVariant: 'default',
    color: '#3B82F6',
  },
  {
    id: 'hiring',
    label: 'Hiring & Recruitment',
    shortLabel: 'Hiring',
    description: 'Corporate hiring surges, talent drives, and recruitment initiatives',
    icon: UserPlus,
    badgeVariant: 'accent',
    color: '#2563EB',
  },
  {
    id: 'placements',
    label: 'Campus Placements',
    shortLabel: 'Placements',
    description: 'University and college placement reports, top recruiters, and campus offers',
    icon: GraduationCap,
    badgeVariant: 'purple',
    color: '#8B5CF6',
  },
  {
    id: 'internships',
    label: 'Internships',
    shortLabel: 'Internships',
    description: 'Summer and winter internship programs, stipends, and early career roles',
    icon: Rocket,
    badgeVariant: 'info',
    color: '#06B6D4',
  },
  {
    id: 'freshers',
    label: 'Freshers & Graduates',
    shortLabel: 'Freshers',
    description: 'Entry-level opportunities, training programs, and graduate hiring drives',
    icon: GraduationCap,
    badgeVariant: 'success',
    color: '#10B981',
  },
  {
    id: 'ai_careers',
    label: 'AI & Tech Careers',
    shortLabel: 'AI & Tech',
    description: 'Artificial intelligence hiring, machine learning talent demand, and tech shifts',
    icon: Sparkles,
    badgeVariant: 'accent',
    color: '#6366F1',
  },
  {
    id: 'technology_careers',
    label: 'Tech Careers',
    shortLabel: 'Tech',
    description: 'Software engineering, cloud infrastructure, cybersecurity, and DevOps trends',
    icon: Cpu,
    badgeVariant: 'info',
    color: '#0284C7',
  },
  {
    id: 'job_market',
    label: 'Job Market Trends',
    shortLabel: 'Job Market',
    description: 'Employment statistics, industry growth sectors, and workforce outlook',
    icon: TrendingUp,
    badgeVariant: 'warning',
    color: '#F59E0B',
  },
  {
    id: 'salary',
    label: 'Salary & Compensation',
    shortLabel: 'Salary',
    description: 'Compensation benchmarks, tech pay scales, appraisal trends, and perks',
    icon: DollarSign,
    badgeVariant: 'success',
    color: '#059669',
  },
  {
    id: 'companies',
    label: 'Company Insights',
    shortLabel: 'Companies',
    description: 'Corporate workplace culture, workplace policies, expansion, and leader moves',
    icon: Building2,
    badgeVariant: 'default',
    color: '#64748B',
  },
  {
    id: 'startups',
    label: 'Startup Ecosystem',
    shortLabel: 'Startups',
    description: 'Venture funding, unicorn hiring, early-stage talent acquisition, and founders',
    icon: Rocket,
    badgeVariant: 'accent',
    color: '#EC4899',
  },
  {
    id: 'career_advice',
    label: 'Career Guidance',
    shortLabel: 'Advice',
    description: 'Interview strategies, resume tips, career switching guides, and skill development',
    icon: Compass,
    badgeVariant: 'info',
    color: '#0D9488',
  },
  {
    id: 'india',
    label: 'India Market',
    shortLabel: 'India',
    description: 'National recruitment reports, tech hubs (Bengaluru, Hyderabad, Pune, NCR)',
    icon: MapPin,
    badgeVariant: 'warning',
    color: '#D97706',
  },
  {
    id: 'global',
    label: 'Global Employment',
    shortLabel: 'Global',
    description: 'International remote work, overseas visa developments, and global hiring trends',
    icon: Globe,
    badgeVariant: 'default',
    color: '#475569',
  },
];

export const getCategoryConfig = (categoryId?: string): NewsCategoryConfig => {
  if (!categoryId) return NEWS_CATEGORIES[0];
  const normalized = categoryId.toLowerCase().trim().replace(/[-\s]/g, '_');
  const found = NEWS_CATEGORIES.find(c => c.id === normalized || c.id === categoryId);
  if (found) return found;

  // Fallback config for any custom/dynamic category from sources
  const formattedLabel = categoryId
    .split(/[_\-\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    id: categoryId,
    label: formattedLabel,
    shortLabel: formattedLabel,
    description: `News and insights regarding ${formattedLabel}`,
    icon: Briefcase,
    badgeVariant: 'default',
    color: '#64748B',
  };
};
