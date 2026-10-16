import { RawExternalJobInput } from '../types/job';
import { sanitizeText } from '../utils/normalize';

export interface ParsedJobData {
  externalId: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  description: string;
  sourceUrl: string;
  rawEmploymentType?: string;
  rawExperienceLevel?: string;
  rawSalary?: unknown;
  rawSkills?: string[] | string;
  rawResponsibilities?: string[] | string;
  rawQualifications?: string[] | string;
  rawTechStack?: string[] | string;
  isRemote?: boolean;
  publishedAt?: string | number;
  expiresAt?: string | number;
}

export class JobParser {
  /**
   * Safely extracts and validates essential job fields from arbitrary provider formats
   * including Himalayas Remote Jobs API, Jobicy Remote Jobs API, RSS, and generic feeds.
   */
  static parse(raw: RawExternalJobInput, defaultSourceUrl?: string): ParsedJobData | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    // 1. Extract Title
    const title = sanitizeText(raw.title || raw.jobTitle || raw.job_title);
    if (!title || title.length < 2) {
      return null; // Missing required title
    }

    // 2. Extract External ID
    let externalId = '';
    if (raw.guid) {
      externalId = String(raw.guid).trim();
    } else if (raw.externalId !== undefined && raw.externalId !== null) {
      externalId = String(raw.externalId).trim();
    } else if (raw.id !== undefined && raw.id !== null) {
      externalId = String(raw.id).trim();
    } else if (raw.jobSlug) {
      externalId = String(raw.jobSlug).trim();
    }

    // 3. Extract Company Name & Logo
    let companyName = '';
    let companyLogo: string | undefined;

    if (raw.companyName) {
      companyName = sanitizeText(raw.companyName);
    } else if (raw.company_name) {
      companyName = sanitizeText(raw.company_name);
    } else if (typeof raw.company === 'string') {
      companyName = sanitizeText(raw.company);
    } else if (raw.company && typeof raw.company === 'object') {
      companyName = sanitizeText(raw.company.name || raw.company.display_name);
      companyLogo = raw.company.logo;
    }

    // Do not publish a fabricated employer name. Providers must supply a
    // company value for an external listing to be shown.
    if (!companyName) return null;

    if (!companyLogo && (raw.companyLogo || raw.company_logo)) {
      companyLogo = String(raw.companyLogo || raw.company_logo).trim();
    }

    // 4. Extract Source URL (Mandatory Provenance for users to view original listing)
    const sourceUrl =
      raw.applicationLink ||
      raw.guid ||
      raw.url ||
      raw.link ||
      raw.redirect_url ||
      raw.source_url ||
      defaultSourceUrl ||
      '';

    if (!sourceUrl || !sourceUrl.startsWith('http')) {
      return null; // Provenance URL is required
    }

    // If externalId wasn't found elsewhere, derive from sourceUrl
    if (!externalId) {
      externalId = sourceUrl;
    }

    // 5. Extract Location
    let location = '';
    if (Array.isArray(raw.locationRestrictions) && raw.locationRestrictions.length > 0) {
      location = `${raw.locationRestrictions.join(', ')} (Remote)`;
    } else if (raw.jobGeo) {
      location = `${sanitizeText(raw.jobGeo)} (Remote)`;
    } else if (typeof raw.location === 'string' && raw.location.trim()) {
      location = sanitizeText(raw.location);
    } else if (raw.location && typeof raw.location === 'object') {
      location = sanitizeText(
        raw.location.display_name ||
          (Array.isArray(raw.location.area) ? raw.location.area.join(', ') : raw.location.city || raw.location.country)
      );
    }

    if (!location) location = 'Not specified';

    // 6. Extract Description / Excerpt
    const description = sanitizeText(
      raw.description || raw.jobDescription || raw.body || raw.content || raw.excerpt || raw.jobExcerpt || ''
    );

    // 7. Extract Remote Flag
    let isRemote = false;
    if (typeof raw.remote === 'boolean') isRemote = raw.remote;
    else if (typeof raw.is_remote === 'boolean') isRemote = raw.is_remote;
    else if (typeof raw.remote === 'string') isRemote = raw.remote.toLowerCase() === 'true' || raw.remote.toLowerCase() === 'remote';
    else if (typeof raw.is_remote === 'string') isRemote = raw.is_remote.toLowerCase() === 'true' || raw.is_remote.toLowerCase() === 'remote';
    else isRemote = location.toLowerCase().includes('remote');

