/**
 * Strips HTML tags, script tags, entities, and excessive whitespace from a string.
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#x27;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips tracking parameters from canonical article URLs while preserving required destination identifiers.
 */
export function cleanCanonicalUrl(rawUrl: string | undefined | null): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    const trackingParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'gclid',
      'mc_cid',
      'mc_eid',
      '_ga',
    ];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }
    return parsed.toString();
  } catch {
    return trimmed;
  }
}

/**
 * Categorizes an article into standard CareerConnect categories based on vocabulary match.
 */
export function classifyNewsTaxonomy(
  title: string,
  summary: string,
  rawCategories: string[] = [],
  defaultCategory?: string
): { primaryCategory: string; tags: string[] } {
  const text = `${title} ${summary} ${rawCategories.join(' ')}`.toLowerCase();
  const tags: Set<string> = new Set();

  if (/\b(ai|artificial intelligence|machine learning|ml|llm|deep learning|generative ai|chatgpt|openai|data science|gpu|nvidia|claude|gemini)\b/i.test(text)) {
    tags.add('ai_careers');
  }
  if (/\b(software|developer|engineer|coding|frontend|backend|fullstack|devops|cloud|react|typescript|python|golang|tech|programming|api)\b/i.test(text)) {
    tags.add('technology_careers');
  }
  if (/\b(placement|campus|college|university|exam|results|admissions|admit card|neet|jee|ugc|iit|iim|entrance|allotment)\b/i.test(text)) {
    tags.add('placements');
    tags.add('freshers');
  }
  if (/\b(intern|internship|trainee|apprentice|freshers|graduate|entry level|apprenticeship)\b/i.test(text)) {
    tags.add('internships');
    tags.add('freshers');
  }
  if (/\b(salary|compensation|pay|raise|bonus|ctc|remuneration|wage|stipend|equity|perks)\b/i.test(text)) {
    tags.add('salary');
  }
  if (/\b(startup|unicorn|funding|venture|founder|seed round|series a|yc|angel)\b/i.test(text)) {
    tags.add('startups');
  }
  if (/\b(india|delhi|mumbai|bengaluru|bangalore|hyderabad|pune|chennai|noida|gurugram|karnataka|indian|centre|nta|kea)\b/i.test(text)) {
    tags.add('india');
  }
  if (/\b(hiring|recruit|recruitment|talent|headcount|staffing|job opening|onboarding|vacancies|vacancy|hire|hires)\b/i.test(text)) {
    tags.add('hiring');
  }
  if (/\b(job market|layoff|layoffs|workforce|employment|unemployment|labor|labour|remote work|hybrid|return to office|rto|career)\b/i.test(text)) {
    tags.add('job_market');
  }
  if (/\b(resume|interview|career guide|career advice|skills|upskilling|promotion|portfolio|productivity|tips|tutorial|guide)\b/i.test(text)) {
    tags.add('career_advice');
  }
  if (/\b(apple|google|microsoft|amazon|meta|netflix|tcs|infosys|wipro|hcl|accenture|cognizant|ibm|oracle|salesforce)\b/i.test(text)) {
    tags.add('companies');
  }

  // Determine primary category
  let primaryCategory = defaultCategory || 'job_market';
  if (tags.has('placements')) primaryCategory = 'placements';
  else if (tags.has('ai_careers')) primaryCategory = 'ai_careers';
  else if (tags.has('technology_careers')) primaryCategory = 'technology_careers';
  else if (tags.has('internships')) primaryCategory = 'internships';
  else if (tags.has('hiring')) primaryCategory = 'hiring';
  else if (tags.has('salary')) primaryCategory = 'salary';
  else if (tags.has('startups')) primaryCategory = 'startups';
  else if (tags.has('career_advice')) primaryCategory = 'career_advice';
  else if (tags.has('job_market')) primaryCategory = 'job_market';
  else if (tags.has('companies')) primaryCategory = 'companies';

  if (!tags.has('india') && !tags.has('global')) {
    tags.add('global');
  }

  return {
    primaryCategory,
    tags: Array.from(tags),
  };
}

export interface NewsRelevanceResult {
  isRelevant: boolean;
  score: number;
  matchedTopics: string[];
  rejectedTopics: string[];
}

