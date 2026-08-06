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
  Palette
} from 'lucide-react';
import { NavItem } from '../types/layout';
import { ROUTES } from './routes';

export const GUEST_NAV_ITEMS: NavItem[] = [
  { id: 'jobs', label: 'Explore Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'about', label: 'About Us', path: ROUTES.ABOUT, icon: HelpCircle },
  { id: 'contact', label: 'Contact', path: ROUTES.CONTACT, icon: PhoneCall },
];

export const JOB_SEEKER_NAV_ITEMS: NavItem[] = [
  { id: 'jobs', label: 'Find Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'applications', label: 'My Applications', path: ROUTES.APPLICATIONS, icon: FileText, badge: 3 },
  { id: 'notifications', label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell, badge: 'New' },
  { id: 'profile', label: 'Profile', path: ROUTES.PROFILE, icon: User },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const EMPLOYER_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { id: 'post-job', label: 'Post a Job', path: ROUTES.POST_JOB, icon: PlusCircle },
  { id: 'my-jobs', label: 'Manage Jobs', path: ROUTES.MY_JOBS, icon: Briefcase, badge: 12 },
  { id: 'applications', label: 'Applicants', path: ROUTES.APPLICATIONS, icon: FileText, badge: 28 },
  { id: 'notifications', label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: Bell },
  { id: 'settings', label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Admin Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { id: 'jobs', label: 'Moderate Jobs', path: ROUTES.JOBS, icon: Briefcase },
  { id: 'companies', label: 'Manage Companies', path: ROUTES.COMPANIES, icon: Building2 },
  { id: 'settings', label: 'System Settings', path: ROUTES.SETTINGS, icon: Settings },
];

export const FOOTER_LINKS = {
  candidates: [
    { label: 'Browse Jobs', path: ROUTES.JOBS },
    { label: 'Browse Companies', path: ROUTES.COMPANIES },
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
    { label: 'Contact Us', path: ROUTES.CONTACT },
    { label: 'FAQ', path: ROUTES.FAQ },
    { label: 'Privacy Policy', path: ROUTES.PRIVACY },
    { label: 'Terms of Service', path: ROUTES.TERMS },
  ]
};