    // 8. Extract Employment Type
    let rawEmploymentType: string | undefined;
    if (raw.employmentType) {
      rawEmploymentType = raw.employmentType;
    } else if (raw.employment_type) {
      rawEmploymentType = raw.employment_type;
    } else if (Array.isArray(raw.jobType) && raw.jobType.length > 0) {
      rawEmploymentType = raw.jobType.join(', ');
    } else if (typeof raw.jobType === 'string') {
      rawEmploymentType = raw.jobType;
    } else if (raw.job_type) {
      rawEmploymentType = typeof raw.job_type === 'string' ? raw.job_type : (raw.job_type as string[]).join(', ');
    }

    // 9. Extract Experience Level / Seniority
    let rawExperienceLevel: string | undefined;
    if (Array.isArray(raw.seniority) && raw.seniority.length > 0) {
      rawExperienceLevel = raw.seniority.join(', ');
    } else if (typeof raw.seniority === 'string') {
      rawExperienceLevel = raw.seniority;
    } else if (raw.jobLevel) {
      rawExperienceLevel = raw.jobLevel;
    } else if (raw.experienceLevel || raw.experience_level) {
      rawExperienceLevel = raw.experienceLevel || raw.experience_level;
    }

    // 10. Extract Salary structure
    let rawSalary: unknown = undefined;
    if (raw.minSalary !== undefined || raw.maxSalary !== undefined) {
      rawSalary = {
        min: typeof raw.minSalary === 'string' ? parseFloat(raw.minSalary) : raw.minSalary,
        max: typeof raw.maxSalary === 'string' ? parseFloat(raw.maxSalary) : raw.maxSalary,
        currency: raw.currency || 'USD',
        period: (raw.salaryPeriod as 'hourly' | 'monthly' | 'yearly') || 'yearly',
      };
    } else if (raw.annualSalaryMin !== undefined || raw.annualSalaryMax !== undefined) {
      rawSalary = {
        min: typeof raw.annualSalaryMin === 'string' ? parseFloat(raw.annualSalaryMin) : raw.annualSalaryMin,
        max: typeof raw.annualSalaryMax === 'string' ? parseFloat(raw.annualSalaryMax) : raw.annualSalaryMax,
        currency: raw.salaryCurrency || 'USD',
        period: 'yearly',
      };
    } else if (raw.salary) {
      rawSalary = raw.salary;
    } else if (raw.salary_min !== undefined || raw.salary_max !== undefined) {
      rawSalary = {
        min: typeof raw.salary_min === 'string' ? parseFloat(raw.salary_min) : raw.salary_min,
        max: typeof raw.salary_max === 'string' ? parseFloat(raw.salary_max) : raw.salary_max,
        currency: raw.salary_currency || 'USD',
        period: (raw.salary_period as 'hourly' | 'monthly' | 'yearly') || 'yearly',
      };
    }

    // 11. Extract Skills, Categories, and Industry
    const combinedSkills: string[] = [];
    if (Array.isArray(raw.categories)) combinedSkills.push(...raw.categories);
    if (Array.isArray(raw.parentCategories)) combinedSkills.push(...raw.parentCategories);
    if (Array.isArray(raw.jobIndustry)) combinedSkills.push(...raw.jobIndustry);
    else if (typeof raw.jobIndustry === 'string') combinedSkills.push(raw.jobIndustry);
    if (Array.isArray(raw.skills)) combinedSkills.push(...raw.skills);
    else if (typeof raw.skills === 'string') combinedSkills.push(raw.skills);
    if (Array.isArray(raw.tags)) combinedSkills.push(...raw.tags);

    // 12. Extract Timestamps
    const publishedAt = raw.pubDate || raw.published_at || raw.created_at || raw.date_posted;
    const expiresAt = raw.expiryDate || raw.expiry_date || raw.expires_at;

    return {
      externalId,
      title,
      companyName,
      companyLogo,
      location,
      description,
      sourceUrl,
      rawEmploymentType,
      rawExperienceLevel,
      rawSalary,
      rawSkills: combinedSkills.length ? combinedSkills : raw.skills,
      rawResponsibilities: raw.responsibilities,
      rawQualifications: raw.qualifications || raw.requirements,
      rawTechStack: raw.technology_stack || raw.technologyStack || combinedSkills,
      isRemote,
      publishedAt,
      expiresAt,
    };
  }
}
