// ============================================================================
// CANDIDATE PORTAL SERVICE (FIREBASE-READY PLACEHOLDER)
// All methods contain TODO comments for future Firebase Firestore / Auth integration
// ============================================================================

export interface SavedJobAlert {
  id: string;
  title: string;
  keywords: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  remoteOnly: boolean;
  frequency: 'daily' | 'weekly' | 'instant';
  enabled: boolean;
  createdAt: string;
  lastMatchedCount: number;
}

export interface CandidateNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'applications' | 'interviews' | 'job_matches' | 'recruiter_messages' | 'system';
  read: boolean;
  targetLink?: string;
  actionText?: string;
}

export interface UpcomingInterview {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  interviewDate: string; // ISO date string or formatted
  interviewTime: string;
  interviewType: 'Phone Screening' | 'Technical Round' | 'System Design' | 'HR & Culture' | 'Final Executive';
  interviewerName: string;
  interviewerRole: string;
  meetingLink: string;
  preparationChecklist: { id: string; text: string; completed: boolean }[];
  notes?: string;
}

export interface CandidateResume {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  isPrimary: boolean;
  downloadUrl: string;
  parsedSkills: string[];
}

export interface JobPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openToRemote: boolean;
  availabilityNotice: 'Immediate' | '2 Weeks' | '1 Month' | 'Negotiable';
  employmentTypes: ('Full-Time' | 'Part-Time' | 'Contract' | 'Remote')[];
}

export interface CareerInsightData {
  profileStrength: number;
  profileStrengthTips: string[];
  skillsDemand: { skill: string; demandScore: number; growth: string }[];
  recommendedSkills: { name: string; relevance: string; difficulty: string }[];
  applicationSuccessRate: number; // e.g. 35%
  recruiterViewsThisMonth: number;
  recentViews: { recruiterName: string; company: string; date: string }[];
  weeklyActivity: { day: string; applications: number; views: number }[];
}

// Initial Mock Datasets
let mockAlerts: SavedJobAlert[] = [
  {
    id: 'alert-1',
    title: 'Senior Frontend Engineer - Remote',
    keywords: ['React', 'TypeScript', 'Tailwind'],
    location: 'Remote / United States',
    salaryMin: 140000,
    salaryMax: 190000,
    experienceLevel: 'Senior Level',
    remoteOnly: true,
    frequency: 'daily',
    enabled: true,
    createdAt: '2026-07-20',
    lastMatchedCount: 12,
  },
  {
    id: 'alert-2',
    title: 'Full Stack & AI Developer',
    keywords: ['Node.js', 'Python', 'LLM', 'GraphQL'],
    location: 'San Francisco, CA',
    salaryMin: 160000,
    salaryMax: 220000,
    experienceLevel: 'Lead / Principal',
    remoteOnly: false,
    frequency: 'weekly',
    enabled: true,
    createdAt: '2026-07-28',
    lastMatchedCount: 5,
  },
];

