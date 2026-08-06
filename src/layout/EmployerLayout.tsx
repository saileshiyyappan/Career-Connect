import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { Badge } from '../components/common/Badge';
import {
  Building,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Users,
  Kanban,
  Calendar,
  Gift,
  BarChart3,
  UserCheck,
  Settings,
  Bell,
  Building2
} from 'lucide-react';

export const EmployerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/employer/company', icon: Building2 },
    { label: 'Manage Jobs', path: '/my-jobs', icon: Briefcase },
    { label: 'Post Job', path: '/post-job', icon: PlusCircle },
    { label: 'Candidates', path: '/employer/candidates', icon: Users },
    { label: 'Hiring Pipeline', path: '/employer/pipeline', icon: Kanban },
    { label: 'Interviews', path: '/employer/interviews', icon: Calendar },
    { label: 'Offers', path: '/employer/offers', icon: Gift },
    { label: 'Analytics', path: '/employer/analytics', icon: BarChart3 },
    { label: 'Team', path: '/employer/team', icon: UserCheck },
    { label: 'Settings', path: '/employer/settings', icon: Settings },
    { label: 'Alerts', path: '/employer/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Employer Workspace Top Header */}
      <div className="bg-cyan-500/10 dark:bg-cyan-950/40 border-b border-cyan-500/20 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              <Building className="w-3.5 h-3.5 mr-1" />
              Employer Portal (RMS / ATS)
            </Badge>
            <span className="text-slate-600 dark:text-slate-400 hidden sm:inline font-medium">
              TechCorp Global • Recruiter & Hiring Suite
            </span>
          </div>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Enterprise Account
          </span>
        </div>
      </div>

      {/* Employer Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-1 sm:space-x-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
