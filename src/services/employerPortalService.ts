import { Job, JobApplication, ApplicationStatus } from '../types';

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  coverBanner: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
  email: string;
  phone: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  };
  description: string;
  mission: string;
  vision: string;
  benefits: string[];
  culture: string;
  galleryPhotos: string[];
  isVerified: boolean;
}

export interface EmployerCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  title: string;
  location: string;
  experienceYears: number;
  matchScore: number;
  skills: string[];
  appliedJobId: string;
  appliedJobTitle: string;
  stage: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Technical Round' | 'HR Round' | 'Offer' | 'Hired' | 'Rejected';
  appliedDate: string;
  resumeUrl: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  summary: string;
  experienceHistory: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  notes: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

export interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  date: string;
  time: string;
  durationMinutes: number;
  type: 'Screening' | 'Technical Round' | 'System Design' | 'HR & Culture';
  panelMembers: string[];
  notes: string;
  meetingLink: string;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
}

export interface JobOffer {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: string;
  jobTitle: string;
  baseSalary: number;
  signingBonus?: number;
  equity?: string;
  startDate: string;
  expirationDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Expired';
  sentDate: string;
  offerLetterUrl: string;
}

export interface EmployerTeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Owner' | 'Hiring Manager' | 'Senior Recruiter' | 'Interviewer';
  department: string;
  status: 'Active' | 'Pending Invite' | 'Inactive';
  permissions: string[];
  joinedDate: string;
}

export interface EmployerNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'application' | 'interview' | 'offer' | 'job_expiry' | 'system';
  read: boolean;
  link?: string;
}

export interface EmployerAnalyticsData {
  applicationsReceived: number;
  viewsPerJob: number;
  avgTimeToHireDays: number;
  offerAcceptanceRate: number;
  pipelineConversion: Array<{ stage: string; count: number }>;
  topPerformingJobs: Array<{ id: string; title: string; views: number; applications: number; hires: number }>;
  sourceAttribution: Array<{ source: string; percentage: number }>;
  monthlyTrend: Array<{ month: string; applications: number; interviews: number; hires: number }>;
}

// Initial Mock Company Profile Data
const initialCompanyProfile: CompanyProfile = {
  id: 'comp-101',
  name: 'TechCorp Global',
  logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=160&q=80',
  coverBanner: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  industry: 'Software & Cloud Solutions',
  size: '500 - 1,000 Employees',
  headquarters: 'San Francisco, CA',
  website: 'https://techcorp-global.example.com',
  email: 'careers@techcorp.com',
  phone: '+1 (555) 234-5678',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/techcorp-global',
    twitter: 'https://twitter.com/techcorp',
    github: 'https://github.com/techcorp-dev',
  },
  description: 'TechCorp Global is a premier engineering organization delivering high-throughput cloud platforms, AI services, and developer infrastructure powering enterprise workflows globally.',
  mission: 'To empower organizations worldwide through resilient software architecture and intuitive human-centered technology.',
  vision: 'Building the foundational cloud & AI ecosystem for the next decade of digital transformation.',
  benefits: [
    'Comprehensive Health, Dental & Vision (100% Employer Covered)',
    '401(k) Matching up to 6% with immediate vesting',
    '$3,000 Annual Learning & Conference Stipend',
    'Flexible Work Location (Remote & Hybrid options)',
    '30 Days Paid Vacation + Unlimited Mental Health Days',
    'Annual Company Retreats in Iceland and Japan'
  ],
  culture: 'We foster an async-first engineering culture based on high autonomy, rigorous code design reviews, transparent blameless post-mortems, and continuous technical upskilling.',
  galleryPhotos: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
  ],
  isVerified: true,
};