/** Transparent career-news gate; generic words alone do not qualify. */
export function classifyNewsRelevance(
  title: string,
  summary: string,
  sourceName = '',
  categories: string[] = []
): NewsRelevanceResult {
  const text = `${title} ${summary} ${sourceName} ${categories.join(' ')}`.toLowerCase();
  const matchedTopics: string[] = [];
  const rejectedTopics: string[] = [];
  let score = 0;
  const positiveRules: Array<[string, RegExp, number]> = [
    ['jobs_and_careers', /\b(job|jobs|hiring|hire|recruit|recruitment|layoff|layoffs|internship|internships|career|careers|workforce|employment|vacanc|skills demand|talent)\b/i, 3],
    ['companies_and_workplace', /\b(employer|company|companies|workplace|workforce|return to office|remote work|hybrid work|headcount|staffing|organization|corporate strategy)\b/i, 2],
    ['startups', /\b(startup|startups|founder|funding|venture capital|seed round|series [a-z]|unicorn|entrepreneur|incubator)\b/i, 3],
    ['technology', /\b(software engineering|software engineer|developer|engineering|engineer|artificial intelligence|machine learning|cloud computing|cybersecurity|cyber security|programming|data science|saas|product engineering|semiconductor|chip|electronics|embedded systems|hardware|iot|developer tools)\b/i, 3],
    ['marketing', /\b(digital marketing|marketing strategy|advertising technology|ad tech|growth marketing|brand strategy|martech|sales career|business development)\b/i, 3],
    ['interviews_and_skills', /\b(interview|resume|cv|portfolio|upskill|upskilling|professional skills|promotion|salary|compensation|stipend|workplace skills|career development)\b/i, 3],
    ['business_markets', /\b(earnings|industry outlook|business outlook|market expansion|investment|revenue|ipo|acquisition|merger|economic indicator|stock market|trading)\b/i, 2],
  ];
  for (const [topic, rule, weight] of positiveRules) if (rule.test(text)) { matchedTopics.push(topic); score += weight; }
  const negativeRules: Array<[string, RegExp]> = [
    ['entertainment', /\b(celebrity|celebrities|movie review|box office|television|reality show|music release|concert|gossip|actor|actress|singer)\b/i],
    ['sports', /\b(cricket|football|soccer|nba|nfl|olympics|match result|tournament|athlete|gaming|video game|esports|playstation|xbox|nintendo|gta 6)\b/i],
    ['crime', /\b(murder|arrested|robbery|crime|terror attack|shooting|police investigation)\b/i],
    ['politics', /\b(election campaign|political rally|politician|parliament debate|party leader|geopolitical|geopolitics|war|military strike|diplomatic crisis|president)\b/i],
  ];
  for (const [topic, rule] of negativeRules) if (rule.test(text)) { rejectedTopics.push(topic); score -= 4; }
  return { isRelevant: score >= 3 && rejectedTopics.length === 0, score: Math.max(0, Math.min(10, score)), matchedTopics, rejectedTopics };
}

/**
 * Normalizes employment type strings from various API formats into standard enum values.
 */
export function normalizeEmploymentType(raw: string | undefined | null): 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship' | 'Hybrid' | 'Other' {
  if (!raw) return 'Full-time';
  const lower = raw.toLowerCase();

  if (lower.includes('full') || lower.includes('permanent') || lower.includes('ft')) return 'Full-time';
  if (lower.includes('part') || lower.includes('pt')) return 'Part-time';
  if (lower.includes('contract') || lower.includes('temporary') || lower.includes('freelance') || lower.includes('temp')) return 'Contract';
  if (lower.includes('intern') || lower.includes('trainee') || lower.includes('apprenticeship')) return 'Internship';
  if (lower.includes('hybrid')) return 'Hybrid';
  if (lower.includes('remote') || lower.includes('telecommute')) return 'Remote';

  return 'Other';
}

/**
 * Normalizes experience levels from diverse job feed formats.
 */
export function normalizeExperienceLevel(raw: string | undefined | null): 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive' | 'Not Specified' {
  if (!raw) return 'Not Specified';
  const lower = raw.toLowerCase();

  if (lower.includes('lead') || lower.includes('principal') || lower.includes('staff') || lower.includes('manager')) return 'Lead';
  if (lower.includes('exec') || lower.includes('vp') || lower.includes('director') || lower.includes('head') || lower.includes('chief')) return 'Executive';
  if (lower.includes('senior') || lower.includes('sr') || lower.includes('expert') || lower.includes('advanced')) return 'Senior';
  if (lower.includes('mid') || lower.includes('intermediate') || lower.includes('experienced')) return 'Mid';
  if (lower.includes('entry') || lower.includes('junior') || lower.includes('jr') || lower.includes('graduate') || lower.includes('fresher') || lower.includes('intern')) return 'Entry';

  return 'Not Specified';
}