let mockNotifications: CandidateNotification[] = [
  {
    id: 'notif-1',
    title: 'Interview Scheduled with TechCorp Global',
    message: 'Your Technical Systems Architecture round has been scheduled for tomorrow at 2:00 PM IST.',
    timestamp: '10 mins ago',
    category: 'interviews',
    read: false,
    targetLink: '/interviews',
    actionText: 'View Interview Prep',
  },
  {
    id: 'notif-2',
    title: 'Application Shortlisted',
    message: 'NexaAI Systems moved your application for Lead AI Developer to "Under Review".',
    timestamp: '2 hours ago',
    category: 'applications',
    read: false,
    targetLink: '/applications',
    actionText: 'Track Application',
  },
  {
    id: 'notif-3',
    title: 'New Recruiter Message',
    message: 'Sarah Jenkins (Senior Tech Recruiter at CloudScale) sent you a direct interview invite.',
    timestamp: '1 day ago',
    category: 'recruiter_messages',
    read: true,
    targetLink: '/notifications',
    actionText: 'Read Message',
  },
  {
    id: 'notif-4',
    title: '5 New Jobs Match Your Alert',
    message: 'New roles posted: Principal Frontend Architect at Stripe, Senior React Engineer at Vercel.',
    timestamp: '2 days ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
    actionText: 'Browse Matches',
  },
  {
    id: 'notif-5',
    title: 'Resume Parsing Completed',
    message: 'Your primary resume "Frontend_Architect_2026.pdf" was indexed and matched with 45 jobs.',
    timestamp: '3 days ago',
    category: 'system',
    read: true,
    targetLink: '/resumes',
    actionText: 'Manage Resumes',
  },
  {
    id: 'notif-6',
    title: 'Offer Letter Received from NexaAI Systems',
    message: 'Congratulations! NexaAI Systems has extended a formal employment offer for Lead AI Scientist.',
    timestamp: '3 hours ago',
    category: 'applications',
    read: false,
    targetLink: '/applications',
    actionText: 'View Offer',
  },
  {
    id: 'notif-7',
    title: 'Recruiter Viewed Your Profile',
    message: 'A talent acquisition partner at FinFlow Global viewed your full profile and resume.',
    timestamp: '4 hours ago',
    category: 'recruiter_messages',
    read: false,
    targetLink: '/profile',
    actionText: 'View Stats',
  },
  {
    id: 'notif-8',
    title: 'Profile Completion Reminder',
    message: 'Your profile strength is at 85%. Add 2 more verified project links to reach 100%.',
    timestamp: '5 hours ago',
    category: 'system',
    read: true,
    targetLink: '/profile',
    actionText: 'Update Profile',
  },
  {
    id: 'notif-9',
    title: 'Application Submitted Successfully',
    message: 'Your application for Full Stack Engineer at MindCraft AI was received by the hiring team.',
    timestamp: '1 day ago',
    category: 'applications',
    read: true,
    targetLink: '/applications',
    actionText: 'View Application',
  },
  {
    id: 'notif-10',
    title: 'Interview Reminder: Technical Round',
    message: 'Reminder: Your upcoming technical interview with TechCorp Global is in 24 hours.',
    timestamp: '1 day ago',
    category: 'interviews',
    read: false,
    targetLink: '/interviews',
    actionText: 'Join Prep',
  },
  {
    id: 'notif-11',
    title: 'Saved Job Salary Updated',
    message: 'CloudScale Infrastructure increased the compensation budget for Senior DevOps Engineer.',
    timestamp: '2 days ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
    actionText: 'Check Details',
  },
  {
    id: 'notif-12',
    title: 'Company Verification Status Updated',
    message: 'CyberGuard Security is now a Verified Employer on CareerConnect.',
    timestamp: '2 days ago',
    category: 'system',
    read: true,
    targetLink: '/companies',
    actionText: 'View Company',
  },
  {
    id: 'notif-13',
    title: 'System Announcement: Platform Upgrade',
    message: 'CareerConnect released new instant interview scheduling and real-time candidate notifications.',
    timestamp: '3 days ago',
    category: 'system',
    read: true,
    targetLink: '/dashboard',
  },
  {
    id: 'notif-14',
    title: 'New Candidate Recommendation',
    message: 'Based on your skills in React and Go, 8 new engineering positions were posted this week.',
    timestamp: '3 days ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-15',
    title: 'Interview Feedback Logged',
    message: 'Marcus Vance submitted positive interview feedback for your Technical Architecture round.',
    timestamp: '4 days ago',
    category: 'interviews',
    read: true,
    targetLink: '/interviews',
  },
  {
    id: 'notif-16',
    title: 'Recruiter Message from Acme Creative',
    message: 'Hi Alex, we loved your portfolio! Would you be open to a 15-minute introductory call?',
    timestamp: '4 days ago',
    category: 'recruiter_messages',
    read: true,
    targetLink: '/notifications',
  },
  {
    id: 'notif-17',
    title: 'Application Under Review',
    message: 'FinFlow Global hiring team has started reviewing your application for Lead Backend Engineer.',
    timestamp: '5 days ago',
    category: 'applications',
    read: true,
    targetLink: '/applications',
  },
  {
    id: 'notif-18',
    title: 'Saved Job Expiring Soon',
    message: 'The posting for Embedded Firmware Engineer at EdgeSystems will close in 2 days.',
    timestamp: '5 days ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-19',
    title: 'Security Alert: New Device Login',
    message: 'Your CareerConnect account was accessed from Chrome on macOS in Bengaluru, India.',
    timestamp: '6 days ago',
    category: 'system',
    read: true,
    targetLink: '/settings',
  },
  {
    id: 'notif-20',
    title: 'HR Round Scheduled with EduSpark',
    message: 'Your HR & Culture round with EduSpark Learning is confirmed for August 10 at 11:00 AM IST.',
    timestamp: '6 days ago',
    category: 'interviews',
    read: true,
    targetLink: '/interviews',
  },
  {
    id: 'notif-21',
    title: 'New Matching Job: Quantum Software Developer',
    message: 'QuantumBit Dynamics posted a new remote role in Amaravati matching your research background.',
    timestamp: '1 week ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-22',
    title: 'Application Status Update',
    message: 'Your application status for Senior DevOps Engineer at CloudScale was updated to "Under Review".',
    timestamp: '1 week ago',
    category: 'applications',
    read: true,
    targetLink: '/applications',
  },
  {
    id: 'notif-23',
    title: 'Weekly Profile Analytics Ready',
    message: 'Your profile appeared in 142 recruiter search results this past week (+28% increase).',
    timestamp: '1 week ago',
    category: 'system',
    read: true,
    targetLink: '/insights',
  },
  {
    id: 'notif-24',
    title: 'Recruiter Outreach: HealthPulse Tech',
    message: 'Dr. Priya Sharma invited you to apply for Senior Data Scientist - HealthTech Analytics.',
    timestamp: '1 week ago',
    category: 'recruiter_messages',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-25',
    title: 'Skill Assessment Badge Earned',
    message: 'You scored in the top 5% for React & TypeScript Technical Proficiency test.',
    timestamp: '2 weeks ago',
    category: 'system',
    read: true,
    targetLink: '/profile',
  },
  {
    id: 'notif-26',
    title: 'Application Viewed by HR Manager',
    message: 'The HR Director at PaySphere Systems opened your cover letter and candidate portfolio.',
    timestamp: '2 weeks ago',
    category: 'applications',
    read: true,
    targetLink: '/applications',
  },
  {
    id: 'notif-27',
    title: 'Job Recommendation Digest',
    message: 'Check out 10 featured engineering and AI positions selected for your experience level.',
    timestamp: '2 weeks ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-28',
    title: 'Interview Rescheduled',
    message: 'Your System Design round with NexaAI Systems was rescheduled to August 8th at 11:00 AM IST.',
    timestamp: '2 weeks ago',
    category: 'interviews',
    read: true,
    targetLink: '/interviews',
  },
  {
    id: 'notif-29',
    title: 'Saved Job Alert Triggered',
    message: '3 new Senior Full-Stack Engineer positions match your saved alert preferences.',
    timestamp: '2 weeks ago',
    category: 'job_matches',
    read: true,
    targetLink: '/jobs',
  },
  {
    id: 'notif-30',
    title: 'Welcome to CareerConnect Online Portal',
    message: 'Your candidate account has been fully verified and initialized with Cloud Firestore sync.',
    timestamp: '3 weeks ago',
    category: 'system',
    read: true,
    targetLink: '/dashboard',
  },
  {
    id: 'notif-31',
    title: 'Campus Event Announcement',
    message: 'VIT-AP University Career Hackathon 2026 is live! Top recruiters are reviewing project submissions.',
    timestamp: '3 weeks ago',
    category: 'system',
    read: true,
    targetLink: '/insights',
  },
  {
    id: 'notif-32',
    title: 'Recruiter Message: CodeCraft Solutions',
    message: 'We noticed your background in Java and microservices. Let us know if you are open for new opportunities.',
    timestamp: '3 weeks ago',
    category: 'recruiter_messages',
    read: true,
    targetLink: '/notifications',
  }
];