// Mock Candidates List
const mockCandidates: EmployerCandidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    title: 'Senior Full Stack Engineer',
    location: 'San Francisco, CA (Remote)',
    experienceYears: 6,
    matchScore: 98,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    appliedJobId: 'job-1',
    appliedJobTitle: 'Senior React Developer',
    stage: 'Technical Round',
    appliedDate: '2026-08-01',
    resumeUrl: 'https://careerconnect.example.com/resumes/sarah_jenkins_2026.pdf',
    portfolioUrl: 'https://sarahjenkins.dev',
    githubUrl: 'https://github.com/sarah-j-dev',
    linkedinUrl: 'https://linkedin.com/in/sarahjenkins-dev',
    summary: 'Senior engineer specializing in high-performance frontend architecture, distributed React applications, and GraphQL API design.',
    experienceHistory: [
      {
        role: 'Lead Frontend Developer',
        company: 'Vercel Partner Labs',
        duration: '2023 - Present',
        description: 'Architected Next.js micro-frontends serving 5M+ monthly active users with 99.9% uptime.'
      },
      {
        role: 'Full Stack Engineer',
        company: 'CloudScale Inc',
        duration: '2020 - 2023',
        description: 'Developed real-time analytics dashboard with React 18, WebSocket streams, and Tailwind CSS.'
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2020'
      }
    ],
    notes: [
      {
        id: 'n1',
        author: 'Alex Vance (Hiring Manager)',
        text: 'Strong systemic understanding of React Concurrent Mode. Passed coding screening with top scores.',
        createdAt: '2026-08-02 14:30'
      }
    ]
  },
  {
    id: 'cand-2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    title: 'Principal AI Infrastructure Lead',
    location: 'Seattle, WA',
    experienceYears: 8,
    matchScore: 94,
    skills: ['Python', 'PyTorch', 'C++', 'Kubeflow', 'Distributed Training'],
    appliedJobId: 'job-2',
    appliedJobTitle: 'Lead AI Systems Engineer',
    stage: 'Interview',
    appliedDate: '2026-07-29',
    resumeUrl: 'https://careerconnect.example.com/resumes/michael_chen.pdf',
    portfolioUrl: 'https://mchen.ai',
    githubUrl: 'https://github.com/mchen-ai',
    summary: 'Specialized in scaling LLM inference infrastructure, TensorRT optimization, and Kubernetes GPU orchestration.',
    experienceHistory: [
      {
        role: 'Senior Staff ML Engineer',
        company: 'NVIDIA Research Lab',
        duration: '2021 - Present',
        description: 'Optimized model serving throughput by 3.2x across 500+ A100 GPU clusters.'
      }
    ],
    education: [
      {
        degree: 'M.S. in Artificial Intelligence',
        institution: 'Stanford University',
        year: '2018'
      }
    ],
    notes: []
  },
  {
    id: 'cand-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    title: 'Senior Product Designer (UI/UX)',
    location: 'Austin, TX',
    experienceYears: 5,
    matchScore: 92,
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    appliedJobId: 'job-3',
    appliedJobTitle: 'Staff UI/UX Architect',
    stage: 'Offer',
    appliedDate: '2026-07-25',
    resumeUrl: 'https://careerconnect.example.com/resumes/elena_design.pdf',
    portfolioUrl: 'https://elenarostova.design',
    summary: 'Product designer focused on systemic component libraries, accessibility compliance, and developer design tokens.',
    experienceHistory: [
      {
        role: 'Principal UX Designer',
        company: 'Stripe Product Suite',
        duration: '2022 - Present',
        description: 'Led revamp of merchant onboarding flow resulting in +14% conversion increase.'
      }
    ],
    education: [
      {
        degree: 'B.A. in Interaction Design',
        institution: 'Rhode Island School of Design',
        year: '2021'
      }
    ],
    notes: [
      {
        id: 'n2',
        author: 'Jessica Wu (HR Director)',
        text: 'Offer extended on 2026-08-03. Candidate reviewing package details.',
        createdAt: '2026-08-03 16:00'
      }
    ]
  },
  {
    id: 'cand-4',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    title: 'Cloud DevOps Architect',
    location: 'Denver, CO',
    experienceYears: 7,
    matchScore: 89,
    skills: ['Terraform', 'Kubernetes', 'AWS', 'Datadog', 'Go'],
    appliedJobId: 'job-1',
    appliedJobTitle: 'Senior React Developer',
    stage: 'Shortlisted',
    appliedDate: '2026-08-02',
    resumeUrl: 'https://careerconnect.example.com/resumes/david_miller.pdf',
    summary: 'DevOps engineer focused on GitOps pipelines, infrastructure as code, and multi-region failover.',
    experienceHistory: [],
    education: [],
    notes: []
  },
  {
    id: 'cand-5',
    name: 'Aisha Patel',
    email: 'aisha.p@example.com',
    phone: '+1 (555) 789-0123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    title: 'Frontend Developer',
    location: 'Chicago, IL',
    experienceYears: 4,
    matchScore: 87,
    skills: ['React', 'Vue', 'JavaScript', 'CSS3', 'REST APIs'],
    appliedJobId: 'job-1',
    appliedJobTitle: 'Senior React Developer',
    stage: 'Applied',
    appliedDate: '2026-08-04',
    resumeUrl: 'https://careerconnect.example.com/resumes/aisha_patel.pdf',
    summary: 'Frontend developer passionate about responsive mobile-first UIs and clean web performance metrics.',
    experienceHistory: [],
    education: [],
    notes: []
  }
];