/**
 * Parses and validates ISO 8601 date strings or epoch timestamps.
 */
export function normalizeIsoDate(input: string | number | Date | undefined | null): string {
  if (!input) return '';
  try {
    let timestamp: number | string | Date = input;
    if (typeof input === 'number') {
      // If it's epoch seconds (e.g. ~1.7e9), convert to milliseconds
      timestamp = input < 10000000000 ? input * 1000 : input;
    } else if (typeof input === 'string' && /^\d+$/.test(input.trim())) {
      const num = Number(input.trim());
      timestamp = num < 10000000000 ? num * 1000 : num;
    }
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString();
  } catch {
    return '';
  }
}

/**
 * Parses an optional ISO date, returning undefined if input is null/empty/invalid.
 */
export function normalizeOptionalIsoDate(input: string | number | Date | undefined | null): string | undefined {
  if (!input) return undefined;
  try {
    let timestamp: number | string | Date = input;
    if (typeof input === 'number') {
      timestamp = input < 10000000000 ? input * 1000 : input;
    } else if (typeof input === 'string' && /^\d+$/.test(input.trim())) {
      const num = Number(input.trim());
      timestamp = num < 10000000000 ? num * 1000 : num;
    }
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) {
      return undefined;
    }
    return d.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Extracts and normalizes an array of skills or requirements.
 */
export function extractSkillList(input: string[] | string | undefined | null): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return Array.from(
      new Set(
        input
          .map((item) => sanitizeText(item))
          .filter((item) => item.length > 1 && item.length < 60)
      )
    ).slice(0, 30);
  }

  // Comma, semicolon, bullet, or newline separated
  const parts = input
    .split(/[,;\n\r•\-\|]/)
    .map((p) => sanitizeText(p))
    .filter((p) => p.length > 1 && p.length < 60);

  return Array.from(new Set(parts)).slice(0, 30);
}

/**
 * Normalizes salary numbers and currency.
 */
export function normalizeSalary(rawSalary: unknown): {
  min?: number;
  max?: number;
  currency: string;
  period?: 'yearly' | 'monthly' | 'hourly';
  formatted?: string;
} | undefined {
  if (!rawSalary) return undefined;

  if (typeof rawSalary === 'object' && rawSalary !== null) {
    const s = rawSalary as Record<string, unknown>;
    const min = typeof s.min === 'number' ? s.min : typeof s.salary_min === 'number' ? s.salary_min : undefined;
    const max = typeof s.max === 'number' ? s.max : typeof s.salary_max === 'number' ? s.salary_max : undefined;
    const currency = typeof s.currency === 'string' ? s.currency : typeof s.salary_currency === 'string' ? s.salary_currency : 'USD';
    const period = (s.period || s.salary_period) === 'hourly' ? 'hourly' : (s.period || s.salary_period) === 'monthly' ? 'monthly' : 'yearly';

    let formatted: string | undefined;
    if (min && max) formatted = `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${period}`;
    else if (min) formatted = `${currency} ${min.toLocaleString()}+ / ${period}`;
    else if (max) formatted = `Up to ${currency} ${max.toLocaleString()} / ${period}`;

    return { min, max, currency, period, formatted };
  }

  if (typeof rawSalary === 'number') {
    return {
      min: rawSalary,
      max: rawSalary,
      currency: 'USD',
      period: 'yearly',
      formatted: `$${rawSalary.toLocaleString()} / year`,
    };
  }

  if (typeof rawSalary === 'string' && rawSalary.trim()) {
    const sanitized = sanitizeText(rawSalary);
    // Simple regex parse for numbers
    const numbers = sanitized.match(/\d[\d,.]*/g);
    if (numbers && numbers.length >= 1) {
      const parsedNums = numbers.map((n) => parseFloat(n.replace(/,/g, ''))).filter((n) => !isNaN(n));
      const min = parsedNums[0];
      const max = parsedNums.length > 1 ? parsedNums[1] : undefined;
      const currency = sanitized.includes('₹') || sanitized.includes('INR') ? 'INR' : sanitized.includes('€') ? 'EUR' : sanitized.includes('£') ? 'GBP' : 'USD';
      const period = sanitized.toLowerCase().includes('hour') ? 'hourly' : sanitized.toLowerCase().includes('month') ? 'monthly' : 'yearly';

      return { min, max, currency, period, formatted: sanitized };
    }

    return { currency: 'USD', formatted: sanitized };
  }

  return undefined;
}
