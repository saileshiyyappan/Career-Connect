import { ParsedJobData } from './parser';
import { ExternalJobDocument } from '../types/job';
import {
  generateJobContentHash,
  generateJobIdentityKey,
} from '../utils/hash';
import {
  normalizeEmploymentType,
  normalizeExperienceLevel,
  normalizeIsoDate,
  normalizeOptionalIsoDate,
  normalizeSalary,
  extractSkillList,
} from '../utils/normalize';

export interface JobNormalizationContext {
  sourceId: string;
  sourceName: string;
  defaultSourceUrl?: string;
}

export class JobNormalizer {
  /**
   * Transforms parsed job data into a normalized, type-safe ExternalJobDocument.
   * Calculates deterministic identity and content hash for deduplication.
   */
  static normalize(parsed: ParsedJobData, context: JobNormalizationContext): ExternalJobDocument {
    const now = new Date().toISOString();
    const publishedAt = normalizeIsoDate(parsed.publishedAt);
    const expiresAt = normalizeOptionalIsoDate(parsed.expiresAt);

    // Compute deterministic content hash for duplicate identification
    const contentHash = generateJobContentHash({
      title: parsed.title,
      companyName: parsed.companyName,
      location: parsed.location,
      sourceId: context.sourceId,
    });

    // Compute deterministic document ID based on sourceId + externalId
    const deterministicId = generateJobIdentityKey(context.sourceId, parsed.externalId);

    const skills = extractSkillList(parsed.rawSkills);
    const qualifications = extractSkillList(parsed.rawQualifications);
    const responsibilities = extractSkillList(parsed.rawResponsibilities);
    const technologyStack = extractSkillList(parsed.rawTechStack);

    // If tech stack is empty, infer from skills
    const finalTechStack = technologyStack.length ? technologyStack : skills.slice(0, 10);

    const salary = normalizeSalary(parsed.rawSalary);

    const normalized: ExternalJobDocument = {
      id: deterministicId,
      externalId: parsed.externalId,
      sourceId: context.sourceId,
      sourceName: context.sourceName,
      sourceUrl: parsed.sourceUrl || context.defaultSourceUrl || '',
      title: parsed.title,
      companyName: parsed.companyName,
      companyLogo: parsed.companyLogo,
      location: parsed.location,
      employmentType: normalizeEmploymentType(parsed.rawEmploymentType),
      experienceLevel: normalizeExperienceLevel(parsed.rawExperienceLevel),
      salary,
      description: parsed.description,
      responsibilities,
      qualifications,
      skills,
      technologyStack: finalTechStack,
      remote: Boolean(parsed.isRemote),
      jobOrigin: 'external',
      publishedAt,
      fetchedAt: now,
      expiresAt,
      status: 'active',
      contentHash,
      createdAt: now,
      updatedAt: now,
    };

    // Firestore rejects explicit undefined values. Keep optional fields absent
    // when the provider did not supply them.
    if (normalized.companyLogo === undefined) delete normalized.companyLogo;
    if (normalized.expiresAt === undefined) delete normalized.expiresAt;

    return normalized;
  }
}
