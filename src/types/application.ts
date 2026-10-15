export type ApplicationStatus = 
  | 'applied' 
  | 'under_review' 
  | 'shortlisted' 
  | 'interviewing' 
  | 'offered' 
  | 'rejected' 
  | 'withdrawn';

export type JobApplication = ApplicationItem;
export interface ApplicationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantAvatar?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated?: string;
  updatedDate?: string;
  notes?: string;
}
