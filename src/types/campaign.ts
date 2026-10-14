export interface HiringCampaign {
  id: string;
  employerId: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  positions: string[];
  requiredSkills: string[];
  experienceLevel: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  applicationDestination: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  applicantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerSavedCandidate {
  id: string;
  employerId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  candidateTitle?: string;
  candidateHeadline?: string;
  candidateSkills?: string[];
  candidateLocation?: string;
  candidateAvatar?: string;
  candidateExperienceYears?: number;
  candidateEducation?: string;
  notes?: string;
  tags?: string[];
  status?: 'saved' | 'shortlisted' | 'contacted';
  savedAt: string;
}

export interface TalentSourcePool {
  id: string;
  name: string;
  category: 'University' | 'Location' | 'Skill Pool' | 'Experience Pool';
  candidateCount: number;
  topSkills: string[];
  description?: string;
  location?: string;
}
