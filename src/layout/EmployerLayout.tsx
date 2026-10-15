import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  PlusCircle,
} from 'lucide-react';

export const EmployerLayout: React.FC = () => {
  const { user } = useAuth();
  const companyLabel = (user as any)?.companyName || 'Verified Organization';
  const positionLabel = (user as any)?.employerPosition || (user as any)?.professionalTitle || 'Recruiter & Hiring Suite';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Employer Organization Context Strip */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              Employer Portal
            </span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-none">
              {companyLabel} · {positionLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold hidden md:flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Employer Suite
            </span>
            <Link
              to="/post-job"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Job</span>
            </Link>
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