// Mock Scheduled Interviews
const mockInterviews: ScheduledInterview[] = [
  {
    id: 'int-101',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins',
    candidateEmail: 'sarah.j@example.com',
    jobId: 'job-1',
    jobTitle: 'Senior React Developer',
    date: '2026-08-06',
    time: '14:00 PST',
    durationMinutes: 60,
    type: 'Technical Round',
    panelMembers: ['Alex Vance (Lead Architect)', 'David K. (Staff Engineer)'],
    notes: 'Live coding on React State Machines & Custom Hook Architecture.',
    meetingLink: 'https://meet.careerconnect.dev/room/techcorp-sarah-jenkins',
    status: 'Scheduled',
  },
  {
    id: 'int-102',
    candidateId: 'cand-2',
    candidateName: 'Michael Chen',
    candidateEmail: 'm.chen@example.com',
    jobId: 'job-2',
    jobTitle: 'Lead AI Systems Engineer',
    date: '2026-08-07',
    time: '11:00 PST',
    durationMinutes: 45,
    type: 'Screening',
    panelMembers: ['Jessica Wu (Talent Partner)'],
    notes: 'Initial screening on career goals, GPU cluster experience, and compensation alignment.',
    meetingLink: 'https://meet.careerconnect.dev/room/techcorp-michael-chen',
    status: 'Scheduled',
  }
];

// Mock Offers List
const mockOffers: JobOffer[] = [
  {
    id: 'off-201',
    candidateId: 'cand-3',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@example.com',
    jobId: 'job-3',
    jobTitle: 'Staff UI/UX Architect',
    baseSalary: 175000,
    signingBonus: 20000,
    equity: '15,000 ISO Stock Units',
    startDate: '2026-09-01',
    expirationDate: '2026-08-15',
    status: 'Pending',
    sentDate: '2026-08-03',
    offerLetterUrl: 'https://careerconnect.example.com/offers/elena_rostova_offer.pdf'
  }
];

// Mock Team Members
const mockTeamMembers: EmployerTeamMember[] = [
  {
    id: 'team-1',
    name: 'Alex Vance',
    email: 'alex.vance@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
    role: 'Owner',
    department: 'Engineering Leadership',
    status: 'Active',
    permissions: ['Full Admin', 'Job Creation', 'Candidate Evaluation', 'Offer Approval'],
    joinedDate: '2024-01-15'
  },
  {
    id: 'team-2',
    name: 'Jessica Wu',
    email: 'jessica.wu@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    role: 'Senior Recruiter',
    department: 'Talent Acquisition',
    status: 'Active',
    permissions: ['Job Creation', 'Candidate Screening', 'Interview Scheduling', 'Offer Generation'],
    joinedDate: '2024-06-10'
  },
  {
    id: 'team-3',
    name: 'Marcus Thorne',
    email: 'marcus.t@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    role: 'Hiring Manager',
    department: 'AI & Data Systems',
    status: 'Active',
    permissions: ['Candidate Evaluation', 'Interview Conducting'],
    joinedDate: '2025-02-01'
  }
];

