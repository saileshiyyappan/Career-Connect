import { CareerNewsItem } from '../types/news';

const positiveRules: Array<[RegExp, number]> = [
  [/\b(job|jobs|hiring|hire|recruit|recruitment|layoff|layoffs|internship|internships|career|careers|workforce|employment|vacanc|skills demand|talent)\b/i, 3],
  [/\b(employer|company|companies|workplace|return to office|remote work|hybrid work|headcount|staffing|organization|corporate strategy)\b/i, 2],
  [/\b(startup|startups|founder|funding|venture capital|seed round|series [a-z]|unicorn|entrepreneur|incubator)\b/i, 3],
  [/\b(software engineering|software engineer|developer|engineering|engineer|artificial intelligence|machine learning|cloud computing|cybersecurity|cyber security|programming|data science|saas|product engineering|semiconductor|chip|electronics|embedded systems|hardware|iot|developer tools)\b/i, 3],
  [/\b(digital marketing|marketing strategy|advertising technology|ad tech|growth marketing|brand strategy|martech|sales career|business development)\b/i, 3],
  [/\b(interview|resume|cv|portfolio|upskill|upskilling|professional skills|promotion|salary|compensation|stipend|workplace skills|career development)\b/i, 3],
  [/\b(earnings|industry outlook|business outlook|market expansion|investment|revenue|ipo|acquisition|merger|economic indicator|stock market|trading)\b/i, 2],
];

const negativeRules = [
  /\b(celebrity|celebrities|movie review|box office|television|reality show|music release|concert|gossip|actor|actress|singer)\b/i,
  /\b(cricket|football|soccer|nba|nfl|olympics|match result|tournament|athlete|gaming|video game|esports|playstation|xbox|nintendo|gta 6)\b/i,
  /\b(murder|arrested|robbery|crime|terror attack|shooting|police investigation)\b/i,
  /\b(election campaign|political rally|politician|parliament debate|party leader|geopolitical|geopolitics|war|military strike|diplomatic crisis|president)\b/i,
];

export function isCareerRelevantNews(item: Pick<CareerNewsItem, 'title' | 'summary' | 'sourceName' | 'tags' | 'category' | 'isRelevant' | 'relevanceScore'>): boolean {
  const text = `${item.title} ${item.summary} ${item.sourceName} ${item.category || ''} ${(item.tags || []).join(' ')}`;
  const score = positiveRules.reduce((sum, [rule, weight]) => sum + (rule.test(text) ? weight : 0), 0);
  return score >= 3 && !negativeRules.some((rule) => rule.test(text));
}