let mockInterviews: UpcomingInterview[] = [
  {
    id: 'int-1',
    jobId: 'job_101',
    jobTitle: 'Senior Frontend Engineer (React & TypeScript)',
    companyName: 'TechCorp Global',
    companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    interviewDate: '2026-08-07',
    interviewTime: '02:00 PM - 03:00 PM IST',
    interviewType: 'Technical Round',
    interviewerName: 'Marcus Vance',
    interviewerRole: 'VP of Engineering',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    preparationChecklist: [
      { id: 'c1', text: 'Review React 19 Server Components and Performance Hooks', completed: true },
      { id: 'c2', text: 'Prepare 3 STAR-method stories on leading frontend architecture', completed: true },
      { id: 'c3', text: 'Test microphone, camera, and secondary display setup', completed: true },
      { id: 'c4', text: 'Review TechCorp recent product announcements & engineering blog', completed: false },
    ],
    notes: 'Focus on component memoization, micro-frontend architecture, and state management at scale.',
  },
  {
    id: 'int-2',
    jobId: 'job_102',
    jobTitle: 'Lead AI & Machine Learning Scientist',
    companyName: 'NexaAI Systems',
    companyLogoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    interviewDate: '2026-08-08',
    interviewTime: '11:00 AM - 12:00 PM IST',
    interviewType: 'System Design',
    interviewerName: 'Dr. Elena Rostova',
    interviewerRole: 'Head of AI Research',
    meetingLink: 'https://zoom.us/j/987654321',
    preparationChecklist: [
      { id: 'c5', text: 'Study Transformer model serving & low-latency inference endpoints', completed: true },
      { id: 'c6', text: 'Prepare architecture diagram for real-time vector search pipeline', completed: true },
      { id: 'c7', text: 'Review experience with Gemini 1.5 Pro & Claude 3.5 Sonnet integrations', completed: false },
    ],
    notes: 'Discussion centered around real-time agentic workflows and prompt evaluation pipelines.',
  },
  {
    id: 'int-3',
    jobId: 'job_104',
    jobTitle: 'Senior DevOps & Platform Engineer',
    companyName: 'CloudScale Infrastructure',
    companyLogoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
    interviewDate: '2026-08-10',
    interviewTime: '04:00 PM - 05:00 PM IST',
    interviewType: 'Phone Screening',
    interviewerName: 'Sarah Jenkins',
    interviewerRole: 'Senior Tech Recruiter',
    meetingLink: 'https://meet.google.com/csh-devops-talk',
    preparationChecklist: [
      { id: 'c8', text: 'Prepare brief summary of Kubernetes deployment automation', completed: true },
      { id: 'c9', text: 'Confirm salary expectations and remote work availability', completed: true },
    ],
    notes: 'Initial screening round covering cultural alignment and infrastructure background.',
  },
  {
    id: 'int-4',
    jobId: 'job_106',
    jobTitle: 'Lead Backend Engineer (Node.js & Go)',
    companyName: 'FinFlow Global',
    companyLogoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop',
    interviewDate: '2026-08-12',
    interviewTime: '03:00 PM - 04:30 PM IST',
    interviewType: 'Technical Round',
    interviewerName: 'Rohan Mehta',
    interviewerRole: 'Principal Systems Architect',
    meetingLink: 'https://meet.google.com/finflow-tech-interview',
    preparationChecklist: [
      { id: 'c10', text: 'Review Go concurrency patterns and channel synchronization', completed: false },
      { id: 'c11', text: 'Brush up on PostgreSQL query indexing and transaction isolation', completed: false },
    ],
    notes: 'Live coding session focusing on microservices concurrency and distributed locking.',
  },
  {
    id: 'int-5',
    jobId: 'job_110',
    jobTitle: 'Full Stack Engineer (React & Python/FastAPI)',
    companyName: 'MindCraft AI',
    companyLogoUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop',
    interviewDate: '2026-08-14',
    interviewTime: '10:00 AM - 11:30 AM IST',
    interviewType: 'HR & Culture',
    interviewerName: 'Ananya Verma',
    interviewerRole: 'Head of Talent Acquisition',
    meetingLink: 'https://meet.google.com/mindcraft-hr-meeting',
    preparationChecklist: [
      { id: 'c12', text: 'Review MindCraft vision and generative AI product suite', completed: true },
      { id: 'c13', text: 'Prepare answers for leadership and team collaboration questions', completed: true },
    ],
    notes: 'HR culture fit round and benefits discussion.',
  },
  {
    id: 'int-6',
    jobId: 'job_111',
    jobTitle: 'Cloud Solutions Architect',
    companyName: 'TechCorp Global',
    companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    interviewDate: '2026-08-16',
    interviewTime: '02:00 PM - 03:00 PM IST',
    interviewType: 'Final Executive',
    interviewerName: 'Vikramaditya Rao',
    interviewerRole: 'Chief Technology Officer',
    meetingLink: 'https://meet.google.com/techcorp-cto-round',
    preparationChecklist: [
      { id: 'c14', text: 'Review enterprise multi-region disaster recovery proposal', completed: false },
      { id: 'c15', text: 'Prepare strategic cloud migration case study', completed: false },
    ],
    notes: 'Final interview round with CTO discussing long-term cloud strategy.',
  },
  {
    id: 'int-7',
    jobId: 'job_103',
    jobTitle: 'Staff Product Designer (UX/UI)',
    companyName: 'Acme Creative Studios',
    companyLogoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop',
    interviewDate: '2026-07-28',
    interviewTime: '11:00 AM - 12:00 PM IST',
    interviewType: 'Technical Round',
    interviewerName: 'Chloe Bennett',
    interviewerRole: 'Design Director',
    meetingLink: 'https://meet.google.com/acme-portfolio-review',
    preparationChecklist: [
      { id: 'c16', text: 'Present Figma design tokens and component system', completed: true },
    ],
    notes: 'Completed portfolio review. Candidate demonstrated high craftsmanship.',
  },
  {
    id: 'int-8',
    jobId: 'job_113',
    jobTitle: 'Android Developer (Kotlin & Jetpack Compose)',
    companyName: 'PaySphere Systems',
    companyLogoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop',
    interviewDate: '2026-07-20',
    interviewTime: '03:00 PM - 04:00 PM IST',
    interviewType: 'Phone Screening',
    interviewerName: 'Deepak Nair',
    interviewerRole: 'Mobile Engineering Manager',
    meetingLink: 'https://meet.google.com/paysphere-mobile-talk',
    preparationChecklist: [
      { id: 'c17', text: 'Review payment gateway architecture and Android security', completed: true },
    ],
    notes: 'Screening completed. Passed to technical live coding phase.',
  }
];

