import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { Badge } from '../components/common/Badge';
import { UserCheck } from 'lucide-react';

export const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      
      {/* Candidate Workspace Banner */}
      <div className="bg-blue-500/10 dark:bg-blue-950/40 border-b border-blue-500/20 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">
              <UserCheck className="w-3 h-3 mr-1" />
              Candidate Workspace
            </Badge>
            <span className="text-slate-600 dark:text-slate-400 hidden sm:inline font-medium">
              Welcome back! Explore your active job applications and recommendations.
            </span>
          </div>
          <span className="text-slate-500 font-medium">Verified Account</span>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
