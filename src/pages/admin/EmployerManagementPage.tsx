import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { VerificationCard } from '../../components/admin/VerificationCard';
import { adminPortalService, AdminEmployer } from '../../services/adminPortalService';
import {
  Building,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  ExternalLink,
  Briefcase,
  Users,
} from 'lucide-react';

export const EmployerManagementPage: React.FC = () => {
  const [employers, setEmployers] = useState<AdminEmployer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    adminPortalService.getEmployers().then(setEmployers);
  }, []);

  const handleVerify = async (id: string, status: AdminEmployer['status']) => {
    await adminPortalService.verifyEmployer(id, status);
    setEmployers((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    setActionSuccess(`Employer status updated to ${status}`);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleToggleFeatured = async (id: string) => {
    await adminPortalService.toggleEmployerFeatured(id);
    setEmployers((prev) =>
      prev.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
    );
  };

  const filteredEmployers = employers.filter((e) => {
    const matchesSearch =
      e.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    return true;
  });

  const pendingEmployers = employers.filter((e) => e.status === 'Pending');

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Employer Accounts & Verification Hub"
        subtitle="Review corporate credentials, approve employer verification, and manage featured corporate partners."
        badge="Enterprise Moderation"
      />

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {actionSuccess}
        </div>
      )}

      {/* Verification Requests Section */}
      {pendingEmployers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Verification Document Review Queue ({pendingEmployers.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingEmployers.map((emp) => (
              <VerificationCard key={emp.id} employer={emp} onVerify={handleVerify} />
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company name, industry, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Verified', 'Pending', 'Suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status === 'all' ? 'All Companies' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Employers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEmployers.map((emp) => (
          <div
            key={emp.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={emp.logo}
                  alt={emp.companyName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {emp.companyName}
                    </h4>
                    <Badge
                      variant={
                        emp.status === 'Verified'
                          ? 'success'
                          : emp.status === 'Pending'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {emp.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {emp.industry} • {emp.contactEmail}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleFeatured(emp.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  emp.featured
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-200 dark:border-amber-900/50'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'
                }`}
                title="Toggle Featured Partner Status"
              >
                <Star className={`w-4 h-4 ${emp.featured ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Active Openings</span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                  {emp.activeJobs} positions
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Total Hires</span>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
                  {emp.totalHires} candidates
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Joined: {emp.joinedDate}</span>

              <div className="flex gap-2">
                {emp.status !== 'Verified' && (
                  <button
                    onClick={() => handleVerify(emp.id, 'Verified')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Verify
                  </button>
                )}
                {emp.status !== 'Suspended' && (
                  <button
                    onClick={() => handleVerify(emp.id, 'Suspended')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
