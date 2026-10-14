import { 
  Briefcase, 
  Building2, 
  FileText, 
  Bell, 
  Settings, 
  User, 
  PlusCircle, 
  LayoutDashboard,
  HelpCircle,
  PhoneCall,
  Palette,
  Newspaper,
  Search,
  Users,
  Megaphone,
  UserCheck,
  Calendar,
  Bookmark,
  GraduationCap,
  BarChart3,
  Kanban
} from 'lucide-react';
import { NavItem } from '../types/layout';
import { ROUTES } from './routes';

export const GUEST_NAV_ITEMS: NavItem[] = [
  { id: 'jobs', label: 'Explore Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'news', label: 'Career News', path: ROUTES.NEWS, icon: Newspaper },
  { id: 'about', label: 'About Us', path: ROUTES.ABOUT, icon: HelpCircle },
  { id: 'contact', label: 'Contact', path: ROUTES.CONTACT, icon: PhoneCall },
];

export const JOB_SEEKER_NAV_ITEMS: NavItem[] = [
  { id: 'jobs', label: 'Find Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'news', label: 'Career News', path: ROUTES.NEWS, icon: Newspaper },
  { id: 'applications', label: 'My Applications', path: ROUTES.APPLICATIONS, icon: FileText },
  { id: 'notifications', label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  { id: 'profile', label: 'Profile', path: ROUTES.PROFILE, icon: User },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const EMPLOYER_NAV_ITEMS: NavItem[] = [
  { id: 'employer-dashboard', label: 'Dashboard', path: ROUTES.EMPLOYER_DASHBOARD, icon: LayoutDashboard },
  { id: 'employer-applicants', label: 'Applicants', path: ROUTES.EMPLOYER_APPLICANTS, icon: Users },
  { id: 'employer-news', label: 'News', path: ROUTES.EMPLOYER_NEWS, icon: Newspaper },
  { id: 'my-jobs', label: 'My Jobs', path: ROUTES.EMPLOYER_MY_JOBS, icon: Briefcase },
  { id: 'employer-campaigns', label: 'Hiring Campaigns', path: ROUTES.EMPLOYER_CAMPAIGNS, icon: Megaphone },
  { id: 'employer-interviews', label: 'Interviews', path: ROUTES.EMPLOYER_INTERVIEWS, icon: Calendar },
  { id: 'employer-company', label: 'Company Profile', path: ROUTES.EMPLOYER_COMPANY, icon: Building2 },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Admin Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { id: 'jobs', label: 'Moderate Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Manage Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'news', label: 'Career News', path: ROUTES.NEWS, icon: Newspaper },
  { id: 'settings', label: 'System Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const FOOTER_LINKS = {
  candidates: [
    { label: 'Browse Jobs', path: ROUTES.JOBS },
    { label: 'Browse Companies', path: ROUTES.COMPANIES },
    { label: 'Career News & Reports', path: ROUTES.NEWS },
    { label: 'Salary Calculator', path: ROUTES.JOBS },
    { label: 'Career Advice', path: ROUTES.ABOUT },
  ],
  employers: [
    { label: 'Post a Job', path: ROUTES.POST_JOB },
    { label: 'Browse Candidates', path: ROUTES.DASHBOARD },
    { label: 'Employer Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Pricing Plans', path: ROUTES.ABOUT },
  ],
  company: [
    { label: 'About CareerConnect', path: ROUTES.ABOUT },
    { label: 'Career News', path: ROUTES.NEWS },
    { label: 'Contact Us', path: ROUTES.CONTACT },
    { label: 'FAQ', path: ROUTES.FAQ },
    { label: 'Privacy Policy', path: ROUTES.PRIVACY },
    { label: 'Terms of Service', path: ROUTES.TERMS },
  ]
};