let mockResumes: CandidateResume[] = [
  {
    id: 'res-1',
    fileName: 'Frontend_Architect_Master_2026.pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-07-15',
    isPrimary: true,
    downloadUrl: '#',
    parsedSkills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Jest', 'Web Performance'],
  },
  {
    id: 'res-2',
    fileName: 'FullStack_AI_Specialist.pdf',
    fileSize: '980 KB',
    uploadDate: '2026-07-25',
    isPrimary: false,
    downloadUrl: '#',
    parsedSkills: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'LangChain', 'OpenAI API', 'Docker'],
  },
];

let mockPreferences: JobPreferences = {
  preferredRoles: ['Senior Frontend Engineer', 'Staff UI Architect', 'Full Stack Developer'],
  preferredLocations: ['Remote', 'San Francisco, CA', 'Seattle, WA', 'New York, NY'],
  salaryMin: 150000,
  salaryMax: 210000,
  currency: 'USD',
  openToRemote: true,
  availabilityNotice: '2 Weeks',
  employmentTypes: ['Full-Time', 'Remote'],
};

// ============================================================================
// SERVICE PLACEHOLDER FUNCTIONS
// ============================================================================

export const candidatePortalService = {
  // JOB ALERTS
  async getJobAlerts(): Promise<SavedJobAlert[]> {
    // TODO: Connect with Firebase Firestore collection `jobAlerts` (where userId == currentUser.uid)
    return new Promise(resolve => setTimeout(() => resolve([...mockAlerts]), 200));
  },

  async createJobAlert(alertData: Omit<SavedJobAlert, 'id' | 'createdAt' | 'lastMatchedCount'>): Promise<SavedJobAlert> {
    // TODO: Connect with Firebase Firestore addDoc(collection(db, 'jobAlerts'))
    const newAlert: SavedJobAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastMatchedCount: Math.floor(Math.random() * 10) + 1,
    };
    mockAlerts.unshift(newAlert);
    return newAlert;
  },

  async deleteJobAlert(alertId: string): Promise<boolean> {
    // TODO: Connect with Firebase Firestore deleteDoc(doc(db, 'jobAlerts', alertId))
    mockAlerts = mockAlerts.filter(a => a.id !== alertId);
    return true;
  },

  async toggleJobAlert(alertId: string, enabled: boolean): Promise<boolean> {
    // TODO: Connect with Firebase Firestore updateDoc(doc(db, 'jobAlerts', alertId), { enabled })
    mockAlerts = mockAlerts.map(a => a.id === alertId ? { ...a, enabled } : a);
    return true;
  },

  // NOTIFICATIONS
  async getNotifications(): Promise<CandidateNotification[]> {
    // TODO: Connect with Firebase Firestore collection `notifications` (where userId == currentUser.uid)
    return new Promise(resolve => setTimeout(() => resolve([...mockNotifications]), 150));
  },

  async markNotificationRead(id: string): Promise<boolean> {
    // TODO: Connect with Firebase Firestore updateDoc(doc(db, 'notifications', id), { read: true })
    mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    // TODO: Connect with Firebase Firestore writeBatch or multiple doc updates
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
    return true;
  },

  async deleteNotification(id: string): Promise<boolean> {
    // TODO: Connect with Firebase Firestore deleteDoc(doc(db, 'notifications', id))
    mockNotifications = mockNotifications.filter(n => n.id !== id);
    return true;
  },

  // INTERVIEWS
  async getInterviews(): Promise<UpcomingInterview[]> {
    // TODO: Connect with Firebase Firestore collection `interviews` (where candidateId == currentUser.uid)
    return new Promise(resolve => setTimeout(() => resolve([...mockInterviews]), 200));
  },

  async toggleChecklistItem(interviewId: string, checklistItemId: string): Promise<UpcomingInterview | null> {
    // TODO: Connect with Firebase Firestore updateDoc array union / map for checklist items
    const int = mockInterviews.find(i => i.id === interviewId);
    if (!int) return null;
    int.preparationChecklist = int.preparationChecklist.map(item =>
      item.id === checklistItemId ? { ...item, completed: !item.completed } : item
    );
    return { ...int };
  },

  // RESUME MANAGEMENT
  async getResumes(): Promise<CandidateResume[]> {
    // TODO: Connect with Firebase Firestore collection `resumes` and Firebase Storage `resumes/`
    return new Promise(resolve => setTimeout(() => resolve([...mockResumes]), 150));
  },

  async uploadResume(fileName: string, fileSize: string): Promise<CandidateResume> {
    // TODO: Connect with Firebase Storage uploadBytes(ref(storage, `resumes/${userId}/${fileName}`))
    const newResume: CandidateResume = {
      id: `res-${Date.now()}`,
      fileName,
      fileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      isPrimary: mockResumes.length === 0,
      downloadUrl: '#',
      parsedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    };
    mockResumes.unshift(newResume);
    return newResume;
  },

  async deleteResume(id: string): Promise<boolean> {
    // TODO: Connect with Firebase Storage deleteObject & Firestore deleteDoc
    mockResumes = mockResumes.filter(r => r.id !== id);
    if (mockResumes.length > 0 && !mockResumes.some(r => r.isPrimary)) {
      mockResumes[0].isPrimary = true;
    }
    return true;
  },

  async setPrimaryResume(id: string): Promise<boolean> {
    // TODO: Connect with Firebase Firestore updateDoc batch setting isPrimary = false then target isPrimary = true
    mockResumes = mockResumes.map(r => ({ ...r, isPrimary: r.id === id }));
    return true;
  },

  // PREFERENCES
  async getJobPreferences(): Promise<JobPreferences> {
    // TODO: Connect with Firebase Firestore doc(db, 'users', userId) candidatePreferences field
    return new Promise(resolve => setTimeout(() => resolve({ ...mockPreferences }), 150));
  },

  async updateJobPreferences(newPrefs: JobPreferences): Promise<JobPreferences> {
    // TODO: Connect with Firebase Firestore setDoc(doc(db, 'users', userId), { candidatePreferences: newPrefs }, { merge: true })
    mockPreferences = { ...newPrefs };
    return { ...mockPreferences };
  },

  // CAREER INSIGHTS
  async getCareerInsights(): Promise<CareerInsightData> {
    // TODO: Connect with Firebase Firestore cloud functions / analytics aggregation pipeline
    return new Promise(resolve => setTimeout(() => resolve({
      profileStrength: 92,
      profileStrengthTips: [
        'Add a custom GitHub or personal portfolio URL to gain +5% boost in recruiter interest.',
        'Upload an updated video introduction or 1-minute elevator pitch to unlock Priority Candidate badge.',
      ],
      skillsDemand: [
        { skill: 'React 19 & Next.js App Router', demandScore: 98, growth: '+24% this quarter' },
        { skill: 'TypeScript & Strict Type Systems', demandScore: 95, growth: '+18% this quarter' },
        { skill: 'LLM Prompt Engineering & RAG Systems', demandScore: 92, growth: '+45% this quarter' },
        { skill: 'Tailwind CSS & Component Systems', demandScore: 89, growth: '+12% this quarter' },
        { skill: 'System Architecture & Web Vitals Optimization', demandScore: 86, growth: '+15% this quarter' },
      ],
      recommendedSkills: [
        { name: 'GraphQL & Apollo Client', relevance: 'High Match for TechCorp & Stripe', difficulty: 'Intermediate' },
        { name: 'Docker & Micro-Frontends', relevance: 'Used in 65% of Senior Roles', difficulty: 'Advanced' },
        { name: 'Playwright & E2E Testing', relevance: 'In Demand for Lead Roles', difficulty: 'Intermediate' },
      ],
      applicationSuccessRate: 38,
      recruiterViewsThisMonth: 142,
      recentViews: [
        { recruiterName: 'Sarah Jenkins', company: 'CloudScale Infrastructure', date: '2 hours ago' },
        { recruiterName: 'David Zhang', company: 'NexaAI Systems', date: '1 day ago' },
        { recruiterName: 'Amanda Lewis', company: 'TechCorp Global', date: '3 days ago' },
      ],
      weeklyActivity: [
        { day: 'Mon', applications: 2, views: 18 },
        { day: 'Tue', applications: 4, views: 25 },
        { day: 'Wed', applications: 1, views: 32 },
        { day: 'Thu', applications: 5, views: 28 },
        { day: 'Fri', applications: 3, views: 22 },
        { day: 'Sat', applications: 0, views: 10 },
        { day: 'Sun', applications: 1, views: 7 },
      ],
    }), 200));
  },
};