// Mock Employer Service
export const employerPortalService = {
  // Company Profile
  getCompanyProfile: async (): Promise<CompanyProfile> => {
    // TODO: Replace with Firebase Firestore call `doc(db, 'companies', employerId)`
    return { ...initialCompanyProfile };
  },

  updateCompanyProfile: async (data: Partial<CompanyProfile>): Promise<CompanyProfile> => {
    // TODO: Replace with Firebase Firestore updateDoc `updateDoc(doc(db, 'companies', employerId), data)`
    Object.assign(initialCompanyProfile, data);
    return { ...initialCompanyProfile };
  },

  // Candidates & Applicants
  getCandidates: async (): Promise<EmployerCandidate[]> => {
    // TODO: Replace with Firebase Firestore collection query `query(collection(db, 'applications'), where('employerId', '==', currentEmployerId))`
    return [...mockCandidates];
  },

  getCandidateDetails: async (candidateId: string): Promise<EmployerCandidate | null> => {
    // TODO: Replace with Firebase Firestore call `getDoc(doc(db, 'candidates', candidateId))`
    return mockCandidates.find(c => c.id === candidateId) || null;
  },

  updateApplicationStage: async (
    candidateId: string, 
    newStage: EmployerCandidate['stage']
  ): Promise<boolean> => {
    // TODO: Replace with Firebase Firestore call `updateDoc(doc(db, 'applications', applicationId), { stage: newStage })`
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.stage = newStage;
      return true;
    }
    return false;
  },

  addCandidateNote: async (candidateId: string, noteText: string, authorName: string): Promise<boolean> => {
    // TODO: Replace with Firebase Firestore arrayUnion `updateDoc(doc(db, 'candidates', candidateId), { notes: arrayUnion(...) })`
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (candidate) {
      candidate.notes.push({
        id: `note-${Date.now()}`,
        author: authorName,
        text: noteText,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      return true;
    }
    return false;
  },

  // Interviews
  getInterviews: async (): Promise<ScheduledInterview[]> => {
    // TODO: Replace with Firebase Firestore query `collection(db, 'interviews')`
    return [...mockInterviews];
  },

  scheduleInterview: async (interviewData: Omit<ScheduledInterview, 'id' | 'status'>): Promise<ScheduledInterview> => {
    // TODO: Replace with Firebase Firestore call `addDoc(collection(db, 'interviews'), interviewData)`
    const newInterview: ScheduledInterview = {
      ...interviewData,
      id: `int-${Date.now()}`,
      status: 'Scheduled',
    };
    mockInterviews.unshift(newInterview);
    return newInterview;
  },

  cancelInterview: async (interviewId: string): Promise<boolean> => {
    // TODO: Replace with Firebase Firestore call `updateDoc(doc(db, 'interviews', interviewId), { status: 'Cancelled' })`
    const int = mockInterviews.find(i => i.id === interviewId);
    if (int) {
      int.status = 'Cancelled';
      return true;
    }
    return false;
  },

  // Offers
  getOffers: async (): Promise<JobOffer[]> => {
    // TODO: Replace with Firebase Firestore query `collection(db, 'offers')`
    return [...mockOffers];
  },

  createOffer: async (offerData: Omit<JobOffer, 'id' | 'sentDate' | 'status' | 'offerLetterUrl'>): Promise<JobOffer> => {
    // TODO: Replace with Firebase Firestore call `addDoc(collection(db, 'offers'), offerData)`
    const newOffer: JobOffer = {
      ...offerData,
      id: `off-${Date.now()}`,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      offerLetterUrl: `https://careerconnect.example.com/offers/offer_${Date.now()}.pdf`
    };
    mockOffers.unshift(newOffer);
    
    // Also update candidate stage to Offer
    const candidate = mockCandidates.find(c => c.id === offerData.candidateId);
    if (candidate) {
      candidate.stage = 'Offer';
    }

    return newOffer;
  },

  updateOfferStatus: async (offerId: string, status: JobOffer['status']): Promise<boolean> => {
    // TODO: Replace with Firebase Firestore call `updateDoc(doc(db, 'offers', offerId), { status })`
    const offer = mockOffers.find(o => o.id === offerId);
    if (offer) {
      offer.status = status;
      return true;
    }
    return false;
  },

  // Analytics
  getEmployerAnalytics: async (): Promise<EmployerAnalyticsData> => {
    // TODO: Replace with Firebase Firestore aggregated queries or Cloud Functions analytics
    return {
      applicationsReceived: 148,
      viewsPerJob: 1240,
      avgTimeToHireDays: 18,
      offerAcceptanceRate: 86,
      pipelineConversion: [
        { stage: 'Applied', count: 148 },
        { stage: 'Screening', count: 64 },
        { stage: 'Shortlisted', count: 32 },
        { stage: 'Interview', count: 20 },
        { stage: 'Technical Round', count: 12 },
        { stage: 'HR Round', count: 8 },
        { stage: 'Offer', count: 6 },
        { stage: 'Hired', count: 5 },
      ],
      topPerformingJobs: [
        { id: 'job-1', title: 'Senior React Developer', views: 420, applications: 68, hires: 2 },
        { id: 'job-2', title: 'Lead AI Systems Engineer', views: 380, applications: 42, hires: 1 },
        { id: 'job-3', title: 'Staff UI/UX Architect', views: 290, applications: 38, hires: 2 },
      ],
      sourceAttribution: [
        { source: 'CareerConnect Direct', percentage: 48 },
        { source: 'LinkedIn Recruiter Sync', percentage: 28 },
        { source: 'Indeed Employer', percentage: 14 },
        { source: 'Employee Referral', percentage: 10 },
      ],
      monthlyTrend: [
        { month: 'Apr', applications: 92, interviews: 14, hires: 3 },
        { month: 'May', applications: 110, interviews: 18, hires: 4 },
        { month: 'Jun', applications: 135, interviews: 22, hires: 5 },
        { month: 'Jul', applications: 148, interviews: 26, hires: 6 },
      ]
    };
  },

  // Team Management
  getTeamMembers: async (): Promise<EmployerTeamMember[]> => {
    // TODO: Replace with Firebase Firestore call `collection(db, 'companies', companyId, 'team')`
    return [...mockTeamMembers];
  },

  inviteTeamMember: async (name: string, email: string, role: EmployerTeamMember['role']): Promise<EmployerTeamMember> => {
    // TODO: Replace with Firebase Auth user invite / Firestore write
    const newMember: EmployerTeamMember = {
      id: `team-${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      role,
      department: 'Talent Acquisition',
      status: 'Pending Invite',
      permissions: ['Candidate Screening', 'Interview Conducting'],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    mockTeamMembers.push(newMember);
    return newMember;
  },

  removeTeamMember: async (id: string): Promise<boolean> => {
    // TODO: Replace with Firebase Firestore deleteDoc
    const index = mockTeamMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      mockTeamMembers.splice(index, 1);
      return true;
    }
    return false;
  },

  // Notifications
  getNotifications: async (): Promise<EmployerNotification[]> => {
    // TODO: Replace with Firebase Firestore query
    return [
      {
        id: 'notif-e1',
        title: 'New Candidate Applied',
        message: 'Aisha Patel applied for Senior React Developer.',
        timestamp: '10 mins ago',
        category: 'application',
        read: false,
        link: '/employer/candidates'
      },
      {
        id: 'notif-e2',
        title: 'Interview Confirmed',
        message: 'Sarah Jenkins accepted the Technical Round invite for Aug 6.',
        timestamp: '1 hour ago',
        category: 'interview',
        read: false,
        link: '/employer/interviews'
      },
      {
        id: 'notif-e3',
        title: 'Offer Package Under Review',
        message: 'Elena Rostova viewed the offer letter for Staff UI/UX Architect.',
        timestamp: '3 hours ago',
        category: 'offer',
        read: true,
        link: '/employer/offers'
      }
    ];
  }
};
