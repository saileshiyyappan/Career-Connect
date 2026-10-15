export const JOB_CATEGORIES = [
  'Engineering',
  'Data & AI',
  'Design',
  'DevOps & Cloud',
  'Product',
  'Marketing',
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number] | 'Other';

/** Maps source-specific labels and descriptive text to the categories used by the UI. */
export const normalizeJobCategory = (value?: string | null): JobCategory => {
  const text = (value || '').trim().toLowerCase();
  if (!text) return 'Other';

  if (/(data|analytics|machine learning|\bai\b|artificial intelligence|statistics|data science)/i.test(text)) return 'Data & AI';
  if (/(design|ux|ui|graphic|creative)/i.test(text)) return 'Design';
  if (/(devops|cloud|infrastructure|platform|sre|site reliability|network|security)/i.test(text)) return 'DevOps & Cloud';
  if (/(product|project|program management|\bpm\b)/i.test(text)) return 'Product';
  if (/(marketing|sales|growth|business development|customer success)/i.test(text)) return 'Marketing';
  if (/(engineering|software|development|programming|backend|frontend|full.?stack|web|mobile|qa|quality assurance|testing)/i.test(text)) return 'Engineering';
  return 'Other';
};
