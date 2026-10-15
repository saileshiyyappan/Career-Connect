import { collection, getDocs, query, where, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config/firestore';
import { FirestoreUserDocument } from '../firebase/types';
import { employerSavedCandidateRepository } from '../firebase/repositories/EmployerSavedCandidateRepository';
import { applicationRepository } from '../firebase/repositories/ApplicationRepository';
import { userRepository } from '../firebase/repositories/UserRepository';
import { EmployerSavedCandidate, TalentSourcePool } from '../types/campaign';

export interface CandidateSearchFilters {
  query?: string;
  skill?: string;
  location?: string;
  experienceLevel?: string;
  education?: string;
  remoteOnly?: boolean;
}

export interface CandidateProfileResult {
  id: string;
  displayName: string;
  headline: string;
  location: string;
  bio: string;
  avatarUrl?: string;
  skills: string[];
  experienceYears: number;
  education: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  resumeName?: string;
  isSaved?: boolean;
  isNameUnavailable?: boolean;
}

import { isValidCandidateName, resolveCandidateName } from '../utils/userNameUtils';
export { isValidCandidateName, resolveCandidateName };

/**
 * Explicit canonical candidate roles defined in CareerConnect data models,
 * FirestoreUserDocument schema, and Firestore security rules.
 */
export const CANONICAL_CANDIDATE_ROLES = new Set(['job_seeker', 'candidate']);

export type EligibilityReason =
  | 'canonical_role'
  | 'verified_onboarding_evidence'
  | 'excluded_current_employer'
  | 'excluded_role'
  | 'excluded_employer_attributes'
  | 'excluded_suspended'
  | 'unclassified_missing_evidence';

export interface CandidateEligibilityDecision {
  isEligible: boolean;
  reason: EligibilityReason;
}

/**
 * Evaluates whether a user document represents an eligible candidate profile.
 * - Always excludes the currently authenticated employer by UID.
 * - Always excludes admins, recruiters, employers, and suspended accounts.
 * - Accepts canonical roles ('job_seeker', 'candidate').
 * - For missing or ambiguous roles, checks for concrete onboarding/profile evidence:
 *   must have candidate indicators (e.g. resume, non-empty skills, or education)
 *   and must NOT have employer attributes.
 * - If role is missing/ambiguous and has no candidate evidence, excludes and marks as unclassified.
 */
export function evaluateCandidateEligibility(
  u: Partial<FirestoreUserDocument> & { id?: string; status?: string },
  currentEmployerId?: string
): CandidateEligibilityDecision {
  if (!u) {
    return { isEligible: false, reason: 'unclassified_missing_evidence' };
  }

  const uid = u.uid || u.id;
  if (!uid) {
    return { isEligible: false, reason: 'unclassified_missing_evidence' };
  }

  // 1. Strictly exclude current authenticated employer
  if (currentEmployerId && uid === currentEmployerId) {
    return { isEligible: false, reason: 'excluded_current_employer' };
  }

  const role = String(u.role || '').toLowerCase().trim();

  // 2. Strictly exclude explicit employer, recruiter, and admin roles
  if (role === 'employer' || role === 'recruiter' || role === 'admin' || role === 'super_admin') {
    return { isEligible: false, reason: 'excluded_role' };
  }

  // 3. Strictly exclude accounts with employer attributes
  if (u.employerPosition && u.companyName) {
    return { isEligible: false, reason: 'excluded_employer_attributes' };
  }

  // 4. Strictly exclude suspended accounts
  if (u.accountStatus === 'suspended' || u.status === 'suspended') {
    return { isEligible: false, reason: 'excluded_suspended' };
  }

  // 5. Explicit canonical candidate roles: 'job_seeker' or 'candidate'
  if (CANONICAL_CANDIDATE_ROLES.has(role)) {
    return { isEligible: true, reason: 'canonical_role' };
  }

  // 6. For missing, empty, or ambiguous roles (e.g. undefined, '', 'user', 'student'):
  // Do NOT assume job seeker. Require concrete existing onboarding / profile evidence:
  const hasResume = Boolean(u.resumeUrl?.trim() || u.resumeName?.trim());
  const hasSkills = Array.isArray(u.skills) && u.skills.length > 0;
  const hasEducation = Boolean(
    typeof u.education === 'string'
      ? u.education.trim().length > 0
      : Array.isArray(u.education) && u.education.length > 0
  );
  const hasPortfolioOrGithub = Boolean(u.portfolioUrl?.trim() || u.githubUrl?.trim());

  const hasCandidateProfileEvidence = hasResume || hasSkills || hasEducation || hasPortfolioOrGithub;

  if (hasCandidateProfileEvidence) {
    return { isEligible: true, reason: 'verified_onboarding_evidence' };
  }

  // Otherwise, exclude from candidate discovery and flag as unclassified for review
  return { isEligible: false, reason: 'unclassified_missing_evidence' };
}

export function isEligibleCandidateUser(u: any, currentEmployerId?: string): boolean {
  return evaluateCandidateEligibility(u, currentEmployerId).isEligible;
}

/**
 * Helper to fetch all users from Firestore using batched pagination,
 * ensuring no eligible users beyond 100 are omitted.
 */
async function fetchAllUserDocuments(): Promise<QueryDocumentSnapshot[]> {
  const usersRef = collection(db, 'users');
  const allDocs: QueryDocumentSnapshot[] = [];
  let lastVisible: QueryDocumentSnapshot | null = null;
  let hasMore = true;
  const BATCH_SIZE = 100;
  const MAX_SCAN_LIMIT = 500; // Safeguard limit to protect memory and network

  try {
    while (hasMore && allDocs.length < MAX_SCAN_LIMIT) {
      const pageQuery = lastVisible
        ? query(usersRef, startAfter(lastVisible), limit(BATCH_SIZE))
        : query(usersRef, limit(BATCH_SIZE));
      const pageSnap = await getDocs(pageQuery);
      if (pageSnap.empty) break;
      allDocs.push(...pageSnap.docs);
      lastVisible = pageSnap.docs[pageSnap.docs.length - 1];
      if (pageSnap.docs.length < BATCH_SIZE) hasMore = false;
    }
    return allDocs;
  } catch (unfilteredErr) {
    // If unfiltered collection listing is restricted by rules, fallback to canonical role query with pagination
    allDocs.length = 0;
    lastVisible = null;
    hasMore = true;
    try {
      while (hasMore && allDocs.length < MAX_SCAN_LIMIT) {
        const roleQuery = lastVisible
          ? query(
              usersRef,
              where('role', 'in', ['job_seeker', 'candidate']),
              startAfter(lastVisible),
              limit(BATCH_SIZE)
            )
          : query(
              usersRef,
              where('role', 'in', ['job_seeker', 'candidate']),
              limit(BATCH_SIZE)
            );
        const pageSnap = await getDocs(roleQuery);
        if (pageSnap.empty) break;
        allDocs.push(...pageSnap.docs);
        lastVisible = pageSnap.docs[pageSnap.docs.length - 1];
        if (pageSnap.docs.length < BATCH_SIZE) hasMore = false;
      }
      return allDocs;
    } catch (roleErr) {
      console.warn('candidateDiscoveryService fetchAllUserDocuments fallback notice:', roleErr);
      throw unfilteredErr;
    }
  }
}

export const candidateDiscoveryService = {
  /**
   * Search real candidate records directly from Firestore without fabricated profiles.
   */
  async searchCandidates(
    currentEmployerId: string,
    filters: CandidateSearchFilters = {},
    maxResults: number = 50
  ): Promise<CandidateProfileResult[]> {
    let savedIds = new Set<string>();

    if (currentEmployerId && isFirebaseConfigured) {
      try {
        const savedList = await employerSavedCandidateRepository.findByEmployerId(currentEmployerId);
        savedIds = new Set(savedList.map((s) => s.candidateId));
      } catch {
        savedIds = new Set();
      }
    }

    let results: CandidateProfileResult[] = [];

    if (isFirebaseConfigured) {
      try {
        const allUserDocs = await fetchAllUserDocuments();

        const unclassifiedForReview: Array<{ id: string; email?: string; role?: string }> = [];

        const eligibleDocs = allUserDocs.filter((docSnap) => {
          const u = { uid: docSnap.id, ...docSnap.data() } as FirestoreUserDocument;
          const decision = evaluateCandidateEligibility(u, currentEmployerId);
          if (decision.reason === 'unclassified_missing_evidence') {
            unclassifiedForReview.push({ id: docSnap.id, email: u.email, role: u.role });
          }
          return decision.isEligible;
        });

        if (unclassifiedForReview.length > 0) {
          console.info(
            `candidateDiscoveryService: ${unclassifiedForReview.length} account(s) excluded due to missing/ambiguous role without candidate onboarding evidence:`,
            unclassifiedForReview
          );
        }

        const nameUnavailableIds: string[] = [];

        results = eligibleDocs.map((docSnap) => {
          const u = { uid: docSnap.id, ...docSnap.data() } as FirestoreUserDocument;
          const { name, isUnavailable } = resolveCandidateName(u);
          if (isUnavailable) {
            nameUnavailableIds.push(docSnap.id);
          }

          const eduStr =
            typeof u.education === 'string'
              ? u.education
              : Array.isArray(u.education)
              ? u.education.map((e) => (typeof e === 'string' ? e : e?.degree || e?.institution || '')).filter(Boolean).join(', ')
              : '';

          return {
            id: u.uid || docSnap.id,
            displayName: name,
            isNameUnavailable: isUnavailable,
            headline: u.headline || '',
            location: u.location || '',
            bio: u.bio || '',
            avatarUrl: u.avatarUrl || u.photoURL,
            skills: Array.isArray(u.skills) ? u.skills : [],
            experienceYears: typeof u.experienceYears === 'number' ? u.experienceYears : 0,
            education: eduStr,
            portfolioUrl: u.portfolioUrl || u.website,
            githubUrl: u.githubUrl,
            linkedinUrl: u.linkedinUrl,
            resumeUrl: u.resumeUrl,
            resumeName: u.resumeName,
            isSaved: savedIds.has(u.uid || docSnap.id),
          };
        });

        if (nameUnavailableIds.length > 0) {
          console.warn(
            `candidateDiscoveryService: ${nameUnavailableIds.length} candidate account(s) have no genuine persisted name and display "Name unavailable":`,
            nameUnavailableIds
          );
        }
      } catch (err) {
        console.warn('candidateDiscoveryService.searchCandidates notice:', err);
        throw err;
      }
    }

    // Filter by keywords, skills, location in memory if provided
    if (filters.query?.trim()) {
      const qLower = filters.query.trim().toLowerCase();
      results = results.filter((c) =>
        c.displayName.toLowerCase().includes(qLower) ||
        c.headline.toLowerCase().includes(qLower) ||
        c.bio.toLowerCase().includes(qLower) ||
        c.education.toLowerCase().includes(qLower) ||
        c.skills.some((s) => s.toLowerCase().includes(qLower))
      );
    }

    if (filters.skill?.trim()) {
      const skillLower = filters.skill.trim().toLowerCase();
      results = results.filter((c) =>
        c.skills.some((s) => s.toLowerCase().includes(skillLower))
      );
    }

    if (filters.location?.trim()) {
      const locLower = filters.location.trim().toLowerCase();
      results = results.filter((c) =>
        c.location.toLowerCase().includes(locLower)
      );
    }

    if (filters.remoteOnly) {
      results = results.filter((c) =>
        c.location.toLowerCase().includes('remote')
      );
    }

    if (filters.experienceLevel) {
      if (filters.experienceLevel === 'Entry Level') {
        results = results.filter((c) => c.experienceYears <= 2);
      } else if (filters.experienceLevel === 'Mid Level') {
        results = results.filter((c) => c.experienceYears > 2 && c.experienceYears <= 5);
      } else if (filters.experienceLevel === 'Senior Level') {
        results = results.filter((c) => c.experienceYears > 5);
      }
    }

    return results;
  },

  /**
   * Aggregate real talent sources based strictly on candidates in the database.
   */
  async getTalentSources(): Promise<TalentSourcePool[]> {
    if (!isFirebaseConfigured) return [];

    try {
      const allUserDocs = await fetchAllUserDocuments();

      const universityMap: Record<string, { count: number; skills: Set<string> }> = {};
      const locationMap: Record<string, { count: number; skills: Set<string> }> = {};
      const skillMap: Record<string, number> = {};

      const eligibleDocs = allUserDocs.filter((d) => {
        const u = { uid: d.id, ...d.data() } as FirestoreUserDocument;
        return isEligibleCandidateUser(u);
      });

      eligibleDocs.forEach((d) => {
        const u = { uid: d.id, ...d.data() } as FirestoreUserDocument;
        const skills = Array.isArray(u.skills) ? u.skills : [];

        // University / Education tally
        const edu = typeof u.education === 'string' ? u.education.trim() : '';
        if (edu) {
          // Extract potential institution name
          const instMatch = edu.split(',')[0]?.trim();
          if (instMatch && instMatch.length > 2) {
            if (!universityMap[instMatch]) {
              universityMap[instMatch] = { count: 0, skills: new Set() };
            }
            universityMap[instMatch].count++;
            skills.forEach((s) => universityMap[instMatch].skills.add(s));
          }
        }

        // Location tally
        const loc = u.location?.trim();
        if (loc) {
          if (!locationMap[loc]) {
            locationMap[loc] = { count: 0, skills: new Set() };
          }
          locationMap[loc].count++;
          skills.forEach((s) => locationMap[loc].skills.add(s));
        }

        // Skills tally
        skills.forEach((s) => {
          const sNormalized = s.trim();
          if (sNormalized) {
            skillMap[sNormalized] = (skillMap[sNormalized] || 0) + 1;
          }
        });
      });

      const pools: TalentSourcePool[] = [];

      // Add university talent pools
      Object.entries(universityMap).forEach(([inst, data], idx) => {
        pools.push({
          id: `univ_${idx}`,
          name: inst,
          category: 'University',
          candidateCount: data.count,
          topSkills: Array.from(data.skills).slice(0, 4),
          description: `Candidates affiliated with ${inst}`,
        });
      });

      // Add location pools
      Object.entries(locationMap).forEach(([loc, data], idx) => {
        pools.push({
          id: `loc_${idx}`,
          name: loc,
          category: 'Location',
          candidateCount: data.count,
          topSkills: Array.from(data.skills).slice(0, 4),
          description: `Candidates located in ${loc}`,
          location: loc,
        });
      });

      // Add top skill pools
      Object.entries(skillMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .forEach(([skillName, count], idx) => {
          pools.push({
            id: `skill_${idx}`,
            name: `${skillName} Specialists`,
            category: 'Skill Pool',
            candidateCount: count,
            topSkills: [skillName],
            description: `Candidates with verified proficiency in ${skillName}`,
          });
        });

      return pools;
    } catch (err) {
      console.warn('candidateDiscoveryService.getTalentSources notice:', err);
      return [];
    }
  },

  /**
   * Save a candidate to the employer's saved list.
   */
  async saveCandidate(employerId: string, candidate: CandidateProfileResult, notes: string = ''): Promise<void> {
    await employerSavedCandidateRepository.saveCandidate({
      id: `${employerId}_${candidate.id}`,
      employerId,
      candidateId: candidate.id,
      candidateName: candidate.displayName,
      candidateHeadline: candidate.headline,
      candidateLocation: candidate.location,
      candidateSkills: candidate.skills,
      candidateAvatar: candidate.avatarUrl,
      candidateExperienceYears: candidate.experienceYears,
      candidateEducation: candidate.education,
      notes,
      tags: candidate.skills.slice(0, 3),
      status: 'saved',
    });
  },

  /**
   * Remove a candidate from the employer's saved list.
   */
  async removeSavedCandidate(employerId: string, candidateId: string): Promise<void> {
    await employerSavedCandidateRepository.removeCandidate(employerId, candidateId);
  },

  /**
   * Get all saved candidates for an employer.
   */
  async getSavedCandidates(employerId: string): Promise<EmployerSavedCandidate[]> {
    const docs = await employerSavedCandidateRepository.findByEmployerId(employerId);
    return Promise.all(
      docs.map(async (d) => {
        let name = isValidCandidateName(d.candidateName) ? d.candidateName.trim() : '';
        if (!name && d.candidateId) {
          try {
            const userDoc = await userRepository.findById(d.candidateId);
            if (userDoc) {
              const res = resolveCandidateName(userDoc);
              if (!res.isUnavailable) {
                name = res.name;
              }
            }
          } catch {
            // graceful fallback
          }
        }
        return {
          id: d.id,
          employerId: d.employerId,
          candidateId: d.candidateId,
          candidateName: name || 'Name unavailable',
          candidateEmail: d.candidateEmail,
          candidateTitle: d.candidateTitle || d.candidateHeadline,
          candidateHeadline: d.candidateHeadline,
          candidateSkills: d.candidateSkills || [],
          candidateLocation: d.candidateLocation,
          candidateAvatar: d.candidateAvatar,
          candidateExperienceYears: d.candidateExperienceYears,
          candidateEducation: d.candidateEducation,
          notes: d.notes,
          tags: d.tags || [],
          status: d.status || 'saved',
          savedAt: typeof d.savedAt === 'string' ? d.savedAt : new Date(d.savedAt).toISOString(),
        };
      })
    );
  },
};
