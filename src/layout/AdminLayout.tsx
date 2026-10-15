import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { Badge } from '../components/common/Badge';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building,
  Briefcase,
  FileCheck,
  ShieldAlert,
  BarChart3,
  Globe,
  Megaphone,
  Bell,
  Sliders,
  FileText,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const adminNavItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/employers', label: 'Employers', icon: Building },
    { to: '/admin/jobs', label: 'Job Moderation', icon: Briefcase },
    { to: '/admin/applications', label: 'Applications', icon: FileCheck },
    { to: '/admin/moderation', label: 'Moderation Reports', icon: ShieldAlert },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/content', label: 'CMS', icon: Globe },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/notifications', label: 'Alerts', icon: Bell },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
    { to: '/admin/settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Admin Header Banner */}
      <div className="bg-purple-500/10 dark:bg-purple-950/40 border-b border-purple-500/20 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Administrator Portal
            </Badge>
            <span className="text-slate-600 dark:text-slate-400 hidden sm:inline font-medium">
              Platform Moderation & Compliance Center
            </span>
          </div>
          <span className="text-purple-600 dark:text-purple-400 font-bold">Admin Privileges Active</span>
        </div>
      </div>

      {/* Admin Sub-Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 py-2 text-xs font-bold min-w-max">
            {adminNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

