export interface PlatformStatistics {
  totalUsers: number;
  activeJobSeekers: number;
  employers: number;
  verifiedCompanies: number;
  jobsPosted: number;
  activeJobs: number;
  closedJobs: number;
  applicationsSubmitted: number;
  interviewsScheduled: number;
  offersSent: number;
  successfulHires: number;
  userGrowthRate: string;
  jobGrowthRate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'job_seeker' | 'employer' | 'admin';
  status: 'Active' | 'Suspended' | 'Pending Verification';
  joinedDate: string;
  lastLogin: string;
  applicationsCount: number;
  avatar: string;
  verified: boolean;
}

export interface AdminEmployer {
  id: string;
  companyName: string;
  contactEmail: string;
  industry: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Suspended';
  featured: boolean;
  activeJobs: number;
  totalHires: number;
  joinedDate: string;
  logo: string;
  verificationDocUrl?: string;
}

export interface AdminJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  type: string;
  salary: string;
  status: 'Active' | 'Pending' | 'Reported' | 'Expired' | 'Rejected' | 'Archived';
  postedDate: string;
  applicationsCount: number;
  reportsCount: number;
}

export interface AdminApplication {
  id: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interviewing' | 'Offered' | 'Rejected';
  riskFlags?: string[];
}

export interface ModerationReport {
  id: string;
  type: 'user' | 'job' | 'company' | 'message';
  targetId: string;
  targetName: string;
  reporterName: string;
  reason: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export interface SystemHealthItem {
  serviceName: string;
  status: 'Healthy' | 'Degraded' | 'Offline';
  latencyMs: number;
  uptimePercentage: number;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'job_seekers' | 'employers';
  isPinned: boolean;
  status: 'Published' | 'Draft' | 'Scheduled';
  createdAt: string;
  scheduledFor?: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: 'Admin' | 'Employer' | 'User';
  action: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface AdminNotificationItem {
  id: string;
  type: 'registration' | 'verification' | 'report' | 'system' | 'maintenance';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

class AdminPortalService {
  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  private stats: PlatformStatistics = {
    totalUsers: 14820,
    activeJobSeekers: 11250,
    employers: 3570,
    verifiedCompanies: 840,
    jobsPosted: 4290,
    activeJobs: 1850,
    closedJobs: 2440,
    applicationsSubmitted: 48920,
    interviewsScheduled: 6410,
    offersSent: 1890,
    successfulHires: 1420,
    userGrowthRate: '+18.4%',
    jobGrowthRate: '+12.1%',
  };

  private users: AdminUser[] = [
    {
      id: 'usr-1',
      name: 'Alex Vance',
      email: 'alex.vance@techcorp.com',
      role: 'employer',
      status: 'Active',
      joinedDate: '2025-01-15',
      lastLogin: '2026-08-04 10:15',
      applicationsCount: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      verified: true,
    },
    {
      id: 'usr-2',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      role: 'job_seeker',
      status: 'Active',
      joinedDate: '2025-03-22',
      lastLogin: '2026-08-04 09:30',
      applicationsCount: 14,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      verified: true,
    },
    {
      id: 'usr-3',
      name: 'Marcus Brody',
      email: 'marcus.b@designcraft.io',
      role: 'employer',
      status: 'Pending Verification',
      joinedDate: '2026-07-28',
      lastLogin: '2026-08-02 14:20',
      applicationsCount: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      verified: false,
    },
    {
      id: 'usr-4',
      name: 'Devon Miles',
      email: 'devon.m@spammail.com',
      role: 'job_seeker',
      status: 'Suspended',
      joinedDate: '2026-06-10',
      lastLogin: '2026-07-15 11:00',
      applicationsCount: 2,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      verified: false,
    },
    {
      id: 'usr-5',
      name: 'Elena Rostova',
      email: 'elena.admin@careerconnect.io',
      role: 'admin',
      status: 'Active',
      joinedDate: '2024-11-01',
      lastLogin: '2026-08-04 11:00',
      applicationsCount: 0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      verified: true,
    },
  ];

  private employers: AdminEmployer[] = [
    {
      id: 'emp-1',
      companyName: 'TechCorp Global',
      contactEmail: 'recruiting@techcorp.com',
      industry: 'Cloud Infrastructure & AI',
      status: 'Verified',
      featured: true,
      activeJobs: 12,
      totalHires: 48,
      joinedDate: '2024-12-10',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      verificationDocUrl: 'https://careerconnect.dev/docs/techcorp-tax-id.pdf',
    },
    {
      id: 'emp-2',
      companyName: 'DataMind AI Labs',
      contactEmail: 'hr@datamind.ai',
      industry: 'Machine Learning Research',
      status: 'Verified',
      featured: true,
      activeJobs: 8,
      totalHires: 31,
      joinedDate: '2025-02-14',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      verificationDocUrl: 'https://careerconnect.dev/docs/datamind-inc.pdf',
    },
    {
      id: 'emp-3',
      companyName: 'FinPulse Systems',
      contactEmail: 'contact@finpulse.io',
      industry: 'Financial Technology',
      status: 'Pending',
      featured: false,
      activeJobs: 3,
      totalHires: 0,
      joinedDate: '2026-07-30',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200',
      verificationDocUrl: 'https://careerconnect.dev/docs/finpulse-verification.pdf',
    },
    {
      id: 'emp-4',
      companyName: 'HyperGrowth Ventures',
      contactEmail: 'jobs@hypergrowth.co',
      industry: 'Venture Studio',
      status: 'Suspended',
      featured: false,
      activeJobs: 0,
      totalHires: 4,
      joinedDate: '2025-09-01',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    },
  ];

  private jobs: AdminJob[] = [
    {
      id: 'job-1',
      title: 'Senior Full Stack Engineer (React & Node.js)',
      companyName: 'TechCorp Global',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      salary: '$150,000 - $185,000',
      status: 'Active',
      postedDate: '2026-07-15',
      applicationsCount: 42,
      reportsCount: 0,
    },
    {
      id: 'job-2',
      title: 'Staff AI / Machine Learning Scientist',
      companyName: 'DataMind AI Labs',
      location: 'Remote (US)',
      type: 'Full-time',
      salary: '$190,000 - $240,000',
      status: 'Active',
      postedDate: '2026-07-20',
      applicationsCount: 28,
      reportsCount: 0,
    },
    {
      id: 'job-3',
      title: 'Cryptocurrency Arbitrage Bot Developer ($$$ Guaranteed)',
      companyName: 'Unknown Crypto Org',
      location: 'Remote',
      type: 'Contract',
      salary: '$300,000',
      status: 'Reported',
      postedDate: '2026-08-01',
      applicationsCount: 5,
      reportsCount: 4,
    },
    {
      id: 'job-4',
      title: 'Lead Product Designer (UI/UX)',
      companyName: 'FinPulse Systems',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130,000 - $160,000',
      status: 'Pending',
      postedDate: '2026-08-03',
      applicationsCount: 0,
      reportsCount: 0,
    },
  ];

  private applications: AdminApplication[] = [
    {
      id: 'app-101',
      candidateName: 'Sarah Chen',
      candidateEmail: 'sarah.chen@example.com',
      jobTitle: 'Senior Full Stack Engineer (React & Node.js)',
      companyName: 'TechCorp Global',
      appliedDate: '2026-07-18',
      status: 'Interviewing',
    },
    {
      id: 'app-102',
      candidateName: 'David Kim',
      candidateEmail: 'david.k@dev.org',
      jobTitle: 'Staff AI / Machine Learning Scientist',
      companyName: 'DataMind AI Labs',
      appliedDate: '2026-07-22',
      status: 'Shortlisted',
    },
    {
      id: 'app-103',
      candidateName: 'Suspicious Bot Account',
      candidateEmail: 'bot99@tempmail.org',
      jobTitle: 'Cryptocurrency Arbitrage Bot Developer',
      companyName: 'Unknown Crypto Org',
      appliedDate: '2026-08-02',
      status: 'Submitted',
      riskFlags: ['Disposable Email Domain', 'Rapid Multi-Submission'],
    },
  ];

  private moderationReports: ModerationReport[] = [
    {
      id: 'rep-1',
      type: 'job',
      targetId: 'job-3',
      targetName: 'Cryptocurrency Arbitrage Bot Developer ($$$ Guaranteed)',
      reporterName: 'Sarah Chen (Candidate)',
      reason: 'Suspected scam or phishing job posting requiring up-front fee.',
      severity: 'High',
      status: 'Pending',
      createdAt: '2026-08-02 16:45',
    },
    {
      id: 'rep-2',
      type: 'user',
      targetId: 'usr-4',
      targetName: 'Devon Miles',
      reporterName: 'TechCorp Recruiter',
      reason: 'Unsolicited spam messaging and automated resume submissions.',
      severity: 'Medium',
      status: 'Resolved',
      createdAt: '2026-07-29 11:20',
    },
    {
      id: 'rep-3',
      type: 'company',
      targetId: 'emp-4',
      targetName: 'HyperGrowth Ventures',
      reporterName: 'Multiple Applicants',
      reason: 'Failed to honor agreed employment contract terms.',
      severity: 'Critical',
      status: 'Pending',
      createdAt: '2026-08-03 09:10',
    },
  ];

  private announcements: AnnouncementItem[] = [
    {
      id: 'ann-1',
      title: 'Scheduled Maintenance Window: Aug 15, 2026',
      content: 'The CareerConnect portal will undergo planned system updates on August 15 from 02:00 UTC to 04:00 UTC.',
      targetAudience: 'all',
      isPinned: true,
      status: 'Published',
      createdAt: '2026-08-01',
    },
    {
      id: 'ann-2',
      title: 'New AI Resume Matcher Available for Employers',
      content: 'Employers can now enable instant candidate skill matching powered by our upgraded vector search engine.',
      targetAudience: 'employers',
      isPinned: false,
      status: 'Published',
      createdAt: '2026-07-25',
    },
  ];

  private auditLogs: AuditLogItem[] = [
    {
      id: 'log-1',
      actorName: 'Elena Rostova',
      actorRole: 'Admin',
      action: 'Verified Employer Account',
      target: 'TechCorp Global (emp-1)',
      timestamp: '2026-08-04 10:30',
      ipAddress: '192.168.1.102',
    },
    {
      id: 'log-2',
      actorName: 'Alex Vance',
      actorRole: 'Employer',
      action: 'Posted New Job Opening',
      target: 'Senior Full Stack Engineer (job-1)',
      timestamp: '2026-07-15 14:10',
      ipAddress: '74.125.18.33',
    },
    {
      id: 'log-3',
      actorName: 'Elena Rostova',
      actorRole: 'Admin',
      action: 'Suspended User Account',
      target: 'Devon Miles (usr-4)',
      timestamp: '2026-07-29 12:00',
      ipAddress: '192.168.1.102',
    },
  ];

  private notifications: AdminNotificationItem[] = [
    {
      id: 'notif-1',
      type: 'verification',
      title: 'Employer Verification Request',
      message: 'FinPulse Systems submitted business documentation for account verification.',
      timestamp: '15 minutes ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'report',
      title: 'High Severity Job Report',
      message: 'Job #job-3 flagged by 4 candidates for suspected phishing.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'registration',
      title: 'New Employer Sign-up',
      message: 'Marcus Brody created a new employer organization (DesignCraft).',
      timestamp: '1 day ago',
      read: true,
    },
  ];

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getPlatformStatistics(): Promise<PlatformStatistics> {
    return { ...this.stats };
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getUsers(): Promise<AdminUser[]> {
    return [...this.users];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async updateUserStatus(userId: string, status: AdminUser['status']): Promise<void> {
    this.users = this.users.map((u) => (u.id === userId ? { ...u, status } : u));
    this.addAuditLog('Admin Action', `Updated user ${userId} status to ${status}`);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async deleteUser(userId: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== userId);
    this.addAuditLog('Admin Action', `Deleted user account ${userId}`);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getEmployers(): Promise<AdminEmployer[]> {
    return [...this.employers];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async verifyEmployer(employerId: string, status: AdminEmployer['status']): Promise<void> {
    this.employers = this.employers.map((e) => (e.id === employerId ? { ...e, status } : e));
    this.addAuditLog('Admin Action', `Updated employer ${employerId} verification status to ${status}`);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async toggleEmployerFeatured(employerId: string): Promise<void> {
    this.employers = this.employers.map((e) =>
      e.id === employerId ? { ...e, featured: !e.featured } : e
    );
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getJobs(): Promise<AdminJob[]> {
    return [...this.jobs];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async updateJobStatus(jobId: string, status: AdminJob['status']): Promise<void> {
    this.jobs = this.jobs.map((j) => (j.id === jobId ? { ...j, status } : j));
    this.addAuditLog('Admin Action', `Updated job ${jobId} status to ${status}`);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getApplications(): Promise<AdminApplication[]> {
    return [...this.applications];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getModerationReports(): Promise<ModerationReport[]> {
    return [...this.moderationReports];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async resolveReport(reportId: string): Promise<void> {
    this.moderationReports = this.moderationReports.map((r) =>
      r.id === reportId ? { ...r, status: 'Resolved' } : r
    );
    this.addAuditLog('Admin Action', `Resolved moderation report ${reportId}`);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async dismissReport(reportId: string): Promise<void> {
    this.moderationReports = this.moderationReports.map((r) =>
      r.id === reportId ? { ...r, status: 'Dismissed' } : r
    );
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getAnnouncements(): Promise<AnnouncementItem[]> {
    return [...this.announcements];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async createAnnouncement(data: Omit<AnnouncementItem, 'id' | 'createdAt'>): Promise<AnnouncementItem> {
    const newItem: AnnouncementItem = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.announcements = [newItem, ...this.announcements];
    return newItem;
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async deleteAnnouncement(id: string): Promise<void> {
    this.announcements = this.announcements.filter((a) => a.id !== id);
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getAuditLogs(): Promise<AuditLogItem[]> {
    return [...this.auditLogs];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getNotifications(): Promise<AdminNotificationItem[]> {
    return [...this.notifications];
  }

  // TODO: Replace with Firebase Firestore / Auth API calls when connected.
  async getSystemHealth(): Promise<SystemHealthItem[]> {
    return [
      { serviceName: 'Firebase Firestore DB Engine', status: 'Healthy', latencyMs: 18, uptimePercentage: 99.99 },
      { serviceName: 'Authentication & Identity API', status: 'Healthy', latencyMs: 24, uptimePercentage: 99.98 },
      { serviceName: 'AI Resume Vector Matcher', status: 'Healthy', latencyMs: 45, uptimePercentage: 99.95 },
      { serviceName: 'Email Gateway & Webhooks', status: 'Healthy', latencyMs: 32, uptimePercentage: 99.90 },
      { serviceName: 'Object File Storage CDN', status: 'Healthy', latencyMs: 14, uptimePercentage: 99.99 },
    ];
  }

  private addAuditLog(action: string, target: string) {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      actorName: 'Elena Rostova',
      actorRole: 'Admin',
      action,
      target,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ipAddress: '192.168.1.102',
    };
    this.auditLogs = [newLog, ...this.auditLogs];
  }
}

export const adminPortalService = new AdminPortalService();
