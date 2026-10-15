import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ApplicationCard } from '../../components/cards/ApplicationCard';
import { ApplicationDetailsModal } from '../../components/modals/ApplicationDetailsModal';
import { EmptyState } from '../../components/common/EmptyState';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { JobApplication, ApplicationStatus } from '../../types';
import { FileText, Filter, CheckCircle2, Clock, Send, Search, Eye } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, userProfile, updateApplicationStatus } = useJobContext();
  const { role, user } = useAuth();
  const isEmp = user?.role === 'employer' || role === 'employer';
  const effectiveRole = isEmp ? 'employer' : (user?.role || role);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAppForDetails, setSelectedAppForDetails] = useState<JobApplication | null>(null);

  const currentUid = user?.uid || userProfile?.uid;
  const myApplications = effectiveRole === 'employer' 
    ? applications 
    : applications.filter(a => a.applicantId === currentUid || (currentUid && a.applicantId === currentUid));

  const filteredApps = statusFilter === 'All'
    ? myApplications
    : statusFilter === 'under_review'
    ? myApplications.filter(a => a.status === 'under_review' || a.status === 'shortlisted' || a.status === 'viewed')
    : myApplications.filter(a => a.status === statusFilter);

  const filterTabs = [
    { key: 'All', label: 'All Applications' },
    { key: 'applied', label: 'Applied' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'interviewing', label: 'Interview Scheduled' },
    { key: 'offered', label: 'Offer Received' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'withdrawn', label: 'Withdrawn' },
  ];

  const handleWithdraw = (appId: string) => {
    updateApplicationStatus(appId, 'withdrawn');
  };

  return (
    <PageContainer className="py-8 space-y-8">
      
      {/* Header */}
      <SectionHeader
        title="Application Tracking & Pipeline"
        subtitle="Monitor step-by-step progress, interview invitations, and recruiter feedback for all active job submissions."
        badge="Candidate Workspace"
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications Grid */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications found"
          description="You have no active applications matching the selected status filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="relative group">
              <ApplicationCard application={app} />
              
              {/* Quick Details Overlay Trigger */}
              <div className="mt-2 text-right">
                <button
                  onClick={() => setSelectedAppForDetails(app)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pipeline Details & Actions</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Details & Timeline Modal */}
      <ApplicationDetailsModal
        application={selectedAppForDetails}
        isOpen={!!selectedAppForDetails}
        onClose={() => setSelectedAppForDetails(null)}
        onWithdraw={handleWithdraw}
      />

    </PageContainer>
  );
};
