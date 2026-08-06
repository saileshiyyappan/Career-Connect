import React from 'react';
import { AdminEmployer } from '../../services/adminPortalService';
import { Badge } from '../common/Badge';
import { Building, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react';

interface VerificationCardProps {
  employer: AdminEmployer;
  onVerify: (id: string, status: AdminEmployer['status']) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({
  employer,
  onVerify,
}) => {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={employer.logo}
            alt={employer.companyName}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {employer.companyName}
              </h4>
              <Badge variant={employer.status === 'Verified' ? 'success' : employer.status === 'Pending' ? 'warning' : 'danger'} size="sm">
                {employer.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">{employer.industry} • {employer.contactEmail}</p>
          </div>
        </div>
      </div>

      {employer.verificationDocUrl && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Corporate Tax / License Document</span>
          </div>
          <a
            href={employer.verificationDocUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 hover:underline"
          >
            Review PDF <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {employer.status === 'Pending' && (
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onVerify(employer.id, 'Rejected')}
            className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject Request
          </button>
          <button
            onClick={() => onVerify(employer.id, 'Verified')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve & Verify Company
          </button>
        </div>
      )}
    </div>
  );
};
